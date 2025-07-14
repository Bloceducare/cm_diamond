"use client";
import { Button } from "../ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import useGetScores from "@/hooks/adminHooks/useGetScores";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Link from "next/link";

const ScoreList = () => {
    const { list, listOfScoreURIError, listOfScoreURIIsPending } = useGetScores();

    // Pagination
    const [currentItems, setCurrentItems] = useState<any[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 6;

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(list.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(list.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, list, list.length]);

    const handlePageClick = (event: any) => {
        const newOffset = (event.selected * itemsPerPage) % list.length;
        setItemOffset(newOffset);
    };

    return (
        <section className="w-full py-6 flex flex-col">
            <main className="w-full flex flex-col gap-7">
                <div className="w-full flex md:flex-row flex-col gap-3 md:gap-0 justify-between md:items-end items-start">
                    <div className="flex flex-col">
                        <h1 className="uppercase text-color2 md:text-2xl font-bold text-xl">
                            Score List
                        </h1>
                        <h4 className="text-lg tracking-wider text-color2">
                            {" "}
                            List of students score{" "}
                        </h4>
                        <p className="text-sm text-color2">To upload student&apos;s score, <Link href="/admin/uploadscore" className=" text-color1 hover:underline">
                            Click here
                        </Link>
                        </p>

                        {/* Guidelines */}
                        <div className="w-full flex flex-col mt-4 text-red-600">
                            <h5 className="text-red-600 text-sm">Guidelines</h5>
                            <ol className="list-decimal list-inside text-xs text-red-600">
                                <li>List of students scores will be displayed here.</li>
                                <li>Score lists are sorted in ascending order. Eg. first - last</li>
                                <li>Click on the 'View Score' button to view the score in tabular format.</li>
                            </ol>
                        </div>
                    </div>
                </div>

                {listOfScoreURIIsPending ? (
                    <div className="w-full h-[250px] flex justify-center items-center">
                        <h1 className="text-center md:text-2xl text-lg text-color1 font-bold">
                            Fetching scores...
                        </h1>
                    </div>
                ) : listOfScoreURIIsPending === false && list?.length === 0 ? (
                    <div className="w-full h-[250px] flex justify-center items-center">
                        <h1 className="text-center md:text-2xl text-lg text-color1 font-bold">
                            No scores uploaded yet
                        </h1>
                    </div>
                ) : null}

                <div className='w-full grid lg:grid-cols-3 md:grid-cols-2 md:gap-6 gap-4'>
                    {
                        currentItems?.map((lis, index) => (
                            <div className="w-full bg-gray-200 rounded flex flex-col gap-2 py-4 items-start px-5" key={index}>
                                <h3 className="text-color3 font-semibold">{lis.score}</h3>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="border-none outline-none rounded px-3 bg-color1 hover:bg-color2 text-gray-200 py-1.5">View Score</Button>
                                    </DialogTrigger>
                                    <DialogContent className="md:max-w-[625px] max-w-full h-[450px]">
                                        <DialogHeader>
                                            <DialogTitle>{lis.score} Score</DialogTitle>
                                            <DialogDescription>
                                                Students {lis.score} sheet
                                            </DialogDescription>
                                        </DialogHeader>
                                        <main className="w-full overflow-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-color2 hover:bg-color2 text-gray-300">
                                                        <TableHead className="font-semibold text-gray-300">S/N</TableHead>
                                                        <TableHead className="font-semibold text-gray-300">Student</TableHead>
                                                        <TableHead className="font-semibold text-gray-300">Score</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {
                                                        lis.data.map((td: any, index: any) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell className=" text-nowrap">{td.student}</TableCell>
                                                                <TableCell className=" text-nowrap">{td.score}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    }
                                                </TableBody>
                                            </Table>
                                        </main>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        ))
                    }

                </div>

                {/* pagination */}
                <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4">
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        pageCount={pageCount}
                        previousLabel="<"
                        renderOnZeroPageCount={null}
                        containerClassName="flex justify-center items-center mt-8 gap-1 pb-4"
                        pageLinkClassName="py-2 md:px-4 px-3 md:text-base text-sm font-medium text-gray-800 bg-white hover:bg-gray-800 hover:text-white border border-gray-800 transition-all duration-300"
                        previousLinkClassName="py-2 md:px-4 px-3 md:text-base text-sm font-medium text-gray-800 bg-white hover:bg-gray-800 hover:text-white border border-gray-800 transition-all duration-300"
                        nextLinkClassName="py-2 md:px-4 px-3 md:text-base text-sm font-medium text-gray-800 bg-white hover:bg-gray-800 hover:text-white border border-gray-800 transition-all duration-300"
                        activeLinkClassName="rounded-xl"
                    />
                </div>
            </main>
        </section>
    );
};

export default ScoreList;
