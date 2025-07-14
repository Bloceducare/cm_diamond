"use client";
import {
  SUPPORTED_CHAIN_IDS,
  isSupportedChain,
  CHAIN_ID_TO_NAME,
} from "@/constants/chain";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useDisconnect } from "wagmi";

export const WalletConnected = ({
  address,
  icon,
}: {
  address: string | undefined;
  icon: string | undefined;
}) => {
  const { selectedNetworkId } = useWeb3ModalState();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const formatAddress = (address: string | undefined) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const switchNetwork = async () => {
    try {
      await open({ view: "Networks" });
    } catch (error) {
      console.error("Failed to open network switcher:", error);
    }
  };

  const disconnectWallet = async () => {
    try {
      disconnect();
    } catch (error) {
      console.error("Failed to open network switcher:", error);
    }
  };

  // Ensure selectedNetworkId is a number before passing to isSupportedChain
  const currentNetworkId =
    selectedNetworkId !== undefined ? Number(selectedNetworkId) : undefined;

  useEffect(() => {
    if (!isSupportedChain(currentNetworkId)) {
      toast.error(`Unsupported network detected. Please switch to one of the supported
          networks:
          ${SUPPORTED_CHAIN_IDS.map((id) => CHAIN_ID_TO_NAME[id]).join(
            ", "
          )}.`);
    }
  }, [currentNetworkId]);

  return (
    <>
      {!isSupportedChain(currentNetworkId) ? (
        <span
          onClick={switchNetwork}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Switch Network
        </span>
      ) : (
        <span
          className="flex items-center gap-2"
          onClick={() => disconnectWallet()}
        >
          <span className="w-6 h-6 rounded-full overflow-hidden">
            <img
              src={icon}
              alt="Wallet Icon"
              className="w-full h-full object-cover"
            />
          </span>
          <span>{formatAddress(address)}</span>
        </span>
      )}
    </>
  );
};
