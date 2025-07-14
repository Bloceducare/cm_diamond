"use client";
import { useBlockNumber, useReadContract, useChainId } from "wagmi";
import { toast } from "sonner";
import { useEffect, useState, useCallback } from "react";
import { OrganisationFactoryABI } from "@/constants/ABIs/OrganisationFactoryABI";
import { useQueryClient } from "@tanstack/react-query";
import { getOrgContract } from "@/constants/contracts";
import { getReadOnlyProvider } from "@/constants/provider";
import { useWeb3ModalState } from "@web3modal/wagmi/react";

const useGetUserOrganisations = (_userAddress: any) => {
  const [list, setList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const chainId = useChainId();
  const readOnlyProvider = getReadOnlyProvider(chainId);
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });
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
        .NEXT_PUBLIC_ORG_FACTORY_CONTRACT as `0x${string}`;
      break;
  }
  const {
    data: listOfOrganisations,
    error: listOfOrganisationsError,
    queryKey,
  } = useReadContract({
    address: addressToBeUsed,
    abi: OrganisationFactoryABI,
    functionName: "getUserOrganisatons",
    args: [_userAddress],
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryClient, queryKey]);

  const fetchUserOrganisations = useCallback(async () => {
    if (!listOfOrganisations) return;

    try {
      const formattedRes = listOfOrganisations.map((address: any) =>
        address.toString()
      );

      const data = formattedRes.map(async (address: any) => {
        const contract = getOrgContract(readOnlyProvider, address);
        const name = await contract.getOrganizationName();
        const cohort = await contract.getCohortName();
        const moderator = await contract.getModerator();
        const imageURI = await contract.getOrganisationImageUri();
        const status = await contract.getOrganizationStatus();
        const isMentor = await contract.verifyMentor(_userAddress);
        const isStudent = await contract.verifyStudent(_userAddress);
        return {
          address,
          name,
          cohort,
          moderator,
          imageURI,
          status,
          isMentor,
          isStudent,
        };
      });
      const results = await Promise.all(data);

      if (typeof window !== "undefined") {
        localStorage.setItem("memberOrganisations", JSON.stringify(results));
      }
      setIsLoading(false);
      setList(results);
    } catch (error) {
      console.error(error);
    }
  }, [listOfOrganisations?.length]);

  useEffect(() => {
    fetchUserOrganisations();
  }, [fetchUserOrganisations]);

  useEffect(() => {
    if (listOfOrganisationsError) {
      toast.error(listOfOrganisationsError.message, { position: "top-right" });
    }
  }, [listOfOrganisationsError]);

  return { list, isLoading };
};

export default useGetUserOrganisations;
