"use client";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
export default function Home() {
  const sequence = [
    "Swasthavirtta",
    2000,
    "Agadtantra",
    2000,
    "Rog-Nidan",
    2000,
    "Dravyaguna",
    2000,
  ];

  return (
    <section className="overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28 ">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div>
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
              ✨ Trusted by Medical Students & Healthcare Professionals
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Learn{" "}
              <TypeAnimation
                sequence={sequence}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="text-blue-600"
              />
            </h1>
            <span className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Smarter
            </span>
            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Access thousands of expertly curated medical notes, concise topic
              summaries, and comprehensive study resources designed to help
              students, interns, and healthcare professionals learn faster,
              revise efficiently, and stay ahead.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700">
                Explore Library
              </button>

              <button className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50">
                Join Now
              </button>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">10K+</h3>
                <p className="text-sm text-gray-600">Study Notes</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900">500+</h3>
                <p className="text-sm text-gray-600">Medical Topics</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900">100+</h3>
                <p className="text-sm text-gray-600">Quick Summaries</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900">24/7</h3>
                <p className="text-sm text-gray-600">Access Anywhere</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-blue-200/40 blur-3xl"></div>
            <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-cyan-200/40 blur-3xl"></div>

            <div className="relative overflow-hidden  p-4 ">
              <Image
                width={500}
                height={500}
                loading="eager"
                src="/hero2.png"
                alt="Medical student studying with digital medical notes"
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
