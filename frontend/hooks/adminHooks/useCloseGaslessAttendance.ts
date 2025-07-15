import { ethers } from "ethers";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

const useCloseGaslessAttendance = () => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { address: userAddress } = useAccount();

  const active_organisation = window.localStorage?.getItem(
    "active_organisation",
  );
  const contract_address = JSON.parse(active_organisation as `0x${string}`);

  const closeAttendance = useCallback(
    async (id: string) => {
      setIsConfirming(true);
      const toastId = "closeAttendance";

      try {
        toast.loading("Closing attendance...", {
          id: toastId,
          position: "top-right",
        });

        const res = await fetch(
          "https://cm-diamond.onrender.com/closeAttendance",
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
          toast.success("Attendance closed successfully!", {
            id: toastId,
            position: "top-right",
          });
        } else {
          throw new Error(result.message || "Failed to close attendance");
        }
      } catch (error: any) {
        toast.error(error.message || "Unexpected error", {
          id: "closeAttendance",
          position: "top-right",
        });
      } finally {
        setIsConfirming(false);
      }
    },
    [userAddress, contract_address],
  );

  return {
    closeAttendance,
    isConfirming,
    isConfirmed,
  };
};

export default useCloseGaslessAttendance;
