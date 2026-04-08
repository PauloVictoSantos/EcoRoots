import { useState, useEffect, useCallback } from "react";

/*
 * CULTIVO SMART — Frontal Greenhouse
 * ─ Plant GROWTH animation (seedling → full size)
 * ─ Dark/Light robust detection
 * ─ No text labels
 */

const themes = {
  dark: {
    bg: "#0a0a0a",
    wood1: "#8B6914", wood2: "#6e5215", wood3: "#4a3810", woodEdge: "#3d2e0c", woodHi: "#a07830",
    steel: "#3a3f4d", steelLt: "#555d6e", steelDk: "#282d38",
    glass: "rgba(100,190,255,0.04)", glassBrd: "rgba(100,190,255,0.1)", glassRef: "rgba(255,255,255,0.035)",
    water: "#1565c0", waterLt: "#42a5f5", waterSfc: "rgba(66,165,245,0.15)",
    chan: "#b8bcc6", chanW: "rgba(66,165,245,0.25)",
    lampBar: "#1a1028", lampLed: "#e879f9", lampGlow: "rgba(200,60,220,0.12)",
    green: ["#4ade80", "#34d399", "#22c55e", "#16a34a", "#15803d", "#166534"],
    stem: "#16a34a", pot: "#1e293b", shadow: "rgba(0,0,0,0.15)",
    pump: "#1a1a2e", pcb: "#0d6e3f", bubble: "#7dd3fc", screw: "#555",
  },
  light: {
    bg: "#EDFFED",
    wood1: "#c49440", wood2: "#a07830", wood3: "#8a6828", woodEdge: "#7a5c20", woodHi: "#dab060",
    steel: "#6b7280", steelLt: "#9ca3af", steelDk: "#4b5563",
    glass: "rgba(100,180,255,0.05)", glassBrd: "rgba(60,130,200,0.18)", glassRef: "rgba(255,255,255,0.25)",
    water: "#2563eb", waterLt: "#60a5fa", waterSfc: "rgba(96,165,250,0.1)",
    chan: "#e2e5ea", chanW: "rgba(96,165,250,0.18)",
    lampBar: "#4a3068", lampLed: "#d946ef", lampGlow: "rgba(200,60,220,0.06)",
    green: ["#4ade80", "#34d399", "#22c55e", "#16a34a", "#15803d", "#166534"],
    stem: "#16a34a", pot: "#94a3b8", shadow: "rgba(0,0,0,0.04)",
    pump: "#475569", pcb: "#15803d", bubble: "#93c5fd", screw: "#9ca3af",
  },
};

function useThemeDetect(modeProp) {
  const detect = useCallback(() => {
    if (modeProp) return modeProp;
    const html = document.documentElement;
    const body = document.body;
    if (html.classList.contains("dark") || body.classList.contains("dark")) return "dark";
    if (html.classList.contains("light") || body.classList.contains("light")) return "light";
    const dt = html.getAttribute("data-theme") || body.getAttribute("data-theme") || "";
    if (dt === "dark") return "dark";
    if (dt === "light") return "light";
    const dm = html.getAttribute("data-mode") || body.getAttribute("data-mode") || "";
    if (dm === "dark") return "dark";
    if (dm === "light") return "light";
    const cs = getComputedStyle(html).colorScheme;
    if (cs === "dark") return "dark";
    if (cs === "light") return "light";
    const bgc = getComputedStyle(body).backgroundColor;
    if (bgc) {
      const m = bgc.match(/\d+/g);
      if (m && m.length >= 3) {
        const br = (parseInt(m[0]) * 299 + parseInt(m[1]) * 587 + parseInt(m[2]) * 114) / 1000;
        return br < 128 ? "dark" : "light";
      }
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }, [modeProp]);

  const [mode, setMode] = useState("dark");

  useEffect(() => {
    setMode(detect());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const h = () => setMode(detect());
    mq.addEventListener("change", h);
    const obs = new MutationObserver(() => setMode(detect()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme", "data-mode", "style"] });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class", "data-theme", "data-mode", "style"] });
    const poll = setInterval(() => setMode(detect()), 500);
    return () => { mq.removeEventListener("change", h); obs.disconnect(); clearInterval(poll); };
  }, [detect]);

  return mode;
}

// ─── Growth curve: 0→1 over CYCLE_DURATION, each plant staggered ───
const CYCLE_MS = 22000; // Full growth cycle
const PAUSE_MS = 4000;  // Pause at full size before reset
const TOTAL_MS = CYCLE_MS + PAUSE_MS;

function getGrowth(tick, plantIndex) {
  // Each plant starts growth staggered by 400ms
  const offset = plantIndex * 400;
  const t = ((tick * 80 + offset) % TOTAL_MS) / CYCLE_MS;
  if (t >= 1) return 1; // In pause phase
  // Ease-out cubic for natural growth feel
  const p = Math.min(t, 1);
  return 1 - Math.pow(1 - p, 3);
}

export default function GreenhouseFront({ mode: modeProp }) {
  const [tick, setTick] = useState(0);
  const [camCol, setCamCol] = useState(0);
  const [camRow, setCamRow] = useState(0);
  const [flash, setFlash] = useState(false);
  const sysMode = useThemeDetect(modeProp);
  const T = themes[sysMode];

  useEffect(() => {
    const i = setInterval(() => setTick(t => t + 1), 80);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      setCamCol(prev => {
        const next = prev + 1;
        if (next >= 8) {
          setFlash(true); setTimeout(() => setFlash(false), 140);
          setCamRow(r => (r + 1) % 3);
          return 0;
        }
        if (next % 3 === 0) { setFlash(true); setTimeout(() => setFlash(false), 100); }
        return next;
      });
    }, 1100);
    return () => clearInterval(i);
  }, []);

  const sin = (o = 0, s = 1) => Math.sin(tick * 0.02 * s + o);
  const pulse = (s = 1) => 0.6 + 0.4 * Math.sin(tick * 0.018 * s);

  const L = 80, R = 720, TOP = 50, BOT = 460;
  const FW = R - L;
  const WOOD_H = 60;
  const GT = TOP + 22, GB = BOT - WOOD_H, GH = GB - GT;
  const WT = GB + 8, WB = BOT - 8;
  const PB = GB - 16, LY = GT + 38, RY = GT + 16;
  const pX = (col) => L + 60 + col * ((FW - 120) / 7);

  return (
    <div style={{ width: "100%", maxWidth: 920, margin: "0 auto", position: "relative" }}>
      <svg viewBox="0 0 800 480" style={{ width: "100%", display: "block" }}>
        <defs>
          <linearGradient id="wdG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.woodHi} /><stop offset="30%" stopColor={T.wood1} /><stop offset="100%" stopColor={T.wood3} /></linearGradient>
          <linearGradient id="wtG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.waterLt} stopOpacity="0.4" /><stop offset="100%" stopColor={T.water} stopOpacity="0.22" /></linearGradient>
          <linearGradient id="lG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#a21caf" /><stop offset="50%" stopColor="#e879f9" /><stop offset="100%" stopColor="#a21caf" /></linearGradient>
          <radialGradient id="lH"><stop offset="0%" stopColor={T.lampLed} stopOpacity="0.22" /><stop offset="100%" stopColor={T.lampLed} stopOpacity="0" /></radialGradient>
          <radialGradient id="sG"><stop offset="0%" stopColor={T.lampLed} stopOpacity="0.08" /><stop offset="100%" stopColor="transparent" /></radialGradient>
          <radialGradient id="fG"><stop offset="0%" stopColor="#fff" stopOpacity="0.85" /><stop offset="100%" stopColor="#fff" stopOpacity="0" /></radialGradient>
          <filter id="g1"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="ds"><feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity={sysMode === "dark" ? "0.35" : "0.08"} /></filter>
          <pattern id="wPat" width="200" height="5" patternUnits="userSpaceOnUse"><line x1="0" y1="2.5" x2="200" y2="2.5" stroke={T.woodEdge} strokeWidth="0.6" opacity="0.25" /></pattern>
        </defs>

        <rect width="800" height="480" fill={T.bg} rx="12" />

        {/* WOOD BASE */}
        <g filter="url(#ds)">
          <rect x={L} y={BOT - WOOD_H} width={FW} height={WOOD_H} rx="3" fill="url(#wdG)" />
          <rect x={L} y={BOT - WOOD_H} width={FW} height={WOOD_H} rx="3" fill="url(#wPat)" />
          <rect x={L} y={BOT - WOOD_H - 5} width={FW} height="7" rx="2" fill={T.woodHi} opacity="0.65" />
          <rect x={L} y={BOT - 3} width={FW} height="3" rx="1" fill={T.woodEdge} />
          {[0.25, 0.5, 0.75].map(t => <line key={t} x1={L + FW * t} y1={BOT - WOOD_H + 3} x2={L + FW * t} y2={BOT - 3} stroke={T.woodEdge} strokeWidth="0.5" opacity="0.25" />)}
          {[L + 8, R - 8].map((x, i) => <g key={i}><rect x={x - 4} y={BOT - WOOD_H - 1} width="8" height="7" rx="1.5" fill={T.steel} /><circle cx={x} cy={BOT - WOOD_H + 2.5} r="1.5" fill={T.screw} /></g>)}
        </g>



        {/* STEEL FRAME */}
        <g>
          {[L, R].map((x, i) => <rect key={i} x={x - 4} y={GT - 6} width="8" height={GH + 14} rx="2" fill={T.steel} />)}
          <rect x={L - 2} y={GT - 9} width={FW + 4} height="8" rx="2.5" fill={T.steel} />
          <rect x={L - 2} y={GB} width={FW + 4} height="6" rx="2" fill={T.steel} />
          <rect x={L} y={GT + GH * 0.5} width={FW} height="3.5" rx="1" fill={T.steelDk} opacity="0.55" />
          <rect x={L} y={GT - 13} width={FW} height="5" rx="1.5" fill={T.steelLt} opacity="0.35" />
          {[L + 1, R - 1].map(x => [GT, GB - 1].map(y => <g key={`${x}${y}`}><circle cx={x} cy={y} r="3" fill={T.steelDk} /><circle cx={x} cy={y} r="1.3" fill={T.screw} /></g>))}
        </g>

        {/* GLASS */}
        <rect x={L + 5} y={GT} width={FW - 10} height={GH} rx="2" fill={T.glass} stroke={T.glassBrd} strokeWidth="0.7" />
        <line x1={L + 22} y1={GT + 15} x2={L + 22} y2={GB - 15} stroke={T.glassRef} strokeWidth="3" />
        <line x1={L + 30} y1={GT + 28} x2={L + 30} y2={GB - 35} stroke={T.glassRef} strokeWidth="1.5" />
        <line x1={R - 32} y1={GT + 40} x2={R - 32} y2={GB - 22} stroke={T.glassRef} strokeWidth="1" opacity="0.5" />

        {/* NFT CHANNELS */}
        {[0, 1, 2].map(r => {
          const cy = PB - r * 4;
          return <g key={r}><rect x={L + 35} y={cy - 5} width={FW - 70} height="9" rx="3.5" fill={T.chan} opacity={0.85 - r * 0.12} /><rect x={L + 37} y={cy - 2} width={FW - 74} height="5" rx="2" fill={T.chanW} opacity={0.35 + sin(r, 0.3) * 0.07} /></g>;
        })}

        {/* LAMP GLOW */}
        <ellipse cx={L + FW / 2} cy={PB - 60} rx={FW * 0.38} ry="65" fill="url(#lH)" opacity={0.3 + pulse(0.6) * 0.12} />
        {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={pX(i)} cy={PB - 40} rx="28" ry="40" fill="url(#sG)" opacity={0.45 + pulse(0.7 + i * 0.1) * 0.3} />)}

        {/* ══════ PLANTS WITH GROWTH ANIMATION ══════ */}
        <g>
          {[0, 1, 2].map(row =>
            Array.from({ length: 8 }, (_, col) => {
              const x = pX(col);
              const y = PB - 3 - row * 4;
              const plantIdx = row * 8 + col;

              // Growth: 0 (seed) → 1 (full size), staggered per plant
              const growth = getGrowth(tick, plantIdx);
              // Min scale 0.15 (tiny seed), max 1.1
              const sc = 0.15 + growth * 0.95 + Math.sin(row * 2.7 + col * 1.3) * 0.1 * growth;
              const sway = sin(col * 0.3 + row * 0.5, 0.3) * 0.8 * growth;
              const g = T.green;
              // Number of leaves grows with plant
              const leafCount = Math.max(1, Math.floor(growth * (row === 1 ? 6 : row === 2 ? 4 : 3)));
              // Opacity increases as plant grows
              const leafOp = 0.4 + growth * 0.45;

              return (
                <g key={`${row}${col}`} transform={`translate(${x + sway}, ${y})`}>
                  {/* Purple tint */}
                  <ellipse cx="0" cy={-18 * sc} rx={12 * sc} ry={9 * sc} fill={T.lampLed} opacity={(0.02 + pulse(0.6) * 0.01) * growth} />
                  {/* Shadow grows */}
                  <ellipse cx="0.5" cy="4" rx={3 + 4 * growth} ry={1 + growth} fill={T.shadow} />
                  {/* Netpot */}
                  <rect x={-5} y="-2" width="10" height="5" rx="2.5" fill={T.pot} />

                  {/* Seed dot (visible when small) */}
                  {growth < 0.3 && (
                    <circle cx="0" cy={-3} r={2 + growth * 3} fill={g[1]} opacity={0.9 - growth * 2} />
                  )}

                  {row === 0 && growth > 0.08 && /* Alface */ (
                    <g opacity={leafOp}>
                      <line x1="0" y1="-2" x2={sway * 0.15} y2={-15 * sc} stroke={T.stem} strokeWidth={Math.max(0.5, 1.6 * sc)} strokeLinecap="round" />
                      {Array.from({ length: leafCount }, (_, lx) => {
                        const offset = lx - Math.floor(leafCount / 2);
                        return (
                          <ellipse key={lx} cx={offset * 6 * sc} cy={-15 * sc - Math.abs(offset) * 2 * sc}
                            rx={8 * sc} ry={6.5 * sc} fill={g[lx % 2 === 0 ? 0 : 1]} opacity={leafOp}>
                            <animate attributeName="ry" values={`${5.8 * sc};${7 * sc};${5.8 * sc}`} dur={`${5.5 + col * 0.3}s`} repeatCount="indefinite" />
                          </ellipse>
                        );
                      })}
                      {growth > 0.6 && <ellipse cx="0" cy={-19 * sc} rx={5.5 * sc} ry={4.2 * sc} fill={g[1]} opacity={0.3 * growth} />}
                    </g>
                  )}

                  {row === 1 && growth > 0.08 && /* Rúcula */ (
                    <g opacity={leafOp}>
                      {Array.from({ length: leafCount }, (_, l) => {
                        const a = -30 + l * (60 / Math.max(1, leafCount - 1));
                        const h = (10 + l * 1.8) * sc;
                        return (
                          <g key={l} transform={`rotate(${a + sin(col + l, 0.25) * 0.8 * growth})`}>
                            <line x1="0" y1="-2" x2="0" y2={-h} stroke={T.stem} strokeWidth={Math.max(0.3, 1 * sc)} strokeLinecap="round" />
                            <ellipse cx="0" cy={-h - 2.5 * sc} rx={2.5 * sc} ry={5 * sc} fill={g[2]} opacity={leafOp} />
                          </g>
                        );
                      })}
                    </g>
                  )}

                  {row === 2 && growth > 0.08 && /* Manjericão */ (
                    <g opacity={leafOp}>
                      <line x1="0" y1="-2" x2={sway * 0.1} y2={-18 * sc} stroke={g[4]} strokeWidth={Math.max(0.6, 2.2 * sc)} strokeLinecap="round" />
                      {Array.from({ length: leafCount }, (_, p) => (
                        <g key={p}>
                          <ellipse cx={-5 * sc} cy={-4 - p * 4 * sc} rx={4 * sc} ry={3 * sc}
                            fill={g[3]} opacity={leafOp} transform={`rotate(-10, ${-5 * sc}, ${-4 - p * 4 * sc})`} />
                          <ellipse cx={5 * sc} cy={-4 - p * 4 * sc} rx={4 * sc} ry={3 * sc}
                            fill={g[3]} opacity={leafOp} transform={`rotate(10, ${5 * sc}, ${-4 - p * 4 * sc})`} />
                        </g>
                      ))}
                      {growth > 0.5 && <circle cx="0" cy={-20 * sc} r={3 * sc} fill={g[2]} opacity={growth * 0.8} />}
                    </g>
                  )}
                </g>
              );
            })
          )}
        </g>

        {/* 2 GROW LAMPS */}
        {[LY, LY + 24].map((ly, li) => (
          <g key={li}>
            <rect x={L + 45} y={ly - 4.5} width={FW - 90} height="9" rx="3.5" fill={T.lampBar} />
            <rect x={L + 50} y={ly - 2} width={FW - 100} height="4" rx="2" fill="url(#lG)" filter="url(#g1)" opacity={0.45 + pulse(0.8 + li * 0.2) * 0.55} />
            {Array.from({ length: 12 }, (_, i) => {
              const lx = L + 60 + i * ((FW - 120) / 11);
              return <circle key={i} cx={lx} cy={ly} r="2.2" fill={T.lampLed} opacity={0.3 + pulse(0.7 + i * 0.12) * 0.7} filter="url(#g1)" />;
            })}
            {[L + 55, L + FW / 2, R - 55].map((bx, bi) => <rect key={bi} x={bx - 2} y={ly - 13} width="4" height="10" rx="1" fill={T.steel} opacity="0.45" />)}
          </g>
        ))}

        {/* CAMERA XY RAIL */}
        <g>
          <rect x={L + 30} y={RY - 1.5} width={FW - 60} height="3" rx="1.5" fill={T.steelLt} opacity="0.45" />
          {(() => {
            const cx = pX(camCol);
            return <g>
              <rect x={cx - 5.5} y={RY - 3.5} width="11" height="6" rx="2" fill={T.steelDk} />
              <line x1={cx} y1={RY + 2.5} x2={cx} y2={RY + 18} stroke={T.steelDk} strokeWidth="1.8" />
              <rect x={cx - 5.5} y={RY + 16} width="11" height="7.5" rx="2" fill="#0a0a0a" stroke="#333" strokeWidth="0.4" />
              <circle cx={cx} cy={RY + 24} r="3.2" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="0.6" />
              <circle cx={cx} cy={RY + 24} r="1.5" fill={flash ? "#fff" : "#38bdf8"} opacity={flash ? 1 : 0.4} />
              {flash && <circle cx={cx} cy={RY + 24} r="22" fill="url(#fG)" opacity="0.5"><animate attributeName="r" values="8;25;8" dur="0.15s" /></circle>}
              <circle cx={cx + 4} cy={RY + 17.5} r="1" fill="#22c55e"><animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" /></circle>
            </g>;
          })()}
        </g>

      </svg>
    </div>
  );
}