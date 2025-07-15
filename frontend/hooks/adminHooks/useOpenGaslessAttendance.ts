import { ethers } from "ethers";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

const useOpenGaslessAttendance = () => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { address: userAddress } = useAccount();

  const active_organisation = window.localStorage?.getItem(
    "active_organisation",
  );
  const contract_address = JSON.parse(active_organisation as `0x${string}`);

  const openAttendance = useCallback(
    async (id: string) => {
      if (!userAddress) {
        toast.error("Wallet not connected");
        return;
      }

      setIsConfirming(true);
      const toastId = "openAttendance";

      try {
        toast.loading("Processing attendance...", {
          id: toastId,
          position: "top-right",
        });

        const res = await fetch(
          "https://cm-diamond.onrender.com/openAttendance",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mentorAddress: userAddress,
              lectureId: ethers.encodeBytes32String(id),
              contractAddress: contract_address,
            }),
          },
        );

        const result = await res.json();

        if (result.success) {
          setIsConfirmed(true);
          toast.success("Attendance opened successfully!", {
            id: toastId,
            position: "top-right",
          });
        } else {
          throw new Error(result.message || "Failed to open attendance");
        }
      } catch (error: any) {
        toast.error(error.message || "Unexpected error", {
          id: toastId,
          position: "top-right",
        });
      } finally {
        setIsConfirming(false);
      }
    },
    [userAddress, contract_address],
  );

  return {
    openAttendance,
    isConfirming,
    isConfirmed,
  };
};

export default useOpenGaslessAttendance;
