import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";

const useMentorHandoverGasless = (newMentor: string | null) => {
  const { address: senderAddress } = useAccount();
  const [isConfirmingGasless, setIsConfirmingGasless] = useState(false);
  const [isConfirmedGasless, setIsConfirmedGasless] = useState(false);

  const active_organisation = window.localStorage?.getItem(
    "active_organisation",
  );
  const contractAddress = JSON.parse(active_organisation as `0x${string}`);

  const handOverToMentorGasless = useCallback(async () => {
    if (!senderAddress || !newMentor) {
      toast.error("Mentor or new mentor address missing");
      return;
    }

    setIsConfirmingGasless(true);
    const toastId = "handover-gasless";

    toast.loading("Submitting mentor handover...", {
      id: toastId,
      position: "top-right",
    });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_RELAY_URL}/mentorHandover`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            caller: senderAddress,
            newMentor,
            contractAddress,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error("Mentor handover error:", data);
        throw new Error(data.message || "Mentor handover failed");
      }

      toast.success("Mentor handover successful!", {
        id: toastId,
        position: "top-right",
      });
      setIsConfirmedGasless(true);
    } catch (err: any) {
      toast.error(err.message, {
        id: toastId,
        position: "top-right",
      });
    } finally {
      setIsConfirmingGasless(false);
    }
  }, [senderAddress, newMentor]);

  return {
    handOverToMentorGasless,
    isConfirmingGasless,
    isConfirmedGasless,
  };
};

export default useMentorHandoverGasless;
