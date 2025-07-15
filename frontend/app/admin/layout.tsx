"use client";
import DashboardFooter from "@/components/shared/admin/DashboardFooter";
import Header from "@/components/shared/admin/Header";
import SideBar from "@/components/shared/admin/SideBar";
import { useEffect, useState } from "react";
import useGetListOfMentors from "@/hooks/adminHooks/useGetListOfMentors";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCheckingMentor, setIsCheckingMentor] = useState(true);
  const { address, status } = useAccount();
  const route = useRouter();
  const list: any = useGetListOfMentors();

  useEffect(() => {
    // Don't check if wallet is still connecting or no address
    if (status === "connecting" || !address) {
      setIsCheckingMentor(true);
      return;
    }

    // If we have an address but no list yet, wait
    if (!list || list.length === 0) {
      setIsCheckingMentor(true);
      return;
    }

    // Now we can safely check if user is a mentor
    const isMentor = list.find((mentor: any) => mentor.address === address);
    if (!isMentor) {
      route.push("/viewprogramme");
    } else {
      setIsCheckingMentor(false);
    }
  }, [address, status, list]);

  // Show loading while checking mentor status
  if (isCheckingMentor) {
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
    <div className=" bg-[#86836D]/10">
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
                <section className="w-full px-4 md:px-3">{children}</section>
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
