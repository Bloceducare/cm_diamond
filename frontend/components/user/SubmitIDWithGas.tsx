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
import useSignAttendanceWithGas from "@/hooks/studentHooks/useSignAttendanceWithGas";
import Link from "next/link";
import { useState } from "react";

export default function SubmitAttendanceID() {
  const [attendanceId, setAttendanceId] = useState("");
  const { signAttendanceWithGas, isConfirming } =
    useSignAttendanceWithGas(attendanceId);

  const handleOnChange = (e: any) => {
    setAttendanceId(e.target.value);
  };

  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    signAttendanceWithGas();
  };

  return (
    <div>
      {/* Guidelines */}
      <div className="w-full flex flex-col mt-4 text-red-600">
        <h5 className="text-red-600 text-sm">Guidelines</h5>
        <ol className="list-decimal list-inside text-xs text-red-600">
          <li>
            Upon the mentor&apos;s creation of the attendance record and
            notification of the corresponding ID, you will be able to sign in.
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
        <form action="" onSubmit={handleOnSubmit}>
          <CardHeader>
            <CardTitle className="capitalize text-bg-color2/20">
              classmate + student form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-3">Enter ID</CardDescription>
            <input
              type="text"
              name="firstname"
              id="firstname"
              placeholder="Enter Lecture ID"
              className="w-full caret-color2 py-3 px-4 outline-none rounded-lg border border-color2/60 text-sm bg-color1/5 text-color3"
              value={attendanceId}
              onChange={handleOnChange}
            />
          </CardContent>
          <div className="flex justify-end ">
            <CardFooter className="gap-2">
              <Button
                className="bg-color2 hover:bg-color1 transition-all ease-in-out"
                onClick={handleOnSubmit}
                disabled={isConfirming}
              >
                Submit
              </Button>
            </CardFooter>
          </div>
        </form>
      </Card>
    </div>
  );
}
