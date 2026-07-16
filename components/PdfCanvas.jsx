"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MdClose } from "react-icons/md";

export default function PdfViewer({ pdfUrl }) {
  const router = useRouter();
  const containerRef = useRef(null);
  const pdfDisplayRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1.5);
  const [rotation, setRotation] = useState(0);
  const pdfRef = useRef(null);
  const currentPageRef = useRef(1);
  const pdfDataRef = useRef(null);
  const scrollAnimationRef = useRef(null);

  useEffect(() => {
    let canceled = false;

    function handleKeyDown(event) {
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && (key === "p" || key === "s")) {
        event.preventDefault();
      }
      if (key === "printscreen") {
        event.preventDefault();
      }
    }

    function handleBeforePrint(event) {
      event.preventDefault();
    }

    function handleWheel(event) {
      if ((event.ctrlKey || event.metaKey) && event.deltaY) {
        event.preventDefault();
        setZoom((prev) => {
          const newZoom = event.deltaY > 0
            ? Math.max(0.5, prev - 0.1)
            : Math.min(3, prev + 0.1);
          return newZoom;
        });
      }
    }

    function handleScroll() {
      if (!pdfDisplayRef.current || !containerRef.current) return;
      if (scrollAnimationRef.current) return;

      scrollAnimationRef.current = requestAnimationFrame(() => {
        scrollAnimationRef.current = null;

        const pageElements = containerRef.current.querySelectorAll(".pdf-page-wrapper");
        if (!pageElements.length) return;

        const scrollMiddle = pdfDisplayRef.current.scrollTop + pdfDisplayRef.current.clientHeight / 2;
        let visiblePage = currentPageRef.current;

        pageElements.forEach((pageEl) => {
          const top = pageEl.offsetTop;
          const bottom = top + pageEl.offsetHeight;
          if (scrollMiddle >= top && scrollMiddle < bottom) {
            visiblePage = Number(pageEl.dataset.pageNumber);
          }
        });

        if (visiblePage !== currentPageRef.current) {
          currentPageRef.current = visiblePage;
          setCurrentPage(visiblePage);
        }
      });
    }

    async function loadPdf() {
      if (!pdfUrl || !containerRef.current) return;

      const pdfjsLib = await import("pdfjs-dist/build/pdf");

      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();

      if (!pdfRef.current || pdfRef.currentUrl !== pdfUrl) {
        try {
          const response = await fetch(pdfUrl, {
            headers: { "X-Requested-With": "XMLHttpRequest" },
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.statusText}`);
          }
          const blob = await response.blob();
          pdfDataRef.current = await blob.arrayBuffer();
        } catch (error) {
          console.error("Error fetching PDF:", error);
          return;
        }

        if (canceled || !containerRef.current) return;

        const pdf = await pdfjsLib.getDocument({ data: pdfDataRef.current }).promise;
        pdfRef.current = pdf;
        pdfRef.currentUrl = pdfUrl;
        setTotalPages(pdf.numPages);
      }

      if (canceled || !containerRef.current || !pdfRef.current) return;
      await renderPages(pdfRef.current, zoom, pdfjsLib);
    }

    async function renderPages(pdf, scale, pdfjsLib) {
      if (!containerRef.current) return;

      const preservedPage = Math.min(currentPageRef.current || 1, pdf.numPages);
      containerRef.current.innerHTML = "";
      const fragment = document.createDocumentFragment();

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
        const pageWrapper = document.createElement("div");
        pageWrapper.className = "pdf-page-wrapper mb-8 overflow-hidden rounded-xl bg-white shadow-sm";
        pageWrapper.dataset.pageNumber = pageNum;

        const pageLabel = document.createElement("div");
        pageLabel.className = "px-3 py-2 text-sm text-gray-600 border-b border-gray-200";
        pageLabel.textContent = `Page ${pageNum} of ${pdf.numPages}`;
        pageWrapper.appendChild(pageLabel);

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale, rotation });

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.className = "w-full block";

        await page.render({
          canvasContext: ctx,
          viewport,
        }).promise;

        pageWrapper.appendChild(canvas);
        fragment.appendChild(pageWrapper);
      }

      containerRef.current.appendChild(fragment);
      currentPageRef.current = preservedPage;
      setCurrentPage(preservedPage);

      if (pdfDisplayRef.current) {
        scrollToPage(preservedPage);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeprint", handleBeforePrint);
    if (pdfDisplayRef.current) {
      pdfDisplayRef.current.addEventListener("wheel", handleWheel, { passive: false });
      pdfDisplayRef.current.addEventListener("scroll", handleScroll);
    }

    loadPdf();

    return () => {
      canceled = true;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeprint", handleBeforePrint);
      if (pdfDisplayRef.current) {
        pdfDisplayRef.current.removeEventListener("wheel", handleWheel);
        pdfDisplayRef.current.removeEventListener("scroll", handleScroll);
      }
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, [pdfUrl, zoom, rotation]);

  const scrollToPage = (pageNum) => {
    if (!containerRef.current || !pdfDisplayRef.current) return;

    const target = containerRef.current.querySelector(`[data-page-number="${pageNum}"]`);
    if (!target) return;

    const toolbarHeight = pdfDisplayRef.current.querySelector(".pdf-toolbar")?.offsetHeight || 0;
    const targetTop = target.offsetTop - toolbarHeight - 12;

    pdfDisplayRef.current.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth",
    });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      scrollToPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      scrollToPage(currentPage + 1);
    }
  };

  const handleFirst = () => {
    if (totalPages > 0) {
      scrollToPage(1);
    }
  };

  const handleLast = () => {
    if (totalPages > 0) {
      scrollToPage(totalPages);
    }
  };

  const handlePageChange = (e) => {
    const page = parseInt(e.target.value, 10);
    if (!Number.isNaN(page) && page >= 1 && page <= totalPages) {
      scrollToPage(page);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(3, prev + 0.2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.5, prev - 0.2));
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev + 270) % 360);
  };

  const handleResetRotation = () => {
    setRotation(0);
  };

  const handleResetZoom = () => {
    setZoom(1.5);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div
        ref={pdfDisplayRef}
        onContextMenu={(event) => event.preventDefault()}
        onCopy={(event) => event.preventDefault()}
        className="flex-1 overflow-auto select-none touch-none relative bg-gray-100"
      >
        <style>{`
          @media print {
            .pdf-container {
              display: none !important;
            }
          }
          .pdf-canvas-wrapper canvas {
            pointer-events: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
        `}</style>
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 z-30 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
          title="Close PDF"
          aria-label="Close PDF"
        >
          <MdClose size={24} />
        </button>

        <div className="pdf-toolbar sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200 p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={handleFirst}
              disabled={currentPage === 1}
              title="First Page"
              className={`${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-default' : 'bg-blue-600 text-white'} px-3 py-2 rounded text-sm font-medium`}
            >
              First
            </button>
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              title="Previous Page"
              className={`${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-default' : 'bg-blue-600 text-white'} px-3 py-2 rounded text-sm font-medium`}
            >
              Prev
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              title="Next Page"
              className={`${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-default' : 'bg-blue-600 text-white'} px-3 py-2 rounded text-sm font-medium`}
            >
              Next
            </button>
            <button
              onClick={handleLast}
              disabled={currentPage === totalPages}
              title="Last Page"
              className={`${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-default' : 'bg-blue-600 text-white'} px-3 py-2 rounded text-sm font-medium`}
            >
              Last
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Page:</label>
            <input
              type="number"
              value={currentPage}
              onChange={handlePageChange}
              min="1"
              max={totalPages}
              className="w-14 px-2 py-1 border border-gray-200 rounded text-sm"
            />
            <span className="text-sm text-gray-600">of {totalPages}</span>
          </div>

          <div className="flex gap-2 items-center">
            <button onClick={handleZoomOut} title="Zoom Out" className="px-3 py-2 bg-green-600 text-white rounded text-sm">−</button>
            <span className="text-sm font-medium text-gray-800 min-w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} title="Zoom In" className="px-3 py-2 bg-green-600 text-white rounded text-sm">+</button>
            <button onClick={handleResetZoom} title="Reset Zoom" className="px-3 py-2 bg-gray-600 text-white rounded text-sm">Reset</button>
          </div>

          <div className="flex gap-2 items-center">
            <button onClick={handleRotateLeft} title="Rotate Left" className="px-3 py-2 bg-indigo-600 text-white rounded text-sm">⟲</button>
            <span className="text-sm font-medium text-gray-800 min-w-12 text-center">{rotation}°</span>
            <button onClick={handleRotateRight} title="Rotate Right" className="px-3 py-2 bg-indigo-600 text-white rounded text-sm">⟳</button>
            <button onClick={handleResetRotation} title="Reset Rotation" className="px-3 py-2 bg-gray-600 text-white rounded text-sm">Reset</button>
          </div>
        </div>

        <div className="pdf-canvas-wrapper pdf-container mx-auto py-5 px-3" ref={containerRef} />
      </div>
    </div>
  );
}