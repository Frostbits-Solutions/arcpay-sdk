import { ABIMethod } from 'algosdk'

export function longToByteArray (long: number, n:number | undefined= 32): Uint8Array {
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

export function base64ToArrayBuffer (base64: string) {
  const binaryString = window.atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}


export function fromHexString (hexString:string): Uint8Array
export function fromHexString (hexString: string, radix = 16): Uint8Array {
  // @ts-ignore
  return Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, radix)))
}

export function toHexString (bytes: Uint8Array): string {
  // @ts-ignore
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}

export function encodeAppArgs (abiMethod: ABIMethod,  args: any[]) {
  const appArgs = args.map((arg, index) => {
    // @ts-ignore
    return abiMethod.args[index].type.encode(arg);
  });
  return [abiMethod.getSelector(), ...appArgs]
}

export function concatUint8Array (a: Uint8Array, b: Uint8Array): Uint8Array {
  const t = new Uint8Array(a.length + b.length)
  t.set(a, 0)
  t.set(b, a.length)
  return t
}

export function getShortAddress (address: string): string {
  return `${address.slice(0,4)}...${address.slice(address.length - 5, address.length - 1)}`
}

