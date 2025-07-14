import { http, createConfig } from "wagmi";
import { baseSepolia, lisk, arbitrum } from "wagmi/chains";

export const config = createConfig({
  chains: [baseSepolia, lisk, arbitrum],
  transports: {
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || ""),
    [lisk.id]: http(process.env.NEXT_PUBLIC_LISK_RPC || ""),
    [arbitrum.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_RPC || ""),
  },
});
