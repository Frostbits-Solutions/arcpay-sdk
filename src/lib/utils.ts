import {ABIMethod} from 'algosdk'
import {type ClassValue, clsx} from 'clsx'
import {extendTailwindMerge} from "tailwind-merge";
import type AlgodClient from "algosdk/dist/types/client/v2/algod/algod";

const twMerge = extendTailwindMerge({
    prefix: "ap-",
});

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function longToByteArray(long: number, n: number | undefined = 32): Uint8Array {
    const byteArray = []
    for (let i = 0; i < n; i++) {
        byteArray.push(0)
    }

    for (let index = byteArray.length - 1; index >= 0; index--) {
        const byte = long & 0xff
        byteArray[index] = byte
        long = (long - byte) / 256
    }

    return new Uint8Array(byteArray)
}

export function base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes
}

export function getShortAddress(address: string): string {
    return `${address.slice(0, 4)}...${address.slice(address.length - 5, address.length)}`
}

export function encodeAppArgs(abiMethod: ABIMethod, args: any[]) {
    const appArgs = args.map((arg, index) => {
        // @ts-ignore
        return abiMethod.args[index].type.encode(arg);
    });
    return [abiMethod.getSelector(), ...appArgs]
}

export async function getFeesAppIdFromState(algod: AlgodClient, appId: number): Promise<number> {
    const appInfo = await algod.getApplicationByID(appId).do();
    const globalState = appInfo.params['global-state'];
    for (let i = 0; i < globalState.length; i++) {
        if (atob(globalState[i].key) === 'fees_app_id') return globalState[i].value.uint as number
    }
    return -1
}

export async function getRekeyAddress(algod: AlgodClient, address: string): Promise<string|undefined> {
    return (await algod.accountInformation(address).do())["auth-addr"]
}

export function formatAmountToDecimals(amount: number, decimals: number = 6) {
    return amount * (10 ** decimals)
}

export function formatAmountFromDecimals(amount: number, decimals: number = 6) {
    return amount / (10 ** decimals)
}

export function formatPrice(price: number = 0, decimals: number = 0) {
    return parseFloat(price.toFixed(decimals))
}
