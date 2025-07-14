import ScoreUpload from "@/components/admin/ScoreUpload";

export default function UploadScores() {
    const apiKey = process.env.PINATA_API_KEY;
    const secretKey = process.env.PINATA_SECRET_API_KEY;
    return (
        <main className="w-full flex flex-col overflow-x-hidden">
            <ScoreUpload apiKey={apiKey} secretKey={secretKey} />
        </main>
    )
}