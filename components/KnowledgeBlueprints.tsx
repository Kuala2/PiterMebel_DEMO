"use client";

import React from "react";

export function ElectricalBlueprint() {
  return (
    <div className="blueprint-wrapper">
      <svg
        viewBox="0 0 420 240"
        className="blueprint-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Grid */}
        <defs>
          <pattern id="grid-el" width="20" height="20" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="20" y2="0" stroke="rgba(255,255,255,0.035)" strokeWidth="0.8" />
            <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(255,255,255,0.035)" strokeWidth="0.8" />
          </pattern>
        </defs>

        <rect width="420" height="240" fill="#14171D" />
        <rect width="420" height="240" fill="url(#grid-el)" />

        {/* Technical Header Data (Placed on right to avoid overlapping top-left HTML badge) */}
        <text x="404" y="23" fill="#8C92A4" fontSize="9" fontFamily="monospace" letterSpacing="0.06em" textAnchor="end">
          ГОСТ Р 50571 · СИЛОВАЯ СЕТЬ
        </text>
        <text x="195" y="23" fill="#72C324" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
          ЧЕРТЕЖ 01
        </text>
        <line x1="16" y1="34" x2="404" y2="34" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* Floor Line (Чистовой пол) */}
        <line x1="36" y1="215" x2="295" y2="215" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x="180" y="228" fill="#8C92A4" fontSize="8.5" fontFamily="monospace">
          ±0.000 ЧИСТОВОЙ ПОЛ
        </text>

        {/* Lower Modules (Тумбы 860 мм) */}
        <rect x="58" y="145" width="112" height="70" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="rgba(255,255,255,0.02)" />
        <rect x="170" y="145" width="110" height="70" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="rgba(255,255,255,0.02)" />
        <line x1="58" y1="145" x2="280" y2="145" stroke="#FFFFFF" strokeWidth="2" />
        <text x="64" y="162" fill="rgba(255,255,255,0.5)" fontSize="8.5" fontFamily="sans-serif">
          [ СТОЛЕШНИЦА H=860 ]
        </text>

        {/* Backsplash / Tile Zone (Фартук) */}
        <rect x="58" y="85" width="222" height="60" stroke="rgba(114,195,36,0.2)" strokeWidth="1" strokeDasharray="2 2" fill="rgba(114,195,36,0.03)" />
        <text x="64" y="100" fill="#8C92A4" fontSize="8" fontFamily="monospace">
          ЗОНА ФАРТУКА (600 мм)
        </text>

        {/* Upper Modules (Навесные шкафы) */}
        <rect x="58" y="46" width="222" height="39" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="rgba(255,255,255,0.015)" />
        <text x="64" y="60" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="sans-serif">
          [ ВЕРХНИЕ МОДУЛИ 2150 ]
        </text>

        {/* Plinth Sockets (Цоколь: 50-70 мм) */}
        <g className="bp-point">
          <circle cx="95" cy="202" r="4.5" fill="#72C324" />
          <circle cx="95" cy="202" r="7.5" stroke="#72C324" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="95" y1="202" x2="95" y2="215" stroke="#72C324" strokeWidth="1" strokeDasharray="1 1" />
          <text x="106" y="205" fill="#72C324" fontSize="8" fontFamily="monospace" fontWeight="600">
            50 мм (ПММ / Духовка)
          </text>
        </g>

        {/* Apron Sockets (Фартук: 1050 мм) */}
        <g className="bp-point">
          <circle cx="155" cy="115" r="4" fill="#38BDF8" />
          <circle cx="169" cy="115" r="4" fill="#38BDF8" />
          <circle cx="183" cy="115" r="4" fill="#38BDF8" />
          <rect x="148" y="108" width="42" height="14" stroke="#38BDF8" strokeWidth="1" rx="0" fill="none" />
          <line x1="197" y1="115" x2="225" y2="115" stroke="#38BDF8" strokeWidth="1" />
          <text x="229" y="118" fill="#38BDF8" fontSize="8.5" fontFamily="monospace" fontWeight="600">
            1050 мм (Фартук)
          </text>
        </g>

        {/* Hood / Ventilation Socket (2100 мм) */}
        <g className="bp-point">
          <circle cx="180" cy="58" r="4" fill="#F59E0B" />
          <circle cx="180" cy="58" r="7" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="190" y1="58" x2="225" y2="58" stroke="#F59E0B" strokeWidth="1" />
          <text x="229" y="61" fill="#F59E0B" fontSize="8.5" fontFamily="monospace" fontWeight="600">
            2100 мм (Вытяжка)
          </text>
        </g>

        {/* Dimension Lines (Height Ruler on Left) */}
        <line x1="42" y1="46" x2="42" y2="215" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <line x1="38" y1="46" x2="46" y2="46" stroke="#FFFFFF" strokeWidth="1" />
        <line x1="38" y1="145" x2="46" y2="145" stroke="#FFFFFF" strokeWidth="1" />
        <line x1="38" y1="215" x2="46" y2="215" stroke="#FFFFFF" strokeWidth="1" />
        <text x="28" y="132" fill="#8C92A4" fontSize="7.5" fontFamily="monospace" transform="rotate(-90 28 132)">
          H=2150 мм
        </text>

        {/* Blueprint Stamp on Right (Above read-time tag) */}
        <rect x="295" y="135" width="109" height="46" stroke="rgba(255,255,255,0.14)" strokeWidth="1" fill="rgba(20,23,29,0.92)" />
        <text x="303" y="148" fill="#8C92A4" fontSize="7" fontFamily="monospace">ТЕХНОЛОГ: ВОЛКОВА</text>
        <text x="303" y="160" fill="#8C92A4" fontSize="7" fontFamily="monospace">УЗЕЛ: СИЛОВАЯ СЕТЬ</text>
        <text x="303" y="172" fill="#72C324" fontSize="8" fontFamily="monospace" fontWeight="bold">ПРОВЕРЕНО ✓</text>
      </svg>
    </div>
  );
}
