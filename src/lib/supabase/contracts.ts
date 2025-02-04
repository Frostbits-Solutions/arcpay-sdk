import type {SupabaseClient} from "@supabase/supabase-js";
import type {PublicNetwork} from "@/lib/algod/networks.config";

export default async function getContract(supabase: SupabaseClient, network: PublicNetwork, contractTag: string): Promise<string> {
    const {data, error} = await supabase.from('contracts_tags_association').select(`
      contracts ( byte_code )
    `).eq('chain', network).eq('tag', contractTag).eq('version', '0.0.10').returns<{ contracts: { byte_code: string } }[]>()
    if (error) throw new Error(`Error fetching contract: ${error.message}`)
    if (!data?.length) throw new Error(`Contract ${contractTag} not found`)
    return data[0].contracts.byte_code
}
