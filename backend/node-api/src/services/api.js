import { supabase } from '../lib/supabase'

export async function getTableData(tableName) {

    const { data, error } = await supabase
        .from(tableName)
        .select('*')

    if (error) {
        console.log(error)
        return []
    }

    return data
}