import GaslessAttendance from "@/components/admin/GaslessAttendance";

export default function GaslessAttendanceNFT() {
  const apiKey = process.env.PINATA_API_KEY;
  const secretKey = process.env.PINATA_SECRET_API_KEY;
  return (
    <main className="w-full flex flex-col overflow-x-hidden">
      <GaslessAttendance apiKey={apiKey} secretKey={secretKey} />
    </main>
  );
}
