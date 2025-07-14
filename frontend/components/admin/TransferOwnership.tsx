'use client'

import { FormEvent, useState } from "react"
import { toast } from "sonner"
import { useAccount } from "wagmi"
import { Button } from "../ui/button"
import useTransferOwnership from "@/hooks/adminHooks/useTransferOwnership"

const TransferOwnership = () => {
    const [newModerator, setNewModerator] = useState('')

    const { isConnected } = useAccount()

    const {
        transferOwner,
        isConfirming,
        isConfirmed,
    } = useTransferOwnership(newModerator)

    const handleOwnershipTransfer = async (e: FormEvent) => {
        e.preventDefault()

        if (!isConnected) return toast.error('Please connect wallet', { position: 'top-right' });

        if (newModerator === '') return toast.error('Please enter new moderator address', { position: 'top-right' })

        transferOwner()

        if (isConfirmed) setNewModerator('')
    }
    return (
        <section className="w-full py-6 flex flex-col">
            <main className="w-full flex flex-col gap-7">
                <div className="flex flex-col">
                    <h1 className="uppercase text-color2 md:text-2xl font-bold text-xl">
                        Ownership Transfer
                    </h1>
                    <h4 className="text-lg tracking-wider text-color2">
                        Are you sure you want to transfer ownership?
                    </h4>

                    {/* Guidelines */}
                    <div className="w-full flex flex-col mt-4 text-red-600">
                        <h5 className="text-red-600 text-sm">Guidelines</h5>
                        <ol className="list-decimal list-inside text-xs text-red-600">
                            <li className="uppercase font-semibold">Ownership transfer is irreversible.</li>
                            <li>Only the organisation creator/moderator can transfer ownership.</li>
                            <li>Once ownership is transfered, the new owner will be the organisation moderator/creator.</li>
                            <li> To transfer ownership, first, enter the address of the new owner.</li>
                            <li>Cross-check the address of the new owner.</li>
                            <li>Click on the 'Transfer' button to transfer ownership.</li>
                        </ol>
                    </div>
                </div>

                <div className="w-full flex flex-col items-center mt-6">
                    <form
                        className="lg:w-[50%] md:w-[70%] w-full grid gap-4"
                        onSubmit={handleOwnershipTransfer}
                    >

                        <div className="flex flex-col">
                            <label
                                htmlFor="newModerator"
                                className="text-color3 font-medium ml-1"
                            >
                                New Moderator
                            </label>
                            <input
                                type="text"
                                name="newModerator"
                                id="newModerator"
                                placeholder="Enter the new moderator's wallet address"
                                className="w-full caret-color1 py-3 px-4 outline-none rounded-lg border border-color1 text-sm bg-color1/5 text-color3"
                                value={newModerator}
                                onChange={(e) => setNewModerator(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col mt-3">
                            <Button
                                disabled={isConfirming}
                                type="submit"
                                className="bg-color1 hover:bg-color2"
                            >
                                Transfer
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </section>
    )
}

export default TransferOwnership