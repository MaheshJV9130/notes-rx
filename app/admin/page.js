"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiLogOut,
  FiUpload,
  FiList,
  FiSettings,
  FiHome,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("upload");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const adminData = localStorage.getItem("adminUser");
    if (!adminData) {
      router.push("/admin-login");
      return;
    }
    setAdmin(JSON.parse(adminData));
    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      router.push("/admin-login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-blue-700 to-indigo-700 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-blue-600 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">NotesRX Admin</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-blue-600 rounded transition"
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-3">
          <button
            onClick={() => setActiveTab("upload")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600 transition ${
              activeTab === "upload" ? "bg-blue-600" : ""
            }`}
          >
            <FiUpload size={20} />
            {sidebarOpen && <span>Upload Notes</span>}
          </button>

          <button
            onClick={() => setActiveTab("manage")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600 transition ${
              activeTab === "manage" ? "bg-blue-600" : ""
            }`}
          >
            <FiList size={20} />
            {sidebarOpen && <span>Manage Notes</span>}
          </button>

          <button
            onClick={() => setActiveTab("subjects")}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600 transition ${
              activeTab === "subjects" ? "bg-blue-600" : ""
            }`}
          >
            <FiSettings size={20} />
            {sidebarOpen && <span>Subjects</span>}
          </button>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-blue-600 space-y-3">
          {sidebarOpen && (
            <div className="text-sm">
              <p className="font-semibold truncate">{admin.name}</p>
              <p className="text-blue-200 text-xs truncate">{admin.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
              <p className="text-gray-600">Welcome, {admin.name}!</p>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              <FiHome size={20} />
              Go to Site
            </Link>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {activeTab === "upload" && <UploadNotesTab />}
          {activeTab === "manage" && <ManageNotesTab />}
          {activeTab === "subjects" && <SubjectsTab />}
        </div>
      </div>
    </div>
  );
}

// Upload Notes Tab Component
function UploadNotesTab() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    chapter: "",
    year: 1,
  });
  const [file, setFile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/subjects/1");
      const data = await res.json();
      setSubjects(data || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleYearChange = async (year) => {
    setFormData({ ...formData, year: parseInt(year), subject: "", chapter: "" });
    setChapters([]);

    try {
      const res = await fetch(`/api/subjects/${year}`);
      const data = await res.json();
      setSubjects(data || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleSubjectChange = async (subjectId) => {
    setFormData({ ...formData, subject: subjectId, chapter: "" });

    if (!subjectId) {
      setChapters([]);
      return;
    }

    try {
      const res = await fetch(`/api/chapters?subject=${subjectId}`);
      const data = await res.json();
      setChapters(data.data || []);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a PDF file");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Upload PDF file
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadRes.ok) {
        throw new Error("File upload failed");
      }

      const uploadData = await uploadRes.json();

      // Create note record
      const admin = JSON.parse(localStorage.getItem("adminUser"));

      const noteRes = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pdfFileName: uploadData.filename,
          pdfSize: uploadData.size,
          uploadedBy: admin._id,
        }),
      });

      if (!noteRes.ok) {
        throw new Error("Failed to create note record");
      }

      setMessage("Note uploaded successfully!");
      setFormData({ title: "", description: "", subject: "", chapter: "", year: 1 });
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Error uploading note: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Upload New Note</h3>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes("Error")
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter note title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            rows="3"
            placeholder="Enter note description"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <select
              value={formData.year}
              onChange={(e) => handleYearChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <select
              value={formData.subject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chapter
          </label>
          <select
            value={formData.chapter}
            onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Chapter</option>
            {chapters.map((chapter) => (
              <option key={chapter._id} value={chapter._id}>
                Chapter {chapter.chapterNumber}: {chapter.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PDF File
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {file && <p className="text-sm text-gray-600 mt-1">Selected: {file.name}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? "Uploading..." : "Upload Note"}
        </button>
      </form>
    </div>
  );
}

// Manage Notes Tab Component
function ManageNotesTab() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      setNotes(data.data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading notes...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Manage Notes</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Subject</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Chapter</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Views</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">{note.title}</td>
                <td className="py-3 px-4">{note.subject?.name}</td>
                <td className="py-3 px-4">Chapter {note.chapter?.chapterNumber}</td>
                <td className="py-3 px-4">{note.views}</td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Subjects Tab Component
function SubjectsTab() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Manage Subjects</h3>
      <p className="text-gray-600">
        Subject management feature coming soon. Admins will be able to create, edit, and delete subjects and chapters.
      </p>
    </div>
  );
}
