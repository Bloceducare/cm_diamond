import { ethers } from "ethers";
import { OrganisationFactoryABI } from "./ABIs/OrganisationFactoryABI";
import { OrganisationABI } from "./ABIs/OrganisationABI";
import { OrganisationNFTABI } from "./ABIs/OrganisationNFTABI";
import { InterfaceAbi } from "ethers";

export const getOrgFactoryContract = (
  providerOrSigner: ethers.Provider | ethers.Signer,
  chainId: string,
) => {
  let addressToBeUsed: `0x${string}`;

  switch (chainId as string) {
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
        .NEXT_PUBLIC_ARBITRUM_ORG_FACTORY_CONTRACT as `0x${string}`;
      break;

    default:
      addressToBeUsed = process.env
        .NEXT_PUBLIC_LISK_ORG_FACTORY_CONTRACT as `0x${string}`;
      break;
  }
  return new ethers.Contract(
    addressToBeUsed,
    OrganisationFactoryABI,
    providerOrSigner,
  );
};

export const getOrgContract = (
  providerOrSigner: ethers.Provider | ethers.Signer,
  contractAddress: string,
) => {
  return new ethers.Contract(
    contractAddress,
    OrganisationABI,
    providerOrSigner,
  );
};

export const getOrgNFTContract = (
  providerOrSigner: ethers.Provider | ethers.Signer,
) => {
  return new ethers.Contract(
    `${process.env.NEXT_PUBLIC_ORG_NFT_CONTRACT}`,
    OrganisationNFTABI as InterfaceAbi,
    providerOrSigner,
  );
};
