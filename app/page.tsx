"use client";
import { DragEvent, useState } from "react";
import ParserService from "@/services/parser-service";
import Link from "next/link";
import { RiDeleteBinLine, RiUploadCloud2Line } from "react-icons/ri";
import { IdCard } from "@/components/Card/type";
import FrontLayoutIdCard from "@/components/Card/FrontLayoutIdCard";
import BackLayoutIdCard from "@/components/Card/BackLayoutIdCard";
import imageExporter from "@/services/image-exporter-service";

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState<number>(0);
  const [data, setData] = useState<IdCard[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  }>({ message: "", type: "success" });

  const handleDrag = (e: DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];

      validateFile(file);

      // parse csv file to json on drop
      const reader = new FileReader();
      reader.onload = async (e) => {
        const contents = e.target?.result as string;
        const jsonData = await ParserService.parseCSV(contents, ";");
        setData(jsonData as IdCard[]);
        setIsLoading(false);
      };

      reader.readAsText(file);
      e.dataTransfer.clearData();
    }
  };

  const validateFile = (file: File) => {
    if (file.type !== "text/csv") {
      setToast({
        message: "File is not a CSV file",
        type: "error",
      });
      return false;
    } else if (file.size > 2 * 1024 * 1024) {
      setToast({
        message: "File is too large",
        type: "error",
      });
      return false;
    }

    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);

    const tempFile = event.target.files ? event.target.files[0] : null;

    setIsLoading(true);
    event.preventDefault();

    if (tempFile) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const contents = e.target?.result as string;
        const jsonData = await ParserService.parseCSV(contents, ";");
        setData(jsonData as IdCard[]);
        setIsLoading(false);
      };

      reader.readAsText(tempFile);
    } else setIsLoading(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const contents = e.target?.result as string;
        const jsonData = await ParserService.parseCSV(contents, ";");
        setData(jsonData as IdCard[]);
        setIsLoading(false);

        console.log(jsonData);
      };

      reader.readAsText(file);
    } else setIsLoading(false);
  };

  const handleDownloadAll = async (data: IdCard[] | null) => {
    if (data) {
      const frontImages = await imageExporter.getImagesFromElements(data.map((_, index) => `front_image_${index}`));
      const backImages = await imageExporter.getImagesFromElements(data.map((_, index) => `back_image_${index}`));
      await imageExporter.exportAsZip(
        [...frontImages, ...backImages],
        data.map((item) => `${item.full_name} - ${item.employee_id}`),
        "id_card_images"
      );
    }
  };

  const handleRemove = () => {
    setFile(null);
    setFileKey((prevKey) => prevKey + 1); // increment key to force re-render of input
    setData(null);
  };

  return (
    <>
      <div
        className="max-h-screen overflow-hidden my-8 mx-8 
        grid xl:grid-flow-col xl:grid-cols-2 place-items-center 
        gap-4 bg-white"
      >
        <div>
          <form
            onDragOver={handleDrag}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDrop={(e) => handleDrop(e)}
            className="p-4 h-fit rounded shadow-md bg-[#F6F6F6]"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className="flex flex-col gap-2 items-center justify-center">
              <RiUploadCloud2Line className="text-blue-500 text-[48px]" />
              <div className="space-x-2">
                <span>Drag & drop files or</span>
                <input className="hidden" key={fileKey} type="file" accept=".csv" onChange={handleFileChange} />
                <button
                  disabled={isLoading}
                  className="py-1 px-2 rounded-full text-blue-500 border border-blue-500 font-semibold text-sm"
                  onClick={() => (document.querySelector("input[type='file']") as HTMLInputElement)?.click()}
                >
                  Browse Files
                </button>
              </div>
              <p className="text-xs text-[#6D6D6D]">Supported file extensions include .csv. Files should not exceed 2MB in size.</p>
            </div>

            {file && (
              <div className="mt-4 p-3 border border-gray-300 rounded-md flex justify-between text-[#6D6D6D]">
                <span>
                  <p className="text-sm">{file.name}</p>
                </span>
                <button onClick={handleRemove}>
                  <RiDeleteBinLine className="hover:text-red-600 duration-300" />
                </button>
              </div>
            )}
          </form>
          <div className="w-full py-2 flex justify-end">
            <Link href={"/download/template_id_card.csv"} className="text-blue-500 text-sm font-medium hover:underline">
              Download Template
            </Link>
          </div>

          <div className={`w-full py-2 mt-0 md:mt-20 ${data ? "flex" : "hidden"}`}>
            <button className="bg-blue-500 text-white w-full px-4 py-2 rounded-md" onClick={() => handleDownloadAll(data)}>
              Download All Images
            </button>
          </div>
        </div>

        <div
          className="overflow-y-scroll w-full h-[90dvh] flex justify-between gap-2 p-8 
          border shadow-md rounded bg-[#F6F6F6]"
        >
          <FrontLayoutIdCard data={data} />
          <BackLayoutIdCard data={data} />
        </div>
      </div>
    </>
  );
};

export default UploadForm;
