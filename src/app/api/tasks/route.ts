import { Task } from '@/app/home/components/content/components/list-content'
import { getUserIdFromToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
    try {
        const userId = await getUserIdFromToken()
        
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized.' },
                { status: 401 }
            )
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                lists: {
                    include: {
                        tasks: {
                            include: {
                                tags: true,
                                subtasks: true
                            }
                        }
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found.' },
                { status: 404 }
            )
        }

        const tasks = user.lists.flatMap(list => list.tasks)

        let todayTasks: Task[] = []
        let tomorrowTasks: Task[] = []
        let thisWeekTasks: Task[] = []

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const tomorrow = new Date(today)
        tomorrow.setDate(today.getDate() + 1)

        const dayAfterTomorrow = new Date(today)
        dayAfterTomorrow.setDate(today.getDate() + 2)

        const endOfWeek = new Date(today)
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()))
        endOfWeek.setHours(0, 0, 0, 0)

        const hasThisWeekRange = dayAfterTomorrow <= endOfWeek

        tasks.forEach(task => {
            if (!task.dueDate) {
                return
            }

            const dueDate = new Date(task.dueDate)
            dueDate.setHours(0, 0, 0, 0)

            const newTask = {
                id: task.id,
                title: task.title,
                description: task.description,
                createdAt: task.dueDate.toDateString(),
                dueDate: task.dueDate.toDateString(),
                listId: task.listId,
                tags: task.tags,
                subtasks: task.subtasks
            }

            if (dueDate.getTime() == today.getTime()) {
                todayTasks.push(newTask)
            } else if (dueDate.getTime() == tomorrow.getTime()) {
                tomorrowTasks.push(newTask)
            } else if (
                hasThisWeekRange && dueDate.getTime() >= dayAfterTomorrow.getTime() 
                && dueDate.getTime() <= endOfWeek.getTime()
            ) {
                thisWeekTasks.push(newTask)
            }
        })

        return NextResponse.json(
            { todayTasks, tomorrowTasks, thisWeekTasks },
            { status: 200 }
        )
    } catch (error) {
        console.log(error)

        return NextResponse.json(
            { error: 'Invalid request.' },
            { status: 400 }
        )
    }
}
