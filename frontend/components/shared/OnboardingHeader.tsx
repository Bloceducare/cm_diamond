"use client";
import { navLinks } from "@/utils/NavLinks";
import Logo from "./Logo";
import MaxWrapper from "./MaxWrapper";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { MobileNavToggler } from "./MobileNavToggler";
import { usePathname } from "next/navigation";
import { useScroll, useSpring, motion } from "framer-motion";
import { useWalletInfo, useWeb3Modal } from "@web3modal/wagmi/react";
import { WalletConnected } from "./WalletConnected";
import { useAccount, useSwitchChain, useChains } from "wagmi";
import { SUPPORTED_CHAIN_IDS } from "@/constants/chain";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const OnboardingHeader = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected, chainId } = useAccount();
  const { walletInfo } = useWalletInfo();
  const { switchChain } = useSwitchChain();
  const [selectNetwork, setSelectNetwork] = useState<string>(
    chainId ? String(chainId) : ""
  );
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (chainId) {
      setSelectNetwork(String(chainId));
    }
  }, [chainId]);

  const walletConnect = () => {
    if (!isConnected) {
      open();
    }
  };

  const allAvailableChains = useChains();
  useEffect(() => {
    if (
      isConnected &&
      SUPPORTED_CHAIN_IDS.includes(
        Number(selectNetwork) as 84532 | 1135 | 42161
      )
    ) {
      switchChain({ chainId: Number(selectNetwork) });
      toast.success(
        `Successfully connected to ${
          allAvailableChains.find(
            (allAvailableChain) =>
              allAvailableChain.id === Number(selectNetwork)
          )?.name
        }`
      );
    }
  }, [selectNetwork]);

  return (
    <header className="w-full">
      <div className="fixed top-0 inset-x-0 z-50 w-full bg-white h-20 lg:px-8 md:px-4 shadow-sm">
        <MaxWrapper className="h-full w-full flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex h-full items-stretch justify-center">
            {navLinks.map((link, _key) => (
              <Link
                href={link.href}
                key={_key}
                className={cn(
                  "text-base overflow-hidden relative before:absolute before:bottom-0 before:left-0 before:w-full before:h-0 before:bg-color1  before:transition-all before:duration-200 text-color2 before:-z-10  flex justify-center items-center px-6 transition",
                  {
                    "before:h-full text-white": link.href == pathname,
                    "hover:before:h-full hover:text-white":
                      link.href != pathname,
                  }
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3">
            {isConnected && (
              <Select
                value={selectNetwork}
                onValueChange={(value) => {
                  setSelectNetwork(value);
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select Chain" />
                </SelectTrigger>
                <SelectContent>
                  {allAvailableChains.map((chainObject) => (
                    <SelectItem
                      key={chainObject.id}
                      value={String(chainObject.id)}
                    >
                      {chainObject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
        
            <Button
              onClick={walletConnect}
              type="button"
              className={`transition-all duration-200  flex items-center gap-1 ${
                isConnected &&
                SUPPORTED_CHAIN_IDS.includes(
                  Number(selectNetwork) as 84532 | 1135 | 42161
                ) &&
                "bg-white text-color1 hover:bg-color1 hover:text-white border border-color1"
              } ${
                !isConnected &&
                "bg-color1 text-white border border-color1 hover:bg-color2"
              } ${
                isConnected &&
                !SUPPORTED_CHAIN_IDS.includes(
                  Number(selectNetwork) as 84532 | 1135 | 42161
                ) &&
                "bg-red-600 text-white border border-red-600 hover:bg-red-700"
              }`}
            >
              {isConnected ? (
                <WalletConnected address={address} icon={walletInfo?.icon} />
              ) : (
                <span>Connect Wallet</span>
              )}
            </Button>
            <div className="md:hidden">
              <MobileNavToggler />
            </div>
          </div>
        </MaxWrapper>
      </div>
      <motion.div
        className="fixed top-20 left-0 right-0 bg-color1 origin-[0%] h-[5px] z-[42]"
        style={{ scaleX }}
      />
    </header>
  );
};

export default OnboardingHeader;
