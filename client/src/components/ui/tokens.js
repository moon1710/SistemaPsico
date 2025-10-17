// src/ui/tokens.js
export const PALETTE = {
  primary: "#527ceb",
  secondary: "#6762b3",
  base: "#f7f7f7",
  text: "#21252d",
  muted: "#7c777a",
};

// Glass base y helpers
export const glass =
  "rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_28px_rgba(0,0,0,0.08)]";

export const softCard =
  glass + " transition-all duration-300 hover:scale-[1.02]";

export const gradPrimary = "bg-gradient-to-br from-[#527ceb] to-[#6762b3]";

export const pageWrap = "max-w-7xl mx-auto p-6 space-y-8 text-[#21252d]";

export const subtleText = "text-[#7c777a]";
export const baseBg = "bg-[#f7f7f7]";

export const cta =
  gradPrimary +
  " text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02]";
