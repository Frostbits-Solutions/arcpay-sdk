import type {SupabaseClient} from "@supabase/supabase-js";

export default async function getContract(supabase: SupabaseClient, contractTag: string): Promise<string> {
    const {data, error} = await supabase.from('contracts_tags').select(`
      contracts ( byte_code )
    `).eq('tag', contractTag).returns<{ contracts: { byte_code: string } }[]>()
    if (error) throw new Error(`Error fetching contract: ${error.message}`)
    if (!data?.length) throw new Error(`Contract ${contractTag} not found`)
    return data[0].contracts.byte_code
}
