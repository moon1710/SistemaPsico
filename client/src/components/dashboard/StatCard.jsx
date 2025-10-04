import React from "react";

const trendClasses = (t) =>
  t > 0
    ? "text-emerald-600 bg-emerald-50 ring-1 ring-emerald-100"
    : t < 0
    ? "text-rose-600 bg-rose-50 ring-1 ring-rose-100"
    : "text-gray-600 bg-gray-50 ring-1 ring-gray-100";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "from-[#527ceb] to-[#6762b3]", // gradient token
  trend, // number (can be negative)
  helper, // optional small caption under value
}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-[0_8px_28px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#7c777a] truncate">
              {title}
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-2xl font-bold text-[#21252d]">{value}</p>
              {typeof trend === "number" && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs ${trendClasses(
                    trend
                  )}`}
                >
                  {trend > 0 ? "▲" : trend < 0 ? "▼" : "•"} {Math.abs(trend)}%
                </span>
              )}
            </div>
            {helper && <p className="mt-1 text-xs text-[#7c777a]">{helper}</p>}
          </div>

          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}
          >
            {Icon ? <Icon className="w-6 h-6 text-white" /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
