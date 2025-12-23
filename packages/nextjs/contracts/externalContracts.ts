import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const externalContracts = {
  84532: {
    USDC: {
      address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      abi: [
        {
          inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
          ],
          name: "approve",
          outputs: [{ name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
          ],
          name: "allowance",
          outputs: [{ name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ name: "account", type: "address" }],
          name: "balanceOf",
          outputs: [{ name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
      ],
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
