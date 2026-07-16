"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiBook, FiFilter, FiSearch, FiLoader } from "react-icons/fi";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch subjects when year changes
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch(`/api/subjects/${selectedYear}`);
        if (!res.ok) {
          console.error("Failed to fetch subjects:", res.status);
          setSubjects([]);
          return;
        }
        const data = await res.json();
        setSubjects(Array.isArray(data) ? data : data.data || []);
        setSelectedSubject("");
        setChapters([]);
        setNotes([]);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]);
      }
    };

    if (selectedYear >= 1 && selectedYear <= 4) {
      fetchSubjects();
    }
  }, [selectedYear]);

  // Fetch chapters when subject changes
  useEffect(() => {
    if (!selectedSubject) {
      setChapters([]);
      setSelectedChapter("");
      setNotes([]);
      return;
    }

    const fetchChapters = async () => {
      try {
        const res = await fetch(`/api/chapters?subject=${selectedSubject}`);
        const data = await res.json();
        setChapters(data.data || []);
        setSelectedChapter("");
        setNotes([]);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchChapters();
  }, [selectedSubject]);

  // Fetch notes when filters change
  useEffect(() => {
    if (!selectedSubject) return;

    const fetchNotes = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          year: selectedYear,
          subject: selectedSubject,
          ...(selectedChapter && { chapter: selectedChapter }),
        });

        const res = await fetch(`/api/notes?${params}`);
        const data = await res.json();
        setNotes(data.data || []);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [selectedYear, selectedSubject, selectedChapter]);

  // Filter notes by search term
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FiBook className="text-blue-600" size={32} />
            Study Notes Library
          </h1>
          <p className="text-gray-600 text-lg">
            Filter and browse notes by year, subject, and chapter
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <FiFilter className="text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            {/* Subject Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chapter
              </label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                disabled={chapters.length === 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">All Chapters</option>
                {chapters.map((chapter) => (
                  <option key={chapter._id} value={chapter._id}>
                    Chapter {chapter.chapterNumber}: {chapter.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <FiLoader className="animate-spin text-blue-600" size={32} />
            <span className="ml-2 text-gray-600">Loading notes...</span>
          </div>
        )}

        {/* Notes Grid */}
        {!loading && (
          <>
            {filteredNotes.length > 0 ? (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Found {filteredNotes.length} note(s)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNotes.map((note) => (
                    <Link key={note._id} href={`/view/${note.pdfFileName}`}>
                      <div className="h-full bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer p-6">
                        <div className="flex items-start gap-3 mb-3">
                          <FiBook className="text-blue-600 flex-shrink-0 mt-1" />
                          <h3 className="font-semibold text-gray-900 line-clamp-2">
                            {note.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {note.description || "No description available"}
                        </p>
                        <div className="space-y-2 text-xs text-gray-500">
                          <p>
                            Subject: <span className="font-medium text-gray-700">{note.subject?.name}</span>
                          </p>
                          <p>
                            Chapter: <span className="font-medium text-gray-700">{note.chapter?.chapterNumber}</span>
                          </p>
                          <p>
                            Views: <span className="font-medium text-gray-700">{note.views}</span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <>
                {!selectedSubject ? (
                  <div className="text-center py-12">
                    <FiFilter className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600 text-lg">
                      Select a subject to view available notes
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiBook className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600 text-lg">
                      No notes found matching your filters
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
