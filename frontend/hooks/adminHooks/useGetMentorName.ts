"use client";

import { OrganisationABI } from "@/constants/ABIs/OrganisationABI";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useReadContract } from "wagmi";

const useGetMentorName = (_userAddress: `0x${string}` | undefined) => {
  const [mentorName, setMentorName] = useState("");
  const [contractAddress, setContractAddress] = useState<`0x${string}` | null>(
    null,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem("active_organisation");
      try {
        if (raw) {
          const parsed = JSON.parse(raw);
          if (typeof parsed === "string" && parsed.startsWith("0x")) {
            setContractAddress(parsed as `0x${string}`);
          }
        }
      } catch (err) {
        console.error("Failed to parse contract address:", err);
      }
    }
  }, []);

  const { data: nameOfMentor, error: nameOfMentorError } = useReadContract({
    address: contractAddress ?? undefined,
    abi: OrganisationABI,
    functionName: "getMentorsName",
    args: [_userAddress as `0x${string}`],
    query: {
      enabled: !!contractAddress && !!_userAddress,
      staleTime: 1000 * 60 * 5, // cache 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  });

  useEffect(() => {
    if (nameOfMentor) {
      setMentorName(nameOfMentor.toString());
    }
  }, [nameOfMentor]);

  useEffect(() => {
    if (nameOfMentorError) {
      toast.error(nameOfMentorError.message, {
        position: "top-right",
      });
    }
  }, [nameOfMentorError]);

  return mentorName;
};

export default useGetMentorName;

// ----
// "use client";
//
// import { OrganisationABI } from "@/constants/ABIs/OrganisationABI";
// import { useQueryClient } from "@tanstack/react-query";
// import { useEffect, useState, useCallback } from "react";
// import { toast } from "sonner";
// import { useBlockNumber, useReadContract } from "wagmi";
//
// const useGetMentorName = (_userAddress: `0x${string}` | undefined) => {
//   const [mentorName, setMentorName] = useState("");
//   const [contractAddress, setContractAddress] = useState<`0x${string}` | null>(
//     null,
//   );
//
//   const queryClient = useQueryClient();
//   const { data: blockNumber } = useBlockNumber({ watch: true });
//
//   // Load contract address from localStorage on mount
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       try {
//         const raw = window.localStorage.getItem("active_organisation");
//         const parsed = JSON.parse(raw ?? "null");
//         if (typeof parsed === "string" && parsed.startsWith("0x")) {
//           setContractAddress(parsed as `0x${string}`);
//         }
//       } catch (error) {
//         console.error("Invalid contract address in localStorage:", error);
//       }
//     }
//   }, []);
//
//   const {
//     data: nameOfMentor,
//     error: nameOfMentorError,
//     queryKey,
//   } = useReadContract({
//     address: contractAddress ?? undefined,
//     abi: OrganisationABI,
//     functionName: "getMentorsName",
//     args: [_userAddress as `0x{string}`],
//     query: {
//       enabled: !!contractAddress && !!_userAddress, // Only fetch when ready
//     },
//   });
//
//   useEffect(() => {
//     if (queryKey && blockNumber && contractAddress && _userAddress) {
//       queryClient.invalidateQueries({ queryKey });
//     }
//   }, [blockNumber, queryClient, queryKey, contractAddress, _userAddress]);
//
//   const fetchMentorName = useCallback(() => {
//     if (nameOfMentor) {
//       setMentorName(nameOfMentor.toString());
//     }
//   }, [nameOfMentor]);
//
//   useEffect(() => {
//     fetchMentorName();
//   }, [fetchMentorName]);
//
//   useEffect(() => {
//     if (nameOfMentorError) {
//       toast.error(nameOfMentorError.message, {
//         position: "top-right",
//       });
//     }
//   }, [nameOfMentorError]);
//
//   return mentorName;
// };
//
// export default useGetMentorName;

// --------
// "use client";
//
// import { OrganisationABI } from "@/constants/ABIs/OrganisationABI";
// import { useQueryClient } from "@tanstack/react-query";
// import { useCallback, useEffect, useState } from "react";
// import { toast } from "sonner";
// import { useBlockNumber, useReadContract } from "wagmi";
//
// const useGetMentorName = (_userAddress: `0x{string}`) => {
//   const [mentorName, setMentorName] = useState("");
//   const [contractAddress, setContractAddress] = useState<`0x${string}` | null>(
//     null,
//   );
//
//   const queryClient = useQueryClient();
//   const { data: blockNumber } = useBlockNumber({ watch: true });
//
//   // Load contract address safely on the client
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const raw = window.localStorage.getItem("active_organisation");
//       try {
//         if (raw) {
//           const parsed = JSON.parse(raw);
//           if (typeof parsed === "string" && parsed.startsWith("0x")) {
//             setContractAddress(parsed as `0x{string}`);
//           }
//         }
//       } catch (err) {
//         console.error(
//           "Failed to parse contract address from localStorage:",
//           err,
//         );
//       }
//     }
//   }, []);
//
//   const {
//     data: nameOfMentor,
//     error: nameOfMentorError,
//     queryKey,
//   } = useReadContract({
//     address: contractAddress ?? undefined,
//     abi: OrganisationABI,
//     functionName: "getMentorsName",
//     args: [_userAddress],
//     query: {
//       enabled: !!contractAddress && !!_userAddress, // Only run when both are ready
//     },
//   });
//
//   // Invalidate when block changes
//   useEffect(() => {
//     if (queryKey && blockNumber) {
//       queryClient.invalidateQueries({ queryKey });
//     }
//   }, [blockNumber, queryClient, queryKey]);
//
//   const fetchMentorName = useCallback(() => {
//     if (nameOfMentor) {
//       setMentorName(nameOfMentor.toString());
//     }
//   }, [nameOfMentor]);
//
//   useEffect(() => {
//     fetchMentorName();
//   }, [fetchMentorName]);
//
//   useEffect(() => {
//     if (nameOfMentorError) {
//       toast.error(nameOfMentorError.message, {
//         position: "top-right",
//       });
//     }
//   }, [nameOfMentorError]);
//
//   return mentorName;
// };
//
// export default useGetMentorName;
