import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactModal from "react-modal";
import { useReactToPrint } from "react-to-print";

ReactModal.setAppElement("#root"); 

function Grades() {
  const [gradeReports, setGradeReports] = useState([]);
  const [previewReport, setPreviewReport] = useState(null);
  const componentRef = useRef(null);

  useEffect(() => {

    axios.get("/api/grades") 
      .then((res) => setGradeReports(res.data))
      .catch((err) => console.error("Error fetching grades:", err));
  }, []);


  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: previewReport ? `Grade_Report_${previewReport.id}` : "Grade_Report",
  });

  const handleDownloadReport = (report) => {
    setPreviewReport(report);
    setTimeout(() => {
      handlePrint();
    }, 300); 
  };


  const calcTotals = (grades) => {
    let units = 0;
    grades.forEach((g) => units += g.unit);
    return units;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-12 text-gray-900">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M9 12h6M9 16h6M8 20h8a2 2 0 002-2v-5a2 2 0 00-2-2H8a2 2 0 00-2 2v5a2 2 0 002 2zM6 12h.01M6 16h.01" />
        </svg>
        Grade Report Card
      </h1>

      {gradeReports.map((report) => (
        <div key={report.id} className="mb-10 bg-white rounded-md shadow-lg p-6">
          <div className="bg-blue-900 text-white px-4 py-2 rounded-t-md mb-4 md:grid md:grid-cols-3 md:gap-x-6 md:text-sm">
            <div>
              <p><span className="font-semibold">Course:</span> {report.course}</p>
              <p><span className="font-semibold">Campus:</span> {report.campus}</p>
              <p><span className="font-semibold">Year Level:</span> {report.year_level}</p>
            </div>
            <div>
              <p><span className="font-semibold">Date Submitted:</span> {new Date(report.date_submitted).toLocaleString()}</p>
              <p><span className="font-semibold">School Year:</span> {report.school_year}</p>
            </div>
            <div>
              <p><span className="font-semibold">Semester:</span> {report.semester}</p>
            </div>
          </div>

          <table className="w-full text-left border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                {["DESCRIPTION", "CODE", "UNIT", "GRADE", "REMARKS", "PROFESSOR"].map((header) => (
                  <th
                    key={header}
                    className="border border-gray-300 py-2 px-3 text-xs font-semibold text-gray-700"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.grades.map((grade, idx2) => (
                <tr
                  key={idx2}
                  className={idx2 % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border border-gray-300 py-2 px-3 text-xs">{grade.description}</td>
                  <td className="border border-gray-300 py-2 px-3 text-xs">{grade.code}</td>
                  <td className="border border-gray-300 py-2 px-3 text-xs text-center">{grade.unit}</td>
                  <td className="border border-gray-300 py-2 px-3 text-xs text-center">{grade.grade}</td>
                  <td className="border border-gray-300 py-2 px-3 text-xs text-center text-green-700 font-semibold">{grade.remarks}</td>
                  <td className="border border-gray-300 py-2 px-3 text-xs">{grade.professor}</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold text-xs text-gray-900">
                <td colSpan={2} className="px-3 py-2 border border-gray-300">Total Units:</td>
                <td className="text-center border border-gray-300 py-2">{calcTotals(report.grades)}</td>
                <td className="text-center border border-gray-300 py-2">General Weighted Average: {report.gwa}</td>
                <td className="text-center border border-gray-300 py-2" colSpan={2}>Remarks: {report.overall_remarks}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 bg-yellow-100 border border-yellow-300 rounded px-4 py-3 text-xs text-yellow-900">
            <strong>IMPORTANT NOTES:</strong> NO CHANGES OF GRADES SHALL BE MADE UNLESS APPROVED BY THE COLLEGE DEPARTMENT CHAIR,
            VPO AND VPAA. NATIONAL SERVICE TRAINING PROGRAM IS NOT INCLUDED IN THE COMPUTATION OF GWA.
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => setPreviewReport(report)}
              className="flex items-center gap-1 border border-gray-600 rounded px-4 py-1.5 text-gray-700 hover:bg-gray-100 cursor-pointer select-none"
              type="button"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16l-4-4 4-4" />
              </svg>
              Preview
            </button>
            <button
              onClick={() => handleDownloadReport(report)}
              className="flex items-center gap-1 bg-blue-700 text-white rounded px-4 py-1.5 hover:bg-blue-800 cursor-pointer select-none"
              type="button"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M12 5v14" />
                <path d="M5 12l7 7 7-7" />
              </svg>
              Download Grades
            </button>
          </div>
        </div>
      ))}


      <ReactModal
        isOpen={!!previewReport}
        onRequestClose={() => setPreviewReport(null)}
        className="max-w-3xl mx-auto my-12 bg-white rounded-lg shadow-xl p-6 overflow-auto max-h-[80vh]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30"
      >
        {previewReport && (
          <>
            <h2 className="text-xl font-semibold mb-6 border-b pb-2">{previewReport.title}</h2>
            <div ref={componentRef}>
              <div className="mb-4 text-sm grid grid-cols-3 gap-6">
                <div>
                  <p><strong>Course:</strong> {previewReport.course}</p>
                  <p><strong>Campus:</strong> {previewReport.campus}</p>
                  <p><strong>Year Level:</strong> {previewReport.year_level}</p>
                </div>
                <div>
                  <p><strong>Date Submitted:</strong> {new Date(previewReport.date_submitted).toLocaleString()}</p>
                  <p><strong>School Year:</strong> {previewReport.school_year}</p>
                </div>
                <div>
                  <p><strong>Semester:</strong> {previewReport.semester}</p>
                </div>
              </div>

              <table className="w-full text-left border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    {["DESCRIPTION", "CODE", "UNIT", "GRADE", "REMARKS", "PROFESSOR"].map((header) => (
                      <th
                        key={header}
                        className="border border-gray-300 py-2 px-3 text-xs font-semibold text-gray-700"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewReport.grades.map((grade, idx2) => (
                    <tr
                      key={idx2}
                      className={idx2 % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="border border-gray-300 py-2 px-3 text-xs">{grade.description}</td>
                      <td className="border border-gray-300 py-2 px-3 text-xs">{grade.code}</td>
                      <td className="border border-gray-300 py-2 px-3 text-xs text-center">{grade.unit}</td>
                      <td className="border border-gray-300 py-2 px-3 text-xs text-center">{grade.grade}</td>
                      <td className="border border-gray-300 py-2 px-3 text-xs text-center text-green-700 font-semibold">{grade.remarks}</td>
                      <td className="border border-gray-300 py-2 px-3 text-xs">{grade.professor}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-semibold text-xs text-gray-900">
                    <td colSpan={2} className="px-3 py-2 border border-gray-300">Total Units:</td>
                    <td className="text-center border border-gray-300 py-2">{calcTotals(previewReport.grades)}</td>
                    <td className="text-center border border-gray-300 py-2">
                      General Weighted Average: {previewReport.gwa}
                    </td>
                    <td className="text-center border border-gray-300 py-2" colSpan={2}>
                      Remarks: {previewReport.overall_remarks}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-4 bg-yellow-100 border border-yellow-300 rounded px-4 py-3 text-xs text-yellow-900">
                <strong>IMPORTANT NOTES:</strong> NO CHANGES OF GRADES SHALL BE MADE UNLESS APPROVED BY THE COLLEGE DEPARTMENT CHAIR, VPO AND VPAA. NATIONAL SERVICE TRAINING PROGRAM IS NOT INCLUDED IN THE COMPUTATION OF GWA.
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => {
                  handlePrint();
                }}
                className="bg-blue-700 text-white px-5 py-2 rounded hover:bg-blue-800 transition cursor-pointer select-none"
                type="button"
              >
                Print / Download PDF
              </button>
              <button
                onClick={() => setPreviewReport(null)}
                className="border border-gray-400 px-5 py-2 rounded text-gray-700 hover:bg-gray-100 cursor-pointer select-none"
                type="button"
              >
                Close
              </button>
            </div>
          </>
        )}
      </ReactModal>
    </div>
  );
}

export default Grades;