"use client";
import { Calendar } from "@/components/ui/calendar";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useGetStudentName from "@/hooks/studentHooks/useGetStudentName";
import useGetAttendanceRatio from "@/hooks/studentHooks/useGetAttendanceRatio";
import useGetSignedAttendanceImages from "@/hooks/studentHooks/useGetSignedAttendanceImages";
import { useAccount } from "wagmi";
import Link from "next/link";
import { FaFileSignature } from "react-icons/fa6";
import { SiGoogleclassroom } from "react-icons/si";
import { GiPieChart } from "react-icons/gi";
import { TbAlarmAverage, TbArrowRotaryLastLeft } from "react-icons/tb";
import useGetStudentScore from "@/hooks/studentHooks/useGetStudentScore";

interface Statistic {
  title: any;
  value: any;
  icon?: any;
}

const Statistics = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { address } = useAccount();
  const studentName = useGetStudentName(address);
  const attendanceRatio = useGetAttendanceRatio(address);
  const { list } = useGetStudentScore(address);

  const totalScore = useMemo(
    () => list.reduce((sum, lis) => sum + parseFloat(lis.score), 0),
    [list],
  );
  const averageScore = useMemo(
    () =>
      list.length > 0 ? parseFloat((totalScore / list.length).toFixed(1)) : 0,
    [list, totalScore],
  );
  const { signedAttendanceImages, isLoading } =
    useGetSignedAttendanceImages(address);

  const statistics: Statistic[] = [
    {
      title: "Total Classes",
      value: attendanceRatio.attendanceRatio.totalClasses
        ? attendanceRatio.attendanceRatio.totalClasses
        : 0,
      icon: <SiGoogleclassroom />,
    },
    {
      title: "Class attended",
      value: attendanceRatio.attendanceRatio.attendance
        ? attendanceRatio.attendanceRatio.attendance
        : 0,
      icon: <FaFileSignature />,
    },

    {
      title: "Class Percentage",
      value:
        attendanceRatio.attendanceRatio.attendance &&
        attendanceRatio.attendanceRatio.totalClasses
          ? `${
              Math.floor(
                (attendanceRatio.attendanceRatio.attendance /
                  attendanceRatio.attendanceRatio.totalClasses) *
                  10000,
              ) / 100
            }%`
          : "0%",
      icon: <GiPieChart />,
    },
    { title: "Average Score", value: averageScore, icon: <TbAlarmAverage /> },
    {
      title: "Total Score",
      value: totalScore,
      icon: <TbArrowRotaryLastLeft />,
    },
  ];

  return (
    <>
      <section className="flex justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Welcome back, {studentName}</h1>
          <p className="capitalize text-xs">welcome to classmate+ dashboard</p>
        </div>
      </section>
      <section>
        <h1 className="mb-2">Overview</h1>
      </section>
      <section className="w-full grid md:grid-cols-3 gap-8 ">
        <main className="w-full md:col-span-2">
          <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-3 ">
            {statistics?.map((stat, index) => (
              <div
                key={index}
                className="w-full h-24 flex flex-col justify-between hover:border hover:border-color2 transition-all ease-in-out shadow-md bg-white/95 rounded-md px-3 p-2"
              >
                <h1 className="text-gray-700 font-medium text-sm">
                  {stat.title}
                </h1>
                <div className="w-full flex md:flex-row-reverse flex-wrap justify-between items-center">
                  <div className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center text-gray-700 text-xl">
                    {stat.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {stat.value}
                  </h3>
                </div>
              </div>
            ))}
          </div>
          <section className="">
            {isLoading ? (
              <div className="w-full h-[250px] flex justify-center items-center">
                <h1 className="text-center md:text-2xl text-lg text-color1 font-bold">
                  Fetching signed attendance...
                </h1>
              </div>
            ) : isLoading === false && signedAttendanceImages?.length === 0 ? (
              <div className="w-full h-[250px] flex justify-center items-center">
                <h1 className="text-center md:text-2xl text-lg text-color1 font-bold">
                  No attendance signed yet
                </h1>
              </div>
            ) : (
              <section className="w-full grid lg:grid-cols-3 md:grid-cols-2 lg:gap-6 md:gap-4 mt-3 gap-6">
                {signedAttendanceImages?.slice(0, 3).map((list, index) => (
                  <>
                    <Link href="/user/attendance" key={index}>
                      <Card
                        key={index}
                        className="bg-white/95 hover:border hover:border-color2 transition-all ease-in-out shadow-md rounded-md"
                      >
                        <CardHeader>
                          <h1>{list.topic}</h1>
                          <h3>{list.mentorName}</h3>
                        </CardHeader>
                        <CardContent>
                          <img
                            src={list.imageURI}
                            alt="NFT Image"
                            className="w-full h-40 object-cover rounded-md"
                          />
                          <h1 className="mt-2">Lecture ID: {list.lectureId}</h1>
                        </CardContent>
                      </Card>
                    </Link>
                  </>
                ))}
              </section>
            )}
          </section>
        </main>
        <aside className="w-full p-6 bg-white rounded-md  h-[350px] shadow-lg">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border h-full"
          />
        </aside>
      </section>
    </>
  );
};

export default Statistics;
