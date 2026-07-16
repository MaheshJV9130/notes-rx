import Image from "next/image";
import Link from "next/link";
import React from "react";

const SubjectCard = ({ subjectName, img }) => {
  return (
    <Link href={`/subject/${subjectName}`} className="w-full max-w-[300px] mx-auto">
      <div className="group flex h-full flex-col overflow-hidden border-[6px] border-black bg-white p-4 shadow-[10px_10px_0_#000] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[14px_14px_0_#000]">
        
        {/* Image */}
        {/* <div className="relative h-[220px] w-full overflow-hidden border-2 border-black">
          <Image
            src={img}
            alt={subjectName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div> */}

        {/* Content */}
        <div className="mt-4 flex flex-1 items-center">
          <h3 className="relative inline-block text-2xl font-black uppercase leading-tight text-black md:text-3xl">
            {subjectName}

            <span className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-black transition-transform duration-300 group-hover:scale-x-100" />
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default SubjectCard;