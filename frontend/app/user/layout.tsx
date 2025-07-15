"use client";
import DashboardFooter from "@/components/shared/user/DashboardFooter";
import Header from "@/components/shared/user/Header";
import SideBar from "@/components/shared/user/Sidebar";
import useGetListOfStudents from "@/hooks/adminHooks/useGetListOfStudents";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCheckingStudent, setIsCheckingStudent] = useState(true);

  const { address, status } = useAccount();
  const route = useRouter();
  const list: any = useGetListOfStudents();

  useEffect(() => {
    // Don't check if wallet is still connecting or no address
    if (status === "connecting" || !address) {
      setIsCheckingStudent(true);
      return;
    }

    // If we have an address but no list yet, wait
    if (!list || list.length === 0) {
      setIsCheckingStudent(true);
      return;
    }

    // Now we can safely check if user is a student
    const isMentor = list.find((mentor: any) => mentor.address === address);
    if (!isMentor) {
      route.push("/viewprogramme");
    } else {
      setIsCheckingStudent(false);
    }
  }, [address, status, list]);

  // Show loading while checking student status
  if (isCheckingStudent) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#86836D]/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }
  return (
    <div className=" bg-[#86836D]/10 lg:p-1.5">
      {/* Page Wrapper Start  */}
      <div className="flex h-screen gap-1.5 overflow-hidden">
        {/* Sidebar Start */}
        <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* Sidebar End  */}

        {/* Content Area Start  */}
        <div className="relative flex min-h-screen flex-1 flex-col justify-between overflow-y-auto overflow-x-hidden no-scrollbar">
          <section>
            {/*  Header Start */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {/*  Header End */}

            {/*  Main Content Start */}
            <main>
              <div className="mx-auto max-w-screen-2xl pt-4 pb-6 md:pt-4 md:pb-10 2xl:p-10">
                <section className="w-full px-1.5">{children}</section>
              </div>
            </main>
          </section>
          {/*  Main Content End  */}
          <DashboardFooter />
        </div>
        {/*  Content Area End  */}
      </div>
      {/*  Page Wrapper End  */}
    </div>
  );
}
