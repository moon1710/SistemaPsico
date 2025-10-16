// src/components/StatCard.jsx
import React from "react";
import { gradPrimary, glass, subtleText } from "../ui/tokens";

export default function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className={glass + " p-5"}>
      <div className="flex items-center gap-3 mb-3">
        <div
          className={
            "w-10 h-10 " +
            gradPrimary +
            " rounded-xl flex items-center justify-center"
          }
        >
          {Icon ? <Icon className="w-6 h-6 text-white" /> : null}
        </div>
        <span className={"text-sm " + subtleText}>{label}</span>
      </div>
      <div className="text-3xl font-bold leading-none">{value}</div>
      {hint ? <div className={"mt-1 text-sm " + subtleText}>{hint}</div> : null}
    </div>
  );
}
