import { OrganisationABI } from "@/constants/ABIs/OrganisationABI";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useBlockNumber, useReadContract } from "wagmi";

const useGetStudentScore = (address: any) => {
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

  const fetchStudentScores = useCallback(async () => {
    if (listOfScoreURI && listOfScoreURI.length > 0) {
      const formattedScoreURI = listOfScoreURI.map((uri: any) =>
        uri.toString()
      );

      const scorePromises = formattedScoreURI.map(async (hash, index) => {
        const url = `https://gateway.pinata.cloud/ipfs/${hash}`;
        try {
          const response = await axios.get(url);
          const formattedData = Object.values(JSON.parse(response.data));
          const studentScores = formattedData
            .filter(
              (record: any) =>
                record.student.toLowerCase() === address.toLowerCase()
            )
            .map((record: any) => ({
              ...record,
              scorelist: `Score ${index + 1}`,
            }));
          return studentScores;
        } catch (error) {
          console.error(`Error fetching data for hash ${hash}:`, error);
          return [];
        }
      });

      const scores = await Promise.all(scorePromises);
      const filteredScores = scores.flat();
      setList(filteredScores);
    }
  }, [listOfScoreURI, address]);

  useEffect(() => {
    if (listOfScoreURI) {
      fetchStudentScores();
    }
  }, [listOfScoreURI, fetchStudentScores]);

  return { list, listOfScoreURIError, listOfScoreURIIsPending };
};

export default useGetStudentScore;
