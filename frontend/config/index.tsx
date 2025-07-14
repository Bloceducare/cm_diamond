import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { baseSepolia, lisk, arbitrum } from "wagmi/chains";

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Classmate",
  description: "An onchain LMS system",
  url: "https://classmate.web3bridge.com/",
  icons: ["/favicon.ico"],
};

// Create wagmiConfig
const chains = [baseSepolia, lisk, arbitrum] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
