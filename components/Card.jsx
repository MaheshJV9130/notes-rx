import Link from 'next/link';
import React from 'react';

const Card = ({year}) => {
  return (
    <section className="relative  group flex flex-col items-center justify-center w-full h-full">
      <Link href={`/${year}-proff`} className="file relative w-60 h-40 cursor-pointer origin-bottom [perspective:1500px] z-50 flex flex-col items-center justify-center">
        <div className="work-5 bg-blue-500 w-full h-full origin-top rounded-2xl rounded-tl-none group-hover:shadow-[0_20px_40px_rgba(0,0,0,.2)] transition-all ease duration-300 relative after:absolute after:content-[''] after:bottom-[99%] after:left-0 after:w-20 after:h-4 after:bg-blue-500 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[15px] before:left-[75.5px] before:w-4 before:h-4 before:bg-blue-500 before:[clip-path:polygon(0_35%,0%_100%,50%_100%);]" />
        <div className="work-4 absolute inset-1 bg-zinc-400 rounded-2xl transition-all ease duration-300 origin-bottom select-none group-hover:[transform:rotateX(-20deg)]" />
        <div className="work-3 absolute inset-1 bg-zinc-300 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-30deg)]" />
        <div className="work-2 absolute inset-1 bg-zinc-200 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-38deg)]" />
        <div className="work-1 absolute bottom-0 bg-gradient-to-t from-blue-500 to-blue-400 w-full h-[156px] rounded-2xl rounded-tr-none after:absolute after:content-[''] after:bottom-[99%] after:right-0 after:w-[146px] after:h-[16px] after:bg-blue-400 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[10px] before:right-[142px] before:size-3 before:bg-blue-400 before:[clip-path:polygon(100%_14%,50%_100%,100%_100%);] transition-all ease duration-300 origin-bottom flex items-end group-hover:shadow-[inset_0_20px_40px_#60a5fa,_inset_0_-20px_40px_#1d4ed8] group-hover:[transform:rotateX(-46deg)_translateY(1px)]" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none transition-all ease duration-300 group-hover:[transform:rotateX(-30deg)]">
          <p className="text-2xl font-bold capitalize text-white drop-shadow-lg">{year} proff</p>
        </div>
      </Link>
    </section>
  );
}

export default Card;
