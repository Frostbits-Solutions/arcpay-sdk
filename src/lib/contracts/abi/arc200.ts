export const arc200Schema = {
    name: "ARC-200",
    description: "Smart Contract Token Base Interface",
    methods: [
        {
            name: "arc200_name",
            desc: "Returns the name of the token",
            readonly: true,
            args: [],
            returns: {type: "byte[32]", desc: "The name of the token"}
        },
        {
            name: "arc200_symbol",
            desc: "Returns the symbol of the token",
            readonly: true,
            args: [],
            returns: {type: "byte[8]", desc: "The symbol of the token"}
        },
        {
            name: "arc200_decimals",
            desc: "Returns the decimals of the token",
            readonly: true,
            args: [],
            returns: {type: "uint8", desc: "The decimals of the token"}
        },
        {
            name: "arc200_totalSupply",
            desc: "Returns the total supply of the token",
            readonly: true,
            args: [],
            returns: {type: "uint256", desc: "The total supply of the token"}
        },
        {
            name: "arc200_balanceOf",
            desc: "Returns the current balance of the owner of the token",
            readonly: true,
            args: [
                {
                    type: "address",
                    name: "owner",
                    desc: "The address of the owner of the token"
                }
            ],
            returns: {
                type: "uint256",
                desc: "The current balance of the holder of the token"
            }
        },
        {
            name: "arc200_transfer",
            desc: "Transfers tokens",
            readonly: false,
            args: [
                {
                    type: "address",
                    name: "to",
                    desc: "The destination of the transfer"
                },
                {
                    type: "uint256",
                    name: "value",
                    desc: "Amount of tokens to transfer"
                }
            ],
            returns: {type: "bool", desc: "Success"}
        },
        {
            name: "arc200_transferFrom",
            desc: "Transfers tokens from source to destination as approved spender",
            readonly: false,
            args: [
                {
                    type: "address",
                    name: "from",
                    desc: "The source  of the transfer"
                },
                {
                    type: "address",
                    name: "to",
                    desc: "The destination of the transfer"
                },
                {
                    type: "uint256",
                    name: "value",
                    desc: "Amount of tokens to transfer"
                }
            ],
            returns: {type: "bool", desc: "Success"}
        },
        {
            name: "arc200_approve",
            desc: "Approve spender for a token",
            readonly: false,
            args: [
                {type: "address", name: "spender"},
                {type: "uint256", name: "value"}
            ],
            returns: {type: "bool", desc: "Success"}
        },
        {
            name: "arc200_allowance",
            desc: "Returns the current allowance of the spender of the tokens of the owner",
            readonly: true,
            args: [
                {type: "address", name: "owner"},
                {type: "address", name: "spender"}
            ],
            returns: {type: "uint256", desc: "The remaining allowance"}
        }
    ],
    events: [
        {
            name: "arc200_Transfer",
            desc: "Transfer of tokens",
            args: [
                {
                    type: "address",
                    name: "from",
                    desc: "The source of transfer of tokens"
                },
                {
                    type: "address",
                    name: "to",
                    desc: "The destination of transfer of tokens"
                },
                {
                    type: "uint256",
                    name: "value",
                    desc: "The amount of tokens transferred"
                }
            ]
        },
        {
            name: "arc200_Approval",
            desc: "Approval of tokens",
            args: [
                {
                    type: "address",
                    name: "owner",
                    desc: "The owner of the tokens"
                },
                {
                    type: "address",
                    name: "spender",
                    desc: "The approved spender of tokens"
                },
                {
                    type: "uint256",
                    name: "value",
                    desc: "The amount of tokens approve"
                }
            ]
        }
    ]
}
