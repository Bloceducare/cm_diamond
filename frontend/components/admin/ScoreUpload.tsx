'use client'
import { CSSProperties, useState } from "react";
import { formatFileSize, lightenDarkenColor, useCSVReader } from "react-papaparse";
import { Button } from "../ui/button";
import { IoCloudUploadOutline } from "react-icons/io5";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import useUploadScore from "@/hooks/adminHooks/useUploadScore";
import sample from "../../public/admin/scoresample.png"
import Image from "next/image";

const ScoreUpload = ({ apiKey, secretKey }: any) => {
    const [csvData, setCsvData] = useState([]);
    const [testId, setTestId] = useState<number>()

    const { isConnected } = useAccount()

    const { CSVReader } = useCSVReader();
    const [zoneHover, setZoneHover] = useState(false);
    const [removeHoverColor, setRemoveHoverColor] = useState(
        DEFAULT_REMOVE_HOVER_COLOR
    );

    const { uploadStudentsScore, isWriting, isConfirming } = useUploadScore(testId, csvData, apiKey, secretKey);

    const handleDataUpload = async (e: any) => {
        e.preventDefault()

        if (!isConnected) return toast.error("Please connect wallet", { position: "top-right" });
        if (!testId) return toast.error("Please enter test Id", { position: "top-right" });
        if (csvData.length === 0) return toast.error("Please select a file", { position: "top-right" });

        uploadStudentsScore()

        setCsvData([])
    }

    return (
        <section className="w-full py-6 flex flex-col">
            <main className="w-full flex flex-col gap-7">
                <div className="flex flex-col">
                    <h1 className="uppercase text-color2 md:text-2xl font-bold text-xl">
                        Upload Score
                    </h1>
                    <h4 className="text-lg tracking-wider text-color2">
                        Kindly upload students score
                    </h4>

                    <div className="w-full flex md:flex-row flex-col md:gap-8 gap-3 my-4">
                        {/* Guidelines */}
                        <div className=" flex flex-col text-red-600">
                            <h5 className="text-red-600 text-sm">Guidelines</h5>
                            <ol className="list-decimal list-inside text-xs text-red-600">
                                <li>Only the current mentor on duty can upload score.</li>
                                <li>TestId can be any number.</li>
                                <li>The file (score sheet) format must be CSV.</li>
                                <li>The file content structure must follow the sample</li>
                                <li>The file must not contain any duplicate entries.</li>
                                <li>Click on "Upload Score" button to upload the file.</li>
                            </ol>
                        </div>

                        <div className="w-full md:w-[300px]">
                            <Image src={sample} alt="sample" className="w-full h-full" width={896} height={521} quality={100} priority />
                            <p className="text-xs text-red-600">Figure: Sample</p>
                        </div>
                    </div>
                </div>

                <div className="w-full px-20 flex flex-col gap-4 items-center">
                    <div className="w-full flex flex-col">
                        <label
                            htmlFor="testId"
                            className="text-color3 font-medium ml-1"
                        >
                            Test Id
                        </label>
                        <input
                            type="number"
                            name="testId"
                            id="testId"
                            placeholder="Enter the test Id"
                            className="w-full caret-color1 py-3 px-4 outline-none rounded-lg border border-[#AAA] hover:border-color1 text-sm bg-color1/5 text-color3"
                            value={testId}
                            onChange={(e) => setTestId(Number(e.target.value))}
                        />
                    </div>

                    <div className="w-full relative">
                        <CSVReader
                            config={{ header: true, skipEmptyLines: true }}
                            onUploadAccepted={(results: any) => {
                                setCsvData(results.data);
                                setZoneHover(false);
                            }}
                            onDragOver={(event: DragEvent) => {
                                event.preventDefault();
                                setZoneHover(true);
                            }}
                            onDragLeave={(event: DragEvent) => {
                                event.preventDefault();
                                setZoneHover(false);
                            }}
                        >
                            {({
                                getRootProps,
                                acceptedFile,
                                ProgressBar,
                                getRemoveFileProps,
                                Remove,
                            }: any) => (
                                <>
                                    <div
                                        {...getRootProps()}
                                        style={Object.assign(
                                            {},
                                            styles.zone,
                                            zoneHover && styles.zoneHover
                                        )}
                                    >
                                        {acceptedFile ? (
                                            <>
                                                <div style={styles.file}>
                                                    <div style={styles.info}>
                                                        <span style={styles.size}>
                                                            {formatFileSize(acceptedFile.size)}
                                                        </span>
                                                        <span style={styles.name}>{acceptedFile.name}</span>
                                                    </div>
                                                    <div style={styles.progressBar}>
                                                        <ProgressBar />
                                                    </div>
                                                    <div
                                                        {...getRemoveFileProps()}
                                                        style={styles.remove}
                                                        onMouseOver={(event: Event) => {
                                                            event.preventDefault();
                                                            setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                                                        }}
                                                        onMouseOut={(event: Event) => {
                                                            event.preventDefault();
                                                            setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                                                        }}
                                                    >
                                                        <Remove color={removeHoverColor} />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <IoCloudUploadOutline className="text-4xl" />
                                                <h3 className="capitalize text-lg">
                                                    Click to upload or drag and drop
                                                </h3>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </CSVReader>
                    </div>

                    <div className="w-full flex md:flex-row flex-col gap-3 md:gap-0 justify-center items-center lg:px-8 md:px-6">
                        <Button
                            type="button"
                            onClick={handleDataUpload}
                            disabled={isWriting || isConfirming}
                            className="bg-color1 text-gray-100 hover:bg-color2"
                        >
                            Upload Score
                        </Button>
                    </div>
                </div>
            </main>
        </section>
    );
}

export default ScoreUpload

const GREY = "#AAA";
const DEFAULT_REMOVE_HOVER_COLOR = "#A01919";
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
    DEFAULT_REMOVE_HOVER_COLOR,
    40
);
const GREY_DIM = "#686868";
const GRAY_DARK = "#111827";

const styles = {
    zone: {
        alignItems: "center",
        border: `2px dashed ${GREY}`,
        color: `${GREY}`,
        borderRadius: 20,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        paddingBlock: 40,
        paddingInline: 20,
    } as CSSProperties,
    file: {
        background: "linear-gradient(to bottom, #EEE, #DDD)",
        borderRadius: 20,
        display: "flex",
        height: 120,
        width: 120,
        cursor: "pointer",
        position: "relative",
        zIndex: 10,
        flexDirection: "column",
        justifyContent: "center",
    } as CSSProperties,
    info: {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        paddingLeft: 10,
        paddingRight: 10,
    } as CSSProperties,
    size: {
        color: GRAY_DARK,
        borderRadius: 3,
        marginBottom: "0.5em",
        justifyContent: "center",
        display: "flex",
    } as CSSProperties,
    name: {
        color: GRAY_DARK,
        borderRadius: 3,
        fontSize: 12,
        marginBottom: "0.5em",
    } as CSSProperties,
    progressBar: {
        bottom: 14,
        position: "absolute",
        width: "100%",
        paddingLeft: 10,
        paddingRight: 10,
    } as CSSProperties,
    zoneHover: {
        borderColor: GREY_DIM,
        cursor: "pointer",
    } as CSSProperties,
    default: {
        borderColor: GREY,
    } as CSSProperties,
    remove: {
        height: 23,
        position: "absolute",
        right: 6,
        top: 6,
        width: 23,
    } as CSSProperties,
};