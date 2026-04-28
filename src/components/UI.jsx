import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function makeBarData(solidColor) {
  return { solidColor };
}

export function StatCard({ title, subtitle, value, bars }) {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);

  const color = bars?.solidColor ?? "#3b82f6";

  const getRgb = (hex) => {
    let v = hex.replace("#", "");
    if (v.length === 3) v = v.split("").map((c) => c + c).join("");
    return [
      parseInt(v.substring(0, 2), 16),
      parseInt(v.substring(2, 4), 16),
      parseInt(v.substring(4, 6), 16),
    ];
  };

  const drawBars = () => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;

    const dpr = window.devicePixelRatio || 1;
    const W = card.offsetWidth;
    const H = card.offsetHeight;

    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const BAR_W = Math.round(2 * dpr);
    const GAP   = Math.round(2 * dpr);
    const STEP  = BAR_W + GAP;

    const totalPhysW = Math.round(W * dpr);
    const count = Math.ceil(totalPhysW / STEP);

    const [r, g, b] = getRgb(color);
    const physH = Math.round(H * dpr);

    for (let i = 0; i < count; i++) {
      const x = i * STEP;
      const isFirst = i === 0;
      const barH = Math.round(isFirst ? physH : physH * 0.56);
      const y = physH - barH;

      const grad = ctx.createLinearGradient(x, physH, x, y);
      if (isFirst) {
        grad.addColorStop(0,    `rgba(${r},${g},${b},0.0)`);
        grad.addColorStop(0.08, `rgba(${r},${g},${b},0.05)`);
        grad.addColorStop(0.18, `rgba(${r},${g},${b},0.15)`);
        grad.addColorStop(0.32, `rgba(${r},${g},${b},0.35)`);
        grad.addColorStop(0.52, `rgba(${r},${g},${b},1)`);
        grad.addColorStop(1,    `rgba(${r},${g},${b},1)`);
      } else {
        grad.addColorStop(0,    `rgba(${r},${g},${b},0.0)`);
        grad.addColorStop(0.15, `rgba(${r},${g},${b},0.05)`);
        grad.addColorStop(0.30, `rgba(${r},${g},${b},0.15)`);
        grad.addColorStop(0.50, `rgba(${r},${g},${b},0.40)`);
        grad.addColorStop(0.72, `rgba(${r},${g},${b},1)`);
        grad.addColorStop(1,    `rgba(${r},${g},${b},1)`);
      }

      ctx.fillStyle = grad;
      ctx.fillRect(x, y, BAR_W, barH);
    }
  };

  useEffect(() => {
    if (!cardRef.current) return;
    drawBars();
    const ro = new ResizeObserver(drawBars);
    ro.observe(cardRef.current);
    return () => ro.disconnect();
  }, [color]);

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 relative"
      style={{ height: "clamp(120px, 20vw, 160px)", minWidth: 0 }}
    >
      {/* Bars canvas */}
      <canvas
        ref={canvasRef}
        className="absolute bottom-0 left-0"
        style={{ display: "block" }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex items-start justify-between px-4 pt-4 pointer-events-none">
        <div className="flex flex-col justify-start min-w-0 flex-1 pr-2">
          <p className="font-semibold text-gray-700 truncate text-sm leading-snug">
            {title}
          </p>
          <p className="text-gray-400 truncate text-xs mt-1 leading-snug">
            {subtitle}
          </p>
        </div>
        <div className="font-bold text-gray-900 shrink-0 text-3xl sm:text-4xl leading-none">
          {value}
        </div>
      </div>
    </div>
  );
}

export function Badge({ status }) {
  const styles = {
    pending:   "bg-orange-50 text-orange-500 border border-orange-200",
    completed: "bg-green-50 text-green-600 border border-green-200",
    progress:  "bg-blue-50 text-blue-500 border border-blue-200",
  };

  const label =
    status === "progress"
      ? "In Progress"
      : status
      ? status[0].toUpperCase() + status.slice(1)
      : "Pending";

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
        styles[status] || styles.pending
      }`}
    >
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Modal
   - Mobile: slides up from bottom (sheet)
   - Desktop: centred dialog
───────────────────────────────────────────── */
export function Modal({ title, onClose, children }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md sm:mx-4 max-h-[92dvh] flex flex-col"
      >
        {/* Drag handle (mobile only) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-5 pt-4 sm:pt-5 pb-1 flex-shrink-0">
          {title && (
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pb-8 pt-3 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
