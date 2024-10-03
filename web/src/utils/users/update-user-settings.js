import { api } from '@/lib/api'

export async function updateUserSettings(userId, isDarkMode, isStickysColored) {
    try {
        await api.put(`/users/${userId}`, {
            isDarkMode,
            isStickysColored
        })
    } catch (error) {
        console.log(error)
    }
}
