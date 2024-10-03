import cors from '@fastify/cors'
import { fastify } from 'fastify'
import { validatorCompiler, serializerCompiler } from 'fastify-type-provider-zod'
import { userLogin } from './routes/users/user-login.js'
import { getUser } from './routes/users/get-user.js'
import { createList } from './routes/lists/create-list.js'
import { getLists } from './routes/lists/get-lists.js'
import { updateListTitle } from './routes/lists/update-list-title.js'
import { deleteList } from './routes/lists/delete-list.js'
import { createTask } from './routes/tasks/create-task.js'
import { getTasks } from './routes/tasks/get-tasks.js'
import { deleteTask } from './routes/tasks/delete-task.js'
import { updateTask } from './routes/tasks/update-task.js'
import { getUpcomingTasks } from './routes/tasks/get-upcoming-tasks.js'
import { createSticky } from './routes/stickys/create-sticky.js'
import { getStickys } from './routes/stickys/get-stickys.js'
import { updateUserSettings } from './routes/users/update-user-settings.js'
import { updateSticky } from './routes/stickys/update-sticky.js'
import { deleteSticky } from './routes/stickys/delete-sticky.js'
import { createTag } from './routes/tags/create-tag.js'
import { getTags } from './routes/tags/get-tags.js'
import { deleteTag } from './routes/tags/delete-tag.js'
import { addOrRemoveSubtask } from './routes/tasks/add-or-remove-subtask.js'
import { updateTagTitle } from './routes/tags/update-tag-title.js'
import { createEvent } from './routes/events/create-event.js'
import { getEvents } from './routes/events/get-events.js'
import { deleteEvent } from './routes/events/delete-event.js'
import { updateEvent } from './routes/events/update-event.js'
import { getUserItems } from './routes/users/get-user-items.js'

const app = fastify()

app.register(cors, { 
    origin: '*'
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(userLogin)
app.register(getUser)
app.register(updateUserSettings)
app.register(getUserItems)

app.register(createList)
app.register(getLists)
app.register(updateListTitle)
app.register(deleteList)

app.register(createTask)
app.register(getTasks)
app.register(deleteTask)
app.register(updateTask)
app.register(getUpcomingTasks)
app.register(addOrRemoveSubtask)

app.register(createSticky)
app.register(getStickys)
app.register(updateSticky)
app.register(deleteSticky)

app.register(createTag)
app.register(getTags)
app.register(deleteTag)
app.register(updateTagTitle)

app.register(createEvent)
app.register(getEvents)
app.register(deleteEvent)
app.register(updateEvent)

app.listen({ port: 3333 }).then(() => {
    console.log('🔥 Http server is running...')
})
