import { ethers } from "ethers";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { Address } from "viem";

const useSignAttendance = (
  _studentAddress: Address | undefined,
  _lectureId: string,
) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeOrganisation = window.localStorage?.getItem(
    "active_organisation",
  );
  let contractAddress: `0x${string}` | undefined;
  try {
    contractAddress = activeOrganisation
      ? (JSON.parse(activeOrganisation) as `0x${string}`)
      : undefined;
  } catch {
    setError("Invalid organisation data in localStorage");
  }

  const signAttendance = useCallback(async () => {
    if (!_studentAddress) {
      toast.error("Please connect your wallet.", {
        id: "signAttendance",
        position: "top-right",
      });
      return;
    }
    if (!_lectureId) {
      toast.error("Please enter a lecture ID.", {
        id: "signAttendance",
        position: "top-right",
      });
      return;
    }
    if (!contractAddress) {
      toast.error("No active organisation selected.", {
        id: "signAttendance",
        position: "top-right",
      });
      return;
    }

    let lectureIdBytes: string;
    try {
      lectureIdBytes = ethers.encodeBytes32String(_lectureId);
    } catch {
      toast.error("Invalid lecture ID format.", {
        id: "signAttendance",
        position: "top-right",
      });
      return;
    }

    setIsConfirming(true);
    setError(null);

    try {
      toast.loading("Signing attendance...", {
        id: "signAttendance",
        position: "top-right",
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_RELAY_URL}/signAttendance`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentAddress: _studentAddress,
            lectureId: lectureIdBytes,
            contractAddress,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign attendance");
      }

      setIsConfirming(false);
      setIsConfirmed(true);
      toast.success("Attendance signed successfully!", {
        id: "signAttendance",
        position: "top-right",
      });
    } catch (err: any) {
      setIsConfirming(false);
      toast.error(err.message || "Failed to sign attendance", {
        id: "signAttendance",
        position: "top-right",
      });
    }
  }, [_studentAddress, _lectureId, contractAddress]);

  return {
    signAttendance,
    isConfirming,
    isConfirmed,
    error,
  };
};

export default useSignAttendance;
