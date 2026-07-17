"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiDownload, FiZoomIn, FiZoomOut, FiLoader } from "react-icons/fi";
import * as pdfjsLib from "pdfjs-dist";

// Set up the worker for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PDFViewerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1.5);
  const [error, setError] = useState(null);

  const pdfUrl = searchParams.get("pdfUrl") || "";
  const filename = searchParams.get("file") || "";

  // Load PDF
  useEffect(() => {
    if (!pdfUrl && !filename) {
      setError("No PDF file specified");
      return;
    }

    const loadPDF = async () => {
      try {
        setLoading(true);
        // Use B2 URL if available, otherwise use local API endpoint
        const source = pdfUrl || `/api/pdf/${filename}`;
        console.log("[v0] Loading PDF from:", source);
        
        const pdf = await pdfjsLib.getDocument(source).promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } catch (err) {
        console.error("[v0] Error loading PDF:", err);
        setError("Failed to load PDF. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, [pdfUrl, filename]);

  // Render page
  useEffect(() => {
    if (!pdfDoc) return;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;

        if (!canvas) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const context = canvas.getContext("2d");
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (err) {
        console.error("Error rendering page:", err);
      }
    };

    renderPage();
  }, [pdfDoc, currentPage, scale]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.5, 0.5));
  };

  const handleDownload = () => {
    if (!pdfUrl && !filename) return;
    const link = document.createElement("a");
    link.href = pdfUrl || `/api/pdf/${filename}`;
    link.download = filename;
    link.click();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <FiArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white hover:text-blue-400 transition"
        >
          <FiArrowLeft size={24} />
          Back
        </button>

        <div className="flex items-center gap-4">
          <span className="text-white text-sm">
            {currentPage} / {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
              title="Zoom Out"
            >
              <FiZoomOut size={20} />
            </button>

            <span className="text-white text-sm min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>

            <button
              onClick={handleZoomIn}
              className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
              title="Zoom In"
            >
              <FiZoomIn size={20} />
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            title="Download PDF"
          >
            <FiDownload size={20} />
            Download
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto bg-gray-900 flex items-center justify-center p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <FiLoader className="animate-spin text-blue-400" size={48} />
            <p className="text-white text-lg">Loading PDF...</p>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="bg-gray-800 rounded-lg shadow-2xl overflow-auto max-w-4xl w-full"
          >
            <canvas
              ref={canvasRef}
              className="w-full block"
              style={{ display: "block", margin: "0 auto" }}
            />
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-3 flex items-center justify-center gap-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <input
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= totalPages) {
              setCurrentPage(page);
            }
          }}
          className="w-20 px-3 py-2 bg-gray-700 text-white rounded text-center border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
