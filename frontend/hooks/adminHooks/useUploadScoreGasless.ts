import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

const useUploadScoreGasless = (
  testId: string | number | bigint,
  data: any[],
  apiKey: string,
  secretKey: string,
) => {
  const [isWriting, setIsWriting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [scoreURI, setScoreURI] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const { address } = useAccount();
  const toastId = "uploadStudentsScore";

  const active_organisation = window.localStorage?.getItem(
    "active_organisation",
  );
  const contract_address = active_organisation
    ? JSON.parse(active_organisation)
    : null;

  const getJson = useCallback(async () => {
    if (!data || data.length === 0) {
      setIsConverting(false);
      toast.error("No data found", { id: toastId, position: "top-right" });
      throw new Error("No data found");
    }

    setIsConverting(true);
    try {
      const jsonData = JSON.stringify(data);
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        { pinataContent: jsonData },
        {
          headers: {
            pinata_api_key: apiKey,
            pinata_secret_api_key: secretKey,
          },
        },
      );

      const fileUrl = response.data.IpfsHash;
      const gateWayAndhash = `https://gateway.pinata.cloud/ipfs/${fileUrl}`;
      setScoreURI(gateWayAndhash);
      setIsConverting(false);
      return fileUrl;
    } catch (err) {
      console.error("Pinata API Error:", err);
      setIsConverting(false);
      throw err;
    }
  }, [data, apiKey, secretKey]);

  const uploadStudentsScore = useCallback(async () => {
    if (!contract_address || !ethers.isAddress(contract_address)) {
      const err = new Error("Invalid contract address");
      setError(err);
      toast.error(err.message, { id: toastId, position: "top-right" });
      return;
    }
    if (!address || !ethers.isAddress(address)) {
      const err = new Error("Invalid caller address");
      setError(err);
      toast.error(err.message, { id: toastId, position: "top-right" });
      return;
    }
    if (
      !testId ||
      (typeof testId !== "string" &&
        typeof testId !== "number" &&
        typeof testId !== "bigint")
    ) {
      const err = new Error("Invalid testId format");
      setError(err);
      toast.error(err.message, { id: toastId, position: "top-right" });
      return;
    }

    try {
      setIsWriting(true);
      const fileUrl = await getJson();
      let formattedTestId: string;
      try {
        // Convert testId to a 32-byte hex string (ethers v6)
        const testIdBigInt = BigInt(testId);
        formattedTestId = ethers.zeroPadValue(ethers.toBeHex(testIdBigInt), 32);
      } catch (e) {
        const err = new Error(`Failed to format testId: ${testId}`);
        setError(err);
        throw err;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_RELAY_URL}/recordResults`,
        {
          contractAddress: contract_address,
          testId: formattedTestId,
          resultCid: fileUrl,
          caller: address,
        },
        { timeout: 30000 },
      );

      if (response.data.success) {
        toast.success("Score uploaded successfully!", {
          id: toastId,
          position: "top-right",
        });
        router.push("/admin/viewscores");
      } else {
        const err = new Error(response.data.message || "Transaction failed");
        setError(err);
        throw err;
      }
    } catch (err: any) {
      console.error("Upload Error:", err);
      setError(err);
      toast.error(err.message || "Something went wrong", {
        id: toastId,
        position: "top-right",
      });
    } finally {
      setIsWriting(false);
    }
  }, [getJson, testId, contract_address, address]);

  useEffect(() => {
    if (isConverting) {
      toast.loading("Converting...", { id: toastId, position: "top-right" });
    } else if (isWriting) {
      toast.loading("Sending to contract...", {
        id: toastId,
        position: "top-right",
      });
    }
  }, [isWriting, isConverting]);

  return {
    uploadStudentsScore,
    isWriting,
  };
};

export default useUploadScoreGasless;
