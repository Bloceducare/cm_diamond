"use client";
import Image from "next/image";
import certImg from "../../public/admin/certificate.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { LiaCertificateSolid } from "react-icons/lia";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { SlPicture } from "react-icons/sl";
import { FiEdit } from "react-icons/fi";
import axios from "axios";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import useIssueCertificate from "@/hooks/adminHooks/useIssueCertificate";

const IssueCertifcate = ({ apiKey, secretKey }: any) => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [imageUri, setImageURI] = useState("");

  const { isConnected } = useAccount();

  const handleSelectImage = ({ target }: { target: any }) => {
    setSelectedFile(target.files[0]);
  };

  const getImage = useCallback(async () => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile!);

        const response = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              pinata_api_key: apiKey,
              pinata_secret_api_key: secretKey,
            },
          }
        );

        const fileUrl = response.data.IpfsHash;
        const gateWayAndhash = `https://gray-quiet-egret-248.mypinata.cloud/ipfs/${fileUrl}`;
        setImageURI(gateWayAndhash);
        toast.success("Image URI fetched successfully", {
          position: "top-right",
        });

        return fileUrl;
      } catch (error) {
        console.log("Pinata API Error:", error);
        toast.error("Failed to fetch Image URI", { position: "top-right" });
      }
    }
  }, [selectedFile]);

  useEffect(() => {
    if (selectedFile) {
      getImage();
    }
  }, [selectedFile, getImage]);

  const { issueCertificateToStudents, isConfirming, isConfirmed } =
    useIssueCertificate(imageUri);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!isConnected)
      return toast.error("Please connect wallet", { position: "top-right" });

    if (imageUri === "")
      return toast.error("Please select an image", { position: "top-right" });

    issueCertificateToStudents();

    setSelectedFile(undefined);
    setImageURI("");
  };

  return (
    <section className="w-full py-6 flex flex-col">
      <main className="w-full flex flex-col gap-7">
        <div className="flex flex-col">
          <h1 className="uppercase text-color2 md:text-2xl font-bold text-xl">
            Certificate
          </h1>
          <h4 className="text-lg tracking-wider text-color2">
            Insert necessary Info for Issuing Certificate
          </h4>

          {/* Guidelines */}
          <div className="w-full flex flex-col mt-4 text-red-600">
            <h5 className="text-red-600 text-sm">Guidelines</h5>
            <ol className="list-decimal list-inside text-xs text-red-600">
              <li>Only the organisation creator can issue certificate</li>
              <li>Click on the 'Issue Certificate' button to open up the dialog.</li>
              <li>Select the image you want to upload.</li>
              <li>Image URI will be generated from IPFS and filled-in.</li>
              <li>Click on the button to issue the certificate.</li>
            </ol>
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-7">
          <Image
            src={certImg}
            className=" object-contain"
            alt="Certificate Image"
            width={300}
            height={300}
            quality={100}
          />

          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                className="text-white bg-color1 hover:bg-color2 flex items-center gap-1"
              >
                Issue Certificate <LiaCertificateSolid className="text-xl" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Classmate+</DialogTitle>
                <DialogDescription>Insert certificate image</DialogDescription>
              </DialogHeader>
              <form className="w-full grid gap-4" onSubmit={handleSubmit}>
                <div className="w-full flex flex-col items-center">
                  <div className="w-[80px] h-[80px] border-[0.5px] border-color3/50 rounded relative ">
                    {selectedFile ? (
                      <Image
                        src={URL.createObjectURL(selectedFile)}
                        alt="profile"
                        className="w-full h-full object-cover"
                        width={440}
                        height={440}
                        priority
                        quality={100}
                      />
                    ) : (
                      <span className="relative flex justify-center items-center w-full h-full">
                        <SlPicture className="relative text-6xl inline-flex rounded text-gray-300" />
                      </span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      className="hidden"
                      id="selectFile"
                      onChange={handleSelectImage}
                    />
                    <label
                      htmlFor="selectFile"
                      className=" absolute -right-1 p-1 rounded-full -bottom-1 cursor-pointer bg-gray-100 border-[0.5px] border-color3/50 font-Bebas tracking-wider text-color3"
                    >
                      <FiEdit />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="imageUri"
                    className="text-color3 font-medium ml-1"
                  >
                    Certificate Image URI
                  </label>
                  <input
                    type="text"
                    name="imageUri"
                    id="imageUri"
                    placeholder="Select image first..."
                    className="w-full caret-color1 py-3 px-4 outline-none rounded-lg border border-color1 text-sm bg-color1/5 text-color3"
                    value={imageUri}
                    readOnly
                    required
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      type="submit"
                      disabled={isConfirming}
                      className="bg-color1 mb-3 md:mb-0"
                    >
                      Issue Certificate
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </section>
  );
};

export default IssueCertifcate;
