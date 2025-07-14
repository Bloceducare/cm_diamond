import IssueSpok from "@/components/admin/IssueSpok";

export default function SingleProofOfKnowledge() {
    const apiKey = process.env.PINATA_API_KEY;
    const secretKey = process.env.PINATA_SECRET_API_KEY;
    return (
        <main className="w-full flex flex-col overflow-x-hidden">
            <IssueSpok apiKey={apiKey} secretKey={secretKey} />
        </main>
    )
}
