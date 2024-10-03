import { api } from '@/lib/api'

export async function userLogin(name, email, picture) {
    try {
        const response = await api.post('/users', {
            name, 
            email, 
            picture
        })

        return response.data
    } catch (error) {
        console.log(error)
    }
}
