import { OrganisationABI } from "@/constants/ABIs/OrganisationABI";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useBlockNumber, useReadContract } from "wagmi";

const useGetProgramStatus = () => {
  const [status, setStatus] = useState<boolean>();

  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  // Safe localStorage access for SSR
  const contract_address =
    typeof window !== "undefined"
      ? JSON.parse(
          window.localStorage?.getItem("active_organisation") || "null",
        )
      : undefined;

  const {
    data: programStatus,
    error: programStatusError,
    queryKey,
    isSuccess,
  } = useReadContract({
    address: contract_address,
    abi: OrganisationABI,
    functionName: "getOrganizationStatus",
    query: {
      enabled: !!contract_address,
      staleTime: 60 * 1000, // 1 minute
      refetchInterval: 60 * 1000, // throttle to avoid spamming
    },
  });

  // Manual query invalidation only every 30 seconds
  useEffect(() => {
    if (!queryKey) return;

    const now = Date.now();
    let lastInvalidated = (window as any).__lastStatusQueryInvalidated || 0;

    if (now - lastInvalidated > 30_000) {
      queryClient.invalidateQueries({ queryKey });
      (window as any).__lastStatusQueryInvalidated = now;
    }
  }, [blockNumber, queryClient, queryKey]);

  useEffect(() => {
    if (isSuccess && typeof programStatus === "boolean") {
      setStatus(programStatus);
    }
  }, [isSuccess, programStatus]);

  useEffect(() => {
    if (programStatusError) {
      toast.error(
        programStatusError.message || "Error fetching program status",
        {
          position: "top-right",
        },
      );
    }
  }, [programStatusError]);

  return status;
};

export default useGetProgramStatus;
