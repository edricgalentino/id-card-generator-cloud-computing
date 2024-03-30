import Image from "next/image";
import { IdCard } from "./type";
import { fontInter, fontSourceSerif4 } from "@/resources/fonts";
import imageExporter from "@/services/image-exporter-service";
import { Dispatch, SetStateAction, useState } from "react";
import { createPortal } from "react-dom";

type FrontLayoutIdCardProps = {
  data: IdCard[] | null;
};

const FrontLayoutIdCard = ({ data }: FrontLayoutIdCardProps) => {
  return (
    <div className="w-3/4 flex flex-col gap-8">
      <h1 className="text-left text-2xl">
        Front <span className="font-semibold italic font-source-serif-pro">Layout</span> :
      </h1>
      <div className={`flex flex-wrap w-full justify-start items-center ${fontInter.variable} ${fontSourceSerif4.variable}`}>
        {data === null ? (
          <>Upload your CSV file to see the result</>
        ) : (
          data.map((item, index) => {
            const fullname = item.full_name.includes(" ") ? item.full_name.split(" ") : [item.full_name];
            const id = `front_image_${index}`;
            return (
              <div key={index} className="flex flex-col justify-center items-center mb-8">
                <FrontIdCard fullname={fullname} id={id} index={index} item={item} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FrontLayoutIdCard;

type cardProps = {
  id: string;
  fullname: string[];
  index: number;
  item: IdCard;
};
const FrontIdCard = ({ id, fullname, index, item }: cardProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <div
        id={id}
        onClick={() => setIsOpen(true)}
        className="relative w-[calc(530px/2)] h-[calc(818px/2)] font-inter cursor-pointer"
        key={index}
        style={{
          backgroundImage: `url(/BG_Front.png)`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div key={index} className="flex flex-col items-center justify-center absolute z-10 right-2 left-2 top-[60px]">
          <Image
            src={item.gdrive_link_photo}
            alt="User Photo"
            className="rounded-full border-2 border-black bg-center bg-cover"
            width={125}
            height={125}
          />
        </div>
        <div className="flex flex-col gap-4 justify-center items-center w-9/12 absolute top-[200px] left-9 z-20">
          <div className="flex flex-col justify-center items-center">
            <p className="text-lg font-semibold font-inter">
              {fullname[0]} <span className="font-source-serif-pro italic">{fullname.length > 1 ? fullname.slice(1).join(" ") : ""}</span>
            </p>
            <p className="text-[11px] uppercase">{item.position}</p>
          </div>
          <div className="flex flex-col justify-center items-start text-[10px]">
            <div className="flex w-full gap-1">
              <p className="w-1/2">ID</p>
              <p>:</p>
              <p className="w-full"> {item.employee_id}</p>
            </div>
            <div className="flex w-full gap-1">
              <p className="w-1/2">Email</p>
              <p>:</p>
              <p className="w-full"> {item.email}</p>
            </div>
            <div className="flex w-full gap-1">
              <p className="w-1/2">Phone</p>
              <p>:</p>
              <p className="w-full"> {item.phone}</p>
            </div>
            <div className="flex w-full gap-1">
              <p className="w-1/2">Departement</p>
              <p>:</p>
              <p className="w-full">
                {item.business_unit} / {item.department}
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="max-w-60 h-min my-2">{`${item.full_name.replace(".", "")} - ${item.employee_id} - front`}</p>
      <button
        className="bg-teal-500 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-lg block"
        onClick={() => imageExporter.exportToPng(id, `${item.full_name.replace(".", "")} - ${item.employee_id} - front`)}
      >
        Download
      </button>
      <Preview isOpen={isOpen} setIsOpen={setIsOpen} fullname={fullname} id={id} index={index} item={item} />
    </>
  );
};

type PreviewProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
} & cardProps;
const Preview = ({ isOpen, setIsOpen, id, fullname, index, item }: PreviewProps) => {
  return (
    <>
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 z-20 flex flex-col gap-1 items-center justify-center" onClick={() => setIsOpen(false)}>
            <div className="relative bg-red-100">
              <div
                id={id + `_preview`}
                onClick={() => setIsOpen(true)}
                className="relative w-[calc(530px/2)] h-[calc(818px/2)] font-inter scale-150"
                key={index}
                style={{
                  backgroundImage: `url(/BG_Front.png)`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div key={index} className="flex flex-col items-center justify-center absolute z-10 right-2 left-2 top-[60px]">
                  <Image
                    src={item.gdrive_link_photo}
                    alt="User Photo"
                    className="rounded-full border-2 border-black bg-center bg-cover"
                    width={125}
                    height={125}
                  />
                </div>
                <div className="flex flex-col gap-4 justify-center items-center w-9/12 absolute top-[200px] left-9 z-20">
                  <div className="flex flex-col justify-center items-center">
                    <p className="text-lg font-semibold font-inter">
                      {fullname[0]}{" "}
                      <span className="font-source-serif-pro italic">{fullname.length > 1 ? fullname.slice(1).join(" ") : ""}</span>
                    </p>
                    <p className="text-[11px] uppercase">{item.position}</p>
                  </div>
                  <div className="flex flex-col justify-center items-start text-[10px]">
                    <div className="flex w-full gap-1">
                      <p className="w-1/2">ID</p>
                      <p>:</p>
                      <p className="w-full"> {item.employee_id}</p>
                    </div>
                    <div className="flex w-full gap-1">
                      <p className="w-1/2">Email</p>
                      <p>:</p>
                      <p className="w-full"> {item.email}</p>
                    </div>
                    <div className="flex w-full gap-1">
                      <p className="w-1/2">Phone</p>
                      <p>:</p>
                      <p className="w-full"> {item.phone}</p>
                    </div>
                    <div className="flex w-full gap-1">
                      <p className="w-1/2">Departement</p>
                      <p>:</p>
                      <p className="w-full">
                        {item.business_unit} / {item.department}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="bg-teal-500 text-xl hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-lg absolute bottom-8"
              onClick={(e) => {
                e.stopPropagation();
                imageExporter.exportToPng(id, `${item.full_name.replace(".", "")} - ${item.employee_id} - front`);
              }}
            >
              Download
            </button>
          </div>,
          document.body
        )}{" "}
    </>
  );
};
