import Image from "next/image";
import React from "react";

const Loading = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="flex flex-col items-center gap-4">
        <Image src="/loader.gif" alt="loader" width={140} height={140} className="rounded-full" />
        <p className="text-sm font-medium text-slate-700">Loading...</p>
      </div>
    </main>
  );
};

export default Loading;
