import Card from "@/components/Card";
import React from "react";

const page = () => {
  const proffesions = [
    "first",
    "second",
    "third"
  ];
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Professional Years</h1>
        <p className="text-gray-600 mb-12">Choose a year to explore subjects</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          {proffesions.map((year, i) => (
            <Card key={i} year={year} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
