// src/components/PdfViewer.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Icon } from '@iconify/react';

// Correct worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

function PdfViewer({ pdfFile }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageInputValue, setPageInputValue] = useState('1');

  const containerRef = useRef(null);
  const [pdfWidth, setPdfWidth] = useState(800);
  const [pdfHeight, setPdfHeight] = useState(0);
  const [pdfAspectRatio, setPdfAspectRatio] = useState(1.414); // default A4 ratio ~ 1:1.414

  // Responsive width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const newWidth = Math.min(Math.max(containerWidth * 0.95, 350), 800);
        setPdfWidth(newWidth);
        setPdfHeight(newWidth * pdfAspectRatio);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [pdfAspectRatio]);

  const onDocumentLoadSuccess = (doc) => {
    setNumPages(doc.numPages);
    setLoading(false);
    setPageInputValue('1');

    // Get first page size to calculate aspect ratio
    doc.getPage(1).then((page) => {
      const viewport = page.getViewport({ scale: 1 });
      setPdfAspectRatio(viewport.height / viewport.width);
      setPdfHeight(pdfWidth * (viewport.height / viewport.width));
    });
  };

  const onDocumentLoadError = (err) => {
    console.error('PDF load error:', err);
    setError('Failed to load PDF. Please check if the file is valid.');
    setLoading(false);
  };

  const goToPreviousPage = useCallback(() => {
    setPageNumber(prev => {
      const newPage = Math.max(prev - 1, 1);
      setPageInputValue(String(newPage));
      return newPage;
    });
  }, []);

  const goToNextPage = useCallback(() => {
    setPageNumber(prev => {
      const newPage = Math.min(prev + 1, numPages);
      setPageInputValue(String(newPage));
      return newPage;
    });
  }, [numPages]);

  const handlePageInputChange = (e) => setPageInputValue(e.target.value);
  const handlePageInputBlur = () => {
    const page = parseInt(pageInputValue, 10);
    if (!isNaN(page) && page >= 1 && page <= numPages) {
      setPageNumber(page);
      setPageInputValue(String(page));
    } else {
      setPageInputValue(String(pageNumber));
    }
  };
  const handlePageInputKeyDown = (e) => e.key === 'Enter' && handlePageInputBlur();

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center">
      {/* Loading */}
      {loading && !error && (
        <div className="flex items-center justify-center py-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="text-gray-600 mt-2">Loading PDF...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center text-red-600 py-10">
          <p>{error}</p>
        </div>
      )}

      {/* PDF */}
      {!error && (
        <>
          <div
            className="overflow-auto flex justify-center py-4"
            style={{
              minWidth: 350,
              maxWidth: 800,
              width: '95%',
            }}
          >
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              className="flex justify-center"
              loading={null}
            >
              <Page
                pageNumber={pageNumber}
                width={pdfWidth}
                height={pdfHeight} // height derived from aspect ratio
                renderTextLayer
                renderAnnotationLayer
                className="shadow-lg"
                loading={
                  <div
                    style={{ width: pdfWidth, height: pdfHeight }}
                    className="flex items-center justify-center"
                  >
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                  </div>
                }
              />
            </Document>
          </div>

          {/* Controls */}
          {numPages && (
            <div className="w-full flex items-center justify-center px-4 py-3 border-t  text-sm max-w-[800px]">

              <div className="flex items-center gap-2">
                <button
                  className="p-1.5 rounded border hover:bg-gray-50 disabled:opacity-50"
                  disabled={pageNumber <= 1}
                  onClick={goToPreviousPage}
                  aria-label="Previous page"
                >
                  <Icon icon={"iconamoon:arrow-left-2"}></Icon>
                </button>

                <input
                  type="number"
                  min={1}
                  max={numPages}
                  value={pageInputValue}
                  onChange={handlePageInputChange}
                  onBlur={handlePageInputBlur}
                  onKeyDown={handlePageInputKeyDown}
                  className="w-12 text-center border rounded py-1 px-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  aria-label="Page number"
                />
                <span className="text-gray-600">/ {numPages}</span>

                <button
                  className="p-1.5 rounded border hover:bg-gray-50 disabled:opacity-50"
                  disabled={pageNumber >= numPages}
                  onClick={goToNextPage}
                  aria-label="Next page"
                >
                  <Icon icon={"iconamoon:arrow-right-2"}></Icon>
                </button>
              </div>

            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PdfViewer;