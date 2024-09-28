import type {SupabaseClient} from "@supabase/supabase-js";
import type {PublicNetwork} from "@/lib/algod/networks.config";
import {version} from "@/../package.json";

export default async function getContract(supabase: SupabaseClient, network: PublicNetwork, contractTag: string): Promise<string> {
    const {data, error} = await supabase.from('contracts_tags_association').select(`
      contracts ( byte_code )
    `).eq('chain', network).eq('tag', contractTag).eq('version', version).returns<{ contracts: { byte_code: string } }[]>()
    if (error) throw new Error(`Error fetching contract: ${error.message}`)
    if (!data?.length) throw new Error(`Contract ${contractTag} not found`)
    return data[0].contracts.byte_code
}
