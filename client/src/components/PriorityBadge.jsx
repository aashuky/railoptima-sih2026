import React from "react";

export default function PriorityBadge({ priority }) {
  const configs = {
    High: {
      bg: "bg-[#ED1B24]/15",
      text: "text-[#ED1B24]",
      border: "border-[#ED1B24]/40",
      indicator: "bg-[#ED1B24]"
    },
    Medium: {
      bg: "bg-[#F59E0B]/15",
      text: "text-[#B45309]",
      border: "border-[#F59E0B]/40",
      indicator: "bg-[#F59E0B]"
    },
    Low: {
      bg: "bg-[#64748B]/15",
      text: "text-[#475569]",
      border: "border-[#64748B]/30",
      indicator: "bg-[#64748B]"
    }
  };

  const config = configs[priority] || configs.Low;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${config.bg} ${config.text} ${config.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.indicator}`} />
      {priority}
    </span>
  );
}
