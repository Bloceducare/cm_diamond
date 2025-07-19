import ScoreUploadGasless from "@/components/admin/ScoreUploadGasless";

export default function UploadScoresGasless() {
  const apiKey = process.env.PINATA_API_KEY;
  const secretKey = process.env.PINATA_SECRET_API_KEY;
  return (
    <main className="w-full flex flex-col overflow-x-hidden">
      <ScoreUploadGasless apiKey={apiKey} secretKey={secretKey} />
    </main>
  );
}
