import React from "react";

export default function DepartmentBadge({ department, showFullName = false }) {
  const configs = {
    TMS: {
      code: "TMS",
      title: "Track (Engineering)",
      short: "Track / TMS",
      bg: "bg-[#071F4D]",
      text: "text-[#E2E8F0]",
      border: "border-[#0B3D91]"
    },
    SMMS: {
      code: "SMMS",
      title: "Signalling & Telecom",
      short: "Signals / SMMS",
      bg: "bg-[#0F364C]",
      text: "text-[#BAE6FD]",
      border: "border-[#0284C7]"
    },
    TDMS: {
      code: "TDMS",
      title: "Traction Distribution (OHE)",
      short: "Traction / TDMS",
      bg: "bg-[#38260D]",
      text: "text-[#FED7AA]",
      border: "border-[#D97706]"
    }
  };

  const config = configs[department] || {
    code: department,
    title: department,
    short: department,
    bg: "bg-[#071F4D]",
    text: "text-[#CBD5E1]",
    border: "border-[#0B3D91]"
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider border ${config.bg} ${config.text} ${config.border}`}
      title={config.title}
    >
      {showFullName ? config.title : config.short}
    </span>
  );
}
