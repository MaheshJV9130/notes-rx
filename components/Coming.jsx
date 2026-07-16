import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
const Coming = ({year}) => {
  return (
    <main className="min-h-screen  px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-10  sm:px-10 lg:flex-row lg:items-center lg:gap-16 lg:px-12">
        <div className="max-w-2xl lg:max-w-xl">
          <span className="inline-flex rounded-full  px-4 py-1 text-sm font-semibold text-blue-700">
            Coming Soon
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {year} Notes are on the way
          </h1>

          <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
            We are preparing a thoughtful learning experience with concise medical notes, illustrated summaries, and exam-ready revision tools for your {year} year.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
              Notify Me
            </button>
            <Link href={"/library"} className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              Explore Other Topics
            </Link>
          </div>

        
        </div>

        <div className="relative overflow-hidden  p-4 ">
          <div className="absolute -left-8 top-6 h-36 w-36  "></div>
          <div className="absolute -right-8 bottom-8 h-28 w-28 "></div>
          <Image
            src="/coming.png"
            alt="Illustration of notes and study planning"
            width={620}
            height={620}
            className="relative  w-full rounded-[1.5rem] object-cover"
          />
        </div>
      </div>
    </main>
  )
}

export default Coming