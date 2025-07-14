"use client";
import { useWeb3ModalState } from "@web3modal/wagmi/react";
import { OrganisationFactoryABI } from "./../../constants/ABIs/OrganisationFactoryABI";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from "wagmi";

const useCreateNewProgramme = (
  newOrganisationName: string,
  newProgrammeName: string,
  newImageURI: string,
  newAdminName: string,
  relayerAddress: `0x${string}`
) => {
  const router = useRouter();
  const [isWriting, setIsWriting] = useState(false);

  const { data: hash, error, writeContract } = useWriteContract();
  const { selectedNetworkId } = useWeb3ModalState();
  let addressToBeUsed: `0x${string}`;

  switch (selectedNetworkId?.toString() as string) {
    case "84532":
      addressToBeUsed = process.env
        .NEXT_PUBLIC_ORG_FACTORY_CONTRACT as `0x${string}`;
      break;
    case "1135":
      addressToBeUsed = process.env
        .NEXT_PUBLIC_LISK_ORG_FACTORY_CONTRACT as `0x${string}`;
      break;

    case "42161":
      addressToBeUsed = process.env
        .NEXT_PUBLIC_LISK_ORG_FACTORY_CONTRACT as `0x${string}`;
      break;

    default:
      addressToBeUsed = process.env
        .NEXT_PUBLIC_LISK_ORG_FACTORY_CONTRACT as `0x${string}`;
      break;
  }

  const createProgramme = useCallback(() => {
    setIsWriting(true);
    writeContract({
      address: addressToBeUsed,
      abi: OrganisationFactoryABI,
      functionName: "createorganisation",
      args: [
        newOrganisationName,
        newProgrammeName,
        newImageURI,
        newAdminName,
        relayerAddress,
      ],
    });
  }, [
    newOrganisationName,
    newProgrammeName,
    newImageURI,
    newAdminName,
    relayerAddress,
  ]);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const toastId = "createNewProgramme";

  useEffect(() => {
    if (isConfirming) {
      toast.loading("Processing...", {
        id: toastId,
        position: "top-right",
      });
    }

    if (isConfirmed) {
      toast.success("Programme created successfully !", {
        id: toastId,
        position: "top-right",
      });
      router.push("/viewprogramme");
      setIsWriting(false);
    }

    if (error) {
      toast.error((error as BaseError).shortMessage || error.message, {
        id: toastId,
        position: "top-right",
      });
      setIsWriting(false);
    }
  }, [isConfirmed, router, error, isConfirming]);

  return {
    createProgramme,
    isWriting,
    isConfirming,
  };
};

export default useCreateNewProgramme;
