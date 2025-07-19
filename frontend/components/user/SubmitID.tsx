"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useSignAttendance from "@/hooks/studentHooks/useSignAttendance";
import Link from "next/link";
import { useState } from "react";
import { useAccount } from "wagmi";
import { toast } from "sonner";

export default function SubmitAttendanceID() {
  const [attendanceId, setAttendanceId] = useState("");
  const { address: studentAddress } = useAccount();
  const { signAttendance, isConfirming } = useSignAttendance(
    studentAddress,
    attendanceId,
  );

  const handleOnChange = (e: any) => {
    setAttendanceId(e.target.value);
  };

  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    if (!studentAddress) {
      toast.error("Please connect your wallet.", { position: "top-right" });
      return;
    }
    if (!attendanceId) {
      toast.error("Please enter a lecture ID.", { position: "top-right" });
      return;
    }
    signAttendance();
  };

  return (
    <div>
      {/* Guidelines */}
      <div className="w-full flex flex-col mt-4 text-red-600">
        <h5 className="text-red-600 text-sm">Guidelines</h5>
        <ol className="list-decimal list-inside text-xs text-red-600">
          <li>
            Upon the mentor's creation of the attendance record and notification
            of the corresponding ID, you will be able to sign in.
          </li>
          <li>
            After the ID is announced, please enter it into the designated input
            field and submit to complete the attendance signing process.
          </li>
          <li>
            Attendance signing can be facilitated through your digital wallet.
          </li>
          <li>
            Please note that attendance can only be signed once per instance.
          </li>
          <li>
            Important: Failure to sign attendance in a timely manner may result
            in the closure of the attendance record.
          </li>
          <li>
            All attendance signed can be found here :
            <Link href="/user/attendance" className="underline ml-1">
              attendance
            </Link>
          </li>
        </ol>
      </div>
      <Card className="w-[90%] md:w-[50%] shadow-lg mt-20 mx-auto bg-gray-200/70 border-color2/20 hover:border-color2/40">
        <form onSubmit={handleOnSubmit}>
          <CardHeader>
            <CardTitle className="capitalize text-bg-color2/20">
              classmate + student form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-3">Enter ID</CardDescription>
            <Input
              type="text"
              name="lectureId"
              id="lectureId"
              placeholder="Enter Lecture ID"
              className="w-full caret-color2 py-3 px-4 outline-none rounded-lg border border-color2/60 text-sm bg-color1/5 text-color3"
              value={attendanceId}
              onChange={handleOnChange}
              disabled={isConfirming}
            />
          </CardContent>
          <div className="flex justify-end">
            <CardFooter className="gap-2">
              <Button
                type="submit"
                className="bg-color2 hover:bg-color1 transition-all ease-in-out"
                disabled={isConfirming || !studentAddress || !attendanceId}
              >
                {isConfirming ? "Submitting..." : "Submit"}
              </Button>
            </CardFooter>
          </div>
        </form>
      </Card>
    </div>
  );
}
