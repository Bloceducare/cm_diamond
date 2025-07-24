import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { baseSepolia, lisk, arbitrum } from "wagmi/chains";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Classmate",
  description: "An onchain LMS system",
  url: "https://classmate-v2.web3bridge.com/",
  icons: ["https://classmate-v2.web3bridge.com/favicon.ico"], // Use full URL
};

const chains = [baseSepolia, lisk, arbitrum] as const;

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  enableWalletConnect: true, // Explicitly enable WalletConnect
  enableInjected: true, // Enable injected wallets
  enableEIP6963: true, // Enable EIP6963 discovery
});
// ---------
// import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
// import { cookieStorage, createStorage } from "wagmi";
// import { baseSepolia, lisk, arbitrum } from "wagmi/chains";
//
// // Get projectId from https://cloud.walletconnect.com
// export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
//
// if (!projectId) throw new Error("Project ID is not defined");
//
// const metadata = {
//   name: "Classmate",
//   description: "An onchain LMS system",
//   url: "https://classmate-v2.web3bridge.com/",
//   icons: ["/favicon.ico"],
// };
//
// // Create wagmiConfig
// const chains = [baseSepolia, lisk, arbitrum] as const;
// export const config = defaultWagmiConfig({
//   chains,
//   projectId,
//   metadata,
//   ssr: true,
//   storage: createStorage({
//     storage: cookieStorage,
//   }),
// });
