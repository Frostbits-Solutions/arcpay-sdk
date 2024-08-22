export interface ABI {
  name: string
  description: string
  methods: Method[]
  events: Event[]
}

export interface Method {
  name: string
  args: Object[]
  returns: Object
  readonly: boolean
}

export interface Event {
  name: string
  args: Object[]
  desc: string
}

export interface Object {
  type: "address" | "uint256" | "bool" | "byte[256]" | "void" | "byte[4]"
  name?: string
  desc?: string
}
