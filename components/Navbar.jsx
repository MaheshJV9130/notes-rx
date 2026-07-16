"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import Button from "./Button";
import { IoCartSharp, IoHomeSharp, IoLibrary } from "react-icons/io5";
import { IoIosContacts } from "react-icons/io";
const Navbar = () => {
  const pathname = usePathname();

  // Hide navbar on subject pages for better PDF readability
  if (pathname && (pathname.startsWith("/subject") || pathname.startsWith("/subjects"))) return null;
  const impNav = [
    {
      icon: <IoHomeSharp size={25} />,
      name: "home",
    },
    {
      icon: <IoLibrary size={25} />,
      name: "library",
    },
    {
      icon: <IoIosContacts size={25} />,
      name: "contact",
    },
    {
      icon: <IoCartSharp size={25} />,
      name: "store",
    },
  ];
  return (
    <header className="bg-slate-950 p-3 sticky top-0 z-10">
      <nav className="h-16 flex justify-between items-center px-5">
        <Link href={"/"}>
          <Image
            style={{ width: "auto" }}
            src={"/logo-transparent-png.png"}
            alt="logo"
            width={250}
            height={250}
            className=""
          />
        </Link>
        <ol className="flex justify-center items-center gap-4 bg-slate-900 px-6 py-3 rounded-xl shadow-lg">
          {impNav.map((nav, index) => (
            <li key={index}>
              <Link
                href={`/${nav.name === "home" ? "" : nav.name}`}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <span className="text-blue-500/70">{nav.icon}</span>
                <span className="capitalize">{nav.name}</span>
              </Link>
            </li>
          ))}
        </ol>
        <div>
          <Button>Sign In</Button>
          <Button varient={"primary"}>Sign Up</Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
