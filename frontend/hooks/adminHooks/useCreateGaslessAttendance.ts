"use client";
import { ethers } from "ethers";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { Address } from "viem";

const useCreateGaslessAttendance = (
  _lectureId: string,
  _uri: string,
  _topic: string,
  _mentorAddress: Address | undefined,
) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Safely retrieve and validate contractAddress from localStorage
  let contractAddress: Address | undefined;
  const activeOrganisation = window.localStorage?.getItem(
    "active_organisation",
  );
  try {
    if (activeOrganisation) {
      const parsed = JSON.parse(activeOrganisation);
      if (ethers.isAddress(parsed) && !parsed.includes(".eth")) {
        contractAddress = parsed as Address;
      } else {
        throw new Error("Invalid contract address in localStorage");
      }
    }
  } catch {
    setError("Invalid organisation data in localStorage");
  }

  const createGaslessAttendance = useCallback(async () => {
    // Validate inputs
    if (!_mentorAddress) {
      toast.error("Please connect your wallet.", {
        id: "createGaslessAttendance",
        position: "top-right",
      });
      setError("Missing mentor address");
      return;
    }
    if (!_lectureId) {
      toast.error("Please enter a lecture ID.", {
        id: "createGaslessAttendance",
        position: "top-right",
      });
      setError("Missing lecture ID");
      return;
    }
    if (!_uri) {
      toast.error("Please provide a URI.", {
        id: "createGaslessAttendance",
        position: "top-right",
      });
      setError("Missing URI");
      return;
    }
    if (!_topic) {
      toast.error("Please provide a topic.", {
        id: "createGaslessAttendance",
        position: "top-right",
      });
      setError("Missing topic");
      return;
    }
    if (!contractAddress) {
      toast.error("No active organisation selected.", {
        id: "createGaslessAttendance",
        position: "top-right",
      });
      setError("Missing contract address");
      return;
    }
    if (!ethers.isAddress(_mentorAddress) || _mentorAddress.includes(".eth")) {
      toast.error("Invalid mentor address: ENS not supported.", {
        id: "createGaslessAttendance",
        position: "top-right",
      });
      setError("Invalid mentor address");
      return;
    }

    let lectureIdBytes: string;
    try {
      lectureIdBytes = ethers.encodeBytes32String(_lectureId);
    } catch {
      toast.error("Invalid lecture ID format.", {
        id: "createGaslessAttendance",
        position: "top-right",
      });
      setError("Invalid lecture ID format");
      return;
    }

    setIsConfirming(true);
    setError(null);

    try {
      toast.loading("Creating attendance...", {
        id: "createGaslessAttendance",
        position: "top-right",
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_RELAY_URL}/createAttendance`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lectureId: lectureIdBytes,
            uri: _uri,
            topic: _topic,
            mentorAddress: _mentorAddress,
            contractAddress,
          }),
        },
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to create attendance");
      }

      toast.success("Attendance created successfully!", {
        id: "createGaslessAttendance",
        position: "top-right",
      });
      setIsConfirmed(true);
    } catch (err: any) {
      setError(err.message || "Failed to create attendance");
      toast.error(err.message || "Failed to create attendance", {
        id: "createGaslessAttendance",
        position: "top-right",
      });
    } finally {
      setIsConfirming(false);
    }
  }, [_mentorAddress, _lectureId, _uri, _topic, contractAddress]);

  return { createGaslessAttendance, isConfirming, isConfirmed, error };
};

export default useCreateGaslessAttendance;
