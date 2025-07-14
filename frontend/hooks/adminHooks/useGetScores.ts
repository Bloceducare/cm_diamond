import { OrganisationABI } from "@/constants/ABIs/OrganisationABI";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useBlockNumber, useReadContract } from "wagmi";

const useGetScores = () => {
  const [list, setList] = useState<any[]>([]);

  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const active_organisation = window.localStorage?.getItem(
    "active_organisation"
  );
  const contract_address = JSON.parse(active_organisation as `0x${string}`);

  const {
    data: listOfScoreURI,
    error: listOfScoreURIError,
    isPending: listOfScoreURIIsPending,
    queryKey,
  } = useReadContract({
    address: contract_address,
    abi: OrganisationABI,
    functionName: "getResultCid",
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryClient, queryKey]);

  const fetchScores = useCallback(async () => {
    if (listOfScoreURI && listOfScoreURI.length > 0) {
      const formattedScoreURI = listOfScoreURI.map((uri: any) =>
        uri.toString()
      );

      const scorePromises = formattedScoreURI.map(async (hash, index) => {
        const url = `https://gateway.pinata.cloud/ipfs/${hash}`;
        try {
          const response = await axios.get(url);
          const formattedData = Object.values(JSON.parse(response.data));
          return { score: `Score ${index + 1}`, data: formattedData };
        } catch (error) {
          console.error(`Error fetching data for hash ${hash}:`, error);
          return { score: `Score ${index + 1}`, data: null };
        }
      });
      const results = await Promise.allSettled(scorePromises);
      const scores = results.map((result, index) => {
        if (result.status === "fulfilled") {
          return result.value;
        } else {
          console.error(
            `Error fetching data for hash ${formattedScoreURI[index]}:`,
            result.reason
          );
          return { score: `Score ${index + 1}`, data: null };
        }
      });
      setList(scores);
    }
  }, [listOfScoreURI]);

  useEffect(() => {
    if (listOfScoreURI) {
      fetchScores();
    }
  }, [listOfScoreURI, fetchScores]);

  return { list, listOfScoreURIError, listOfScoreURIIsPending };
};

export default useGetScores;
