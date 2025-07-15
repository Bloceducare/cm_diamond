import { baseSepolia, lisk, arbitrum } from "wagmi/chains";

// Define supported chain IDs
export const SUPPORTED_CHAIN_IDS = [
  baseSepolia.id, // 84532
  lisk.id, // 1135
  arbitrum.id, // 42161
] as const;

// Check if the chain ID is supported
export const isSupportedChain = (
  chainId: number | undefined,
): chainId is (typeof SUPPORTED_CHAIN_IDS)[number] =>
  chainId !== undefined &&
  (SUPPORTED_CHAIN_IDS as readonly number[]).includes(chainId);

export const CHAIN_ID_TO_NAME: Record<
  (typeof SUPPORTED_CHAIN_IDS)[number],
  string
> = {
  [baseSepolia.id]: "Base Sepolia",
  [lisk.id]: "Lisk",
  [arbitrum.id]: "Arbitrum",
};
