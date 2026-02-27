import React from "react";

const Spinner = ({ size = 16, text = "Loading" }) => {

  const sizeClass = `h-${size} w-${size}`;

  return (
    <div className="absolute inset-0 z-100">
      <div
        role="status"
        className="flex flex-col items-center -mt-10 sm:mt-0 gap-4 min-h-screen justify-center bg-white"
      >
        <svg className={`${sizeClass} animate-spin`} viewBox="0 0 100 100">
          <circle
            fill="none"
            strokeWidth="7"
            stroke="#C6C6D1"
            className="opacity-50"
            cx="50"
            cy="50"
            r="40"
          />
          <circle
            fill="none"
            strokeWidth="7"
            stroke="#2563EB"
            strokeDasharray="250"
            strokeDashoffset="210"
            cx="50"
            cy="50"
            r="40"
          />
        </svg>
        <p className="text-sm text-gray-500">{text}</p>
        <span className="sr-only">{text}</span>
      </div>
    </div>
  );
};

export default Spinner;
