import Image from "next/image";
import { FiArrowDownRight } from "react-icons/fi";
import { fontInter, fontSourceSerif4 } from "@/resources/fonts";
import { IdCard } from "./type";
import imageExporter from "@/services/image-exporter-service";

const BackLayoutIdCard = ({ data }: { data: IdCard[] | null }) => {
  return (
    <div className="w-3/4 flex flex-col gap-8">
      <h1 className="text-left text-2xl">
        Back <span className="font-semibold italic font-source-serif-pro">Layout </span> :
      </h1>
      <div className={`flex flex-wrap w-full justify-start items-center ${fontInter.variable} ${fontSourceSerif4.variable}`}>
        {data === null ? (
          <>Upload your CSV file to see the result</>
        ) : (
          data.map((item, index) => {
            const id = `back_image_${index}`;
            return (
              <div key={index} className="flex flex-col justify-center items-center mb-8">
                <div
                  id={id}
                  className="relative w-[calc(530px/2)] h-[calc(818px/2)] font-inter px-[20px] py-8"
                  style={{
                    backgroundImage: `url(/BG_Back.png)`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>
                <p className="max-w-60 h-min my-2">{`${item.full_name.replace(".", "")} - ${item.employee_id} - back`}</p>
                <button
                  className="bg-teal-500 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-lg block"
                  onClick={() => imageExporter.exportToPng(id, `${item.full_name.replace(".", "")} - ${item.employee_id} - back`)}
                >
                  Download
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BackLayoutIdCard;
