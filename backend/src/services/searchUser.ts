import { supabase } from "../lib/prismaClient"

const searchUser = async (email: string) => {
    let { data, error } = await supabase
        .from('users')
        .select('*').eq('email', email)
    if (error) {
        return { status: 0, message: 'Something went wrong' }
    } else {
        if (data) {
            return { status: 1, message: data[0].id }
        }
    }
}

export default searchUser