import { OrganisationABI } from "@/constants/ABIs/OrganisationABI";
import { getOrgContract } from "@/constants/contracts";
import { getReadOnlyProvider } from "@/constants/provider";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useBlockNumber, useChainId, useReadContracts } from "wagmi";

interface StatsData {
  totalClass: number;
  totalStudent: number;
  totalMentors: number;
  totalSignedAttendance: number;
  totalCertification: boolean | undefined;
}

const CACHE_KEY = "statsData";
const CACHE_DURATION = 3600 * 1000; // Cache for 1 hour (in milliseconds)

const useGetNumericStatistics = () => {
  const [statsData, setStatsData] = useState<StatsData>({
    totalClass: 0,
    totalStudent: 0,
    totalMentors: 0,
    totalSignedAttendance: 0,
    totalCertification: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const chainId = useChainId();
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: false }); // Disable continuous watch

  const active_organisation = useMemo(() => {
    const val = window?.localStorage?.getItem("active_organisation");
    return val ? (JSON.parse(val) as `0x${string}`) : undefined;
  }, []);

  const { data } = useReadContracts({
    contracts: active_organisation
      ? [
          {
            address: active_organisation,
            abi: OrganisationABI,
            functionName: "getLectureIds",
          },
          {
            address: active_organisation,
            abi: OrganisationABI,
            functionName: "listStudents",
          },
          {
            address: active_organisation,
            abi: OrganisationABI,
            functionName: "listMentors",
          },
        ]
      : [],
  });

  const fetchAllStats = useCallback(async () => {
    if (!data || !active_organisation) return;

    // Check cache first
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { data: cachedStats, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        setStatsData(cachedStats);
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(true);

    try {
      const [lectureIds, listOfStudents, listOfMentors] = data;

      const formattedLectureIds = lectureIds?.result?.map((id: any) =>
        id.toString(),
      );
      const formattedlistOfStudents: any = listOfStudents?.result?.map(
        (address: any) => address.toString(),
      );
      const formattedlistOfMentors = listOfMentors?.result?.map(
        (address: any) => address.toString(),
      );

      const readOnlyProvider = getReadOnlyProvider(chainId);
      const contract = getOrgContract(readOnlyProvider, active_organisation);

      // Process students in batches with delays to avoid rate limits
      const batchSize = 10; // Adjust based on Tenderly's rate limit (e.g., 100 calls/second)
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      const totalClassesAttended: number[] = [];

      for (let i = 0; i < formattedlistOfStudents?.length; i += batchSize) {
        const batch = formattedlistOfStudents.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(async (address: string) => {
            try {
              const attended = await contract.listClassesAttended(address);
              return attended.length;
            } catch {
              return 0; // Fail-safe per student
            }
          }),
        );
        totalClassesAttended.push(...batchResults);
        await delay(100); // 100ms delay between batches to respect rate limits
      }

      const totalAttendance = totalClassesAttended.reduce(
        (sum, curr) => sum + curr,
        0,
      );

      const newStats = {
        totalClass: formattedLectureIds?.length || 0,
        totalStudent: formattedlistOfStudents?.length || 0,
        totalMentors: formattedlistOfMentors?.length || 0,
        totalSignedAttendance: totalAttendance || 0,
        totalCertification: false,
      };

      // Cache the results
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data: newStats, timestamp: Date.now() }),
      );

      setStatsData(newStats);
    } catch (err) {
      console.error("Error fetching statistics:", err);
    } finally {
      setIsLoading(false);
    }
  }, [data, chainId, active_organisation]);

  useEffect(() => {
    if (data) fetchAllStats();
  }, [data, fetchAllStats]);

  return { statsData, isLoading };
};

export default useGetNumericStatistics;

// -------------
// import { OrganisationABI } from "@/constants/ABIs/OrganisationABI";
// import { getOrgContract } from "@/constants/contracts";
// import { getReadOnlyProvider } from "@/constants/provider";
// import { useQueryClient } from "@tanstack/react-query";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useBlockNumber, useChainId, useReadContracts } from "wagmi";
//
// interface StatsData {
//   totalClass: number;
//   totalStudent: number;
//   totalMentors: number;
//   totalSignedAttendance: number;
//   totalCertification: boolean | undefined;
// }
//
// const useGetNumericStatistics = () => {
//   const [statsData, setStatsData] = useState<StatsData>({
//     totalClass: 0,
//     totalStudent: 0,
//     totalMentors: 0,
//     totalSignedAttendance: 0,
//     totalCertification: false,
//   });
//   const [isLoading, setIsLoading] = useState(true);
//
//   const chainId = useChainId();
//   const queryClient = useQueryClient();
//   const { data: blockNumber } = useBlockNumber({ watch: false }); // disable continuous watch
//
//   const active_organisation = useMemo(() => {
//     const val = window?.localStorage?.getItem("active_organisation");
//     return val ? (JSON.parse(val) as `0x${string}`) : undefined;
//   }, []);
//
//   const { data } = useReadContracts({
//     contracts: active_organisation
//       ? [
//           {
//             address: active_organisation,
//             abi: OrganisationABI,
//             functionName: "getLectureIds",
//           },
//           {
//             address: active_organisation,
//             abi: OrganisationABI,
//             functionName: "listStudents",
//           },
//           {
//             address: active_organisation,
//             abi: OrganisationABI,
//             functionName: "listMentors",
//           },
//         ]
//       : [],
//   });
//
//   const fetchAllStats = useCallback(async () => {
//     if (!data || !active_organisation) return;
//
//     setIsLoading(true);
//
//     try {
//       const [lectureIds, listOfStudents, listOfMentors] = data;
//
//       const formattedLectureIds = lectureIds?.result?.map((id: any) =>
//         id.toString(),
//       );
//       const formattedlistOfStudents = listOfStudents?.result?.map(
//         (address: any) => address.toString(),
//       );
//       const formattedlistOfMentors = listOfMentors?.result?.map(
//         (address: any) => address.toString(),
//       );
//
//       const readOnlyProvider = getReadOnlyProvider(chainId);
//       const contract = getOrgContract(readOnlyProvider, active_organisation);
//
//       const totalClassesAttended = await Promise.all(
//         formattedlistOfStudents?.map(async (address: string) => {
//           try {
//             const attended = await contract.listClassesAttended(address);
//             return attended.length;
//           } catch {
//             return 0; // fail-safe per student
//           }
//         }) ?? [],
//       );
//
//       const totalAttendance = totalClassesAttended.reduce(
//         (sum, curr) => sum + curr,
//         0,
//       );
//
//       setStatsData({
//         totalClass: formattedLectureIds?.length || 0,
//         totalStudent: formattedlistOfStudents?.length || 0,
//         totalMentors: formattedlistOfMentors?.length || 0,
//         totalSignedAttendance: totalAttendance || 0,
//         totalCertification: false,
//       });
//     } catch (err) {
//       console.error("Error fetching statistics:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [data, chainId, active_organisation]);
//
//   useEffect(() => {
//     if (data) fetchAllStats();
//   }, [data, fetchAllStats]);
//
//   return { statsData, isLoading };
// };
//
// export default useGetNumericStatistics;
