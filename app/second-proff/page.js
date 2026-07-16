import SubjectCard from "@/components/SubjectCard";
import React from "react";

const page = () => {
  const subjects = [
    {name:"Swasthavirtta (PSM)",
      img:"/subjects/sub01.png"
    },
    {name:"Agadtantra",
      img:"/subjects/sub02.png"
    },
    {name:"Rasa-Bhaishajya",
      img:"/subjects/sub03.png"
    },
    {name:"Samihita Adhyayan 2",
      img:"/subjects/sub04.png"
    },
    {name:"Rog-Nidan",
      img:"/subjects/sub05.png"
    },
    {name:"Dravyaguna",
      img:"/subjects/sub06.png"
    },
  ];
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
      <section className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Second Professional Year
          </p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            All Second Proff Subjects
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Explore each subject and get ready to revise with polished notes, clear summaries, and exam-focused highlights.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {subjects.map((subject, i) => (
            <SubjectCard key={i} subjectName={subject.name} img={subject.img} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default page;
