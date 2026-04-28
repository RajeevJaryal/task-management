import { useEffect, useRef } from "react";
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
          <p className="font-semibold text-gray-700 truncate text-[13px] leading-snug">
            {title}
          </p>
          <p className="text-gray-400 truncate text-[11px] mt-1 leading-snug">
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
