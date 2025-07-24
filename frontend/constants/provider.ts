import { ethers } from "ethers";
import { baseSepolia, lisk, arbitrum } from "wagmi/chains";

// Chain-specific RPC URLs
const RPC_URLS = {
  lisk: process.env.NEXT_PUBLIC_LISK_RPC || "https://rpc.api.lisk.com",
  arbitrum:
    process.env.NEXT_PUBLIC_ARBITRUM_RPC || "https://arb1.arbitrum.io/rpc",
  baseSepolia:
    process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || "https://sepolia.base.org",
};

// Chain-specific WebSocket URLs
const WSS_URLS = {
  arbitrum: process.env.NEXT_PUBLIC_ARBITRUM_WSS || "",
  baseSepolia: process.env.NEXT_PUBLIC_WEBSOCKET_RPC || "",
};

// Get read-only provider for a specific chain
export const getReadOnlyProvider = (chainId: number) => {
  let rpcUrl = RPC_URLS.baseSepolia; // Default to Base Sepolia
  if (chainId === lisk.id) {
    rpcUrl = RPC_URLS.lisk;
  } else if (chainId === arbitrum.id) {
    rpcUrl = RPC_URLS.arbitrum;
  }
  if (!rpcUrl) {
    throw new Error(`No RPC URL configured for chain ID: ${chainId}`);
  }
  return new ethers.JsonRpcProvider(rpcUrl);
};

// Get WebSocket provider for a specific chain
export const getWssProvider = (chainId: number) => {
  let wssUrl = WSS_URLS.baseSepolia; // Default to Base Sepolia
  if (chainId === arbitrum.id) {
    wssUrl = WSS_URLS.arbitrum;
  }
  if (!wssUrl) {
    return getReadOnlyProvider(chainId); // Fallback to HTTP provider
  }
  return new ethers.WebSocketProvider(wssUrl);
};

// When wallet is connected, gets the provider
export const getProvider = (walletProvider: any) =>
  new ethers.BrowserProvider(walletProvider);

// When wallet is connected, gets the signer
export const getTheSigner = async (walletProvider: any) =>
  await walletProvider.getSigner();

// ====================================================================
// import { ethers } from "ethers";
//
// //when wallet is not connected, connects to the base sepolia rpc
// export const readOnlyProvider = new ethers.JsonRpcProvider(
//   `${process.env.NEXT_PUBLIC_HTTP_RPC}`
// );
//
// //when wallet is connected, gets the websocket provider
// export const wssProvider = new ethers.WebSocketProvider(
//   `${process.env.NEXT_PUBLIC_WEBSOCKET_RPC}`
// );
//
// //when wallet is connected, gets the provider
// export const getProvider = (walletProvider: any) =>
//   new ethers.BrowserProvider(walletProvider);
//
// //when wallet is connected, gets the signer
// export const getTheSigner = (walletProvider: any) => walletProvider.getSigner();
