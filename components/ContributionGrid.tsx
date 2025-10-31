"use client"
import React, { useState, useEffect } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const shortMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getWeekday(year: number, month: number, day: number) {
  return new Date(year, month, day).getDay();
}

function getOrdinal(n: number) {
  if (n > 3 && n < 21) return n + "th";
  switch (n % 10) {
    case 1:
      return n + "st";
    case 2:
      return n + "nd";
    case 3:
      return n + "rd";
    default:
      return n + "th";
  }
}

function generateYearActivity(year: number) {
  const data: Record<string, boolean> = {};
  for (let m = 0; m < 12; m++) {
    const daysInMonth = getDaysInMonth(year, m);
    for (let d = 1; d <= daysInMonth; d++) {
      data[`${year}-${m + 1}-${d}`] = Math.random() > 0.6;
    }
  }
  return data;
}

export default function ContributionGrid() {
  const [isClient, setIsClient] = useState(false);
  const [currentYear, setCurrentYear] = useState(2025); // Default to avoid hydration mismatch
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState(2025); // Default year to prevent SSR mismatch
  const [activityData] = useState(() => generateYearActivity(2025)); // Use static year initially
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  // Initialize client-side values after hydration
  useEffect(() => {
    const year = new Date().getFullYear();
    setCurrentYear(year);
    setSelectedYear(year);
    setYears(Array.from({ length: year - 2019 }, (_, i) => 2020 + i));
    setIsClient(true);
  }, []);

  // Build a 7-row (Mon-Sun) x N-col (weeks in year) grid
  // Each cell: { day, monthIdx, year, isFiller }
  let grid: Array<
    Array<{ day: number | null; monthIdx: number | null; year: number | null }>
  > = Array.from({ length: 7 }, () => []);
  let monthColSpans: number[] = [];
  let colMonthIdx: number[] = [];
  let col = 0;
  for (let m = 0; m < 12; m++) {
    const daysInMonth = getDaysInMonth(selectedYear, m);
    const firstDayWeekday = (getWeekday(selectedYear, m, 1) + 6) % 7; // Mon=0
    let week = 0;
    let monthCols = 0;
    // Fillers before first day
    for (let i = 0; i < firstDayWeekday; i++) {
      grid[i].push({ day: null, monthIdx: m, year: selectedYear });
      colMonthIdx.push(m);
      monthCols++;
      col++;
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const weekday = (getWeekday(selectedYear, m, d) + 6) % 7;
      grid[weekday].push({ day: d, monthIdx: m, year: selectedYear });
      colMonthIdx.push(m);
      monthCols++;
      col++;
    }
    // Fillers after last day to complete the last week
    while (monthCols % 7 !== 0) {
      grid[monthCols % 7].push({ day: null, monthIdx: m, year: selectedYear });
      colMonthIdx.push(m);
      monthCols++;
      col++;
    }
    monthColSpans.push(Math.ceil(monthCols / 7));
  }
  // Calculate the number of columns (weeks) in the year
  const totalCols = Math.max(...grid.map((row) => row.length));

  // For month headers: find the start and end col for each month
  let monthHeaderSpans: { label: string; span: number }[] = [];
  let lastMonth = 0;
  let lastStart = 0;
  for (let c = 0; c <= colMonthIdx.length; c++) {
    if (c === colMonthIdx.length || colMonthIdx[c] !== lastMonth) {
      monthHeaderSpans.push({
        label: shortMonths[lastMonth],
        span: c - lastStart,
      });
      lastMonth = colMonthIdx[c];
      lastStart = c;
    }
  }

  // Don't render the grid until client-side hydration is complete to avoid SSR mismatch
  if (!isClient) {
    return (
      <div className="bg-background dark:text-white text-black rounded-lg p-6 w-full border border-gray-300 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold">My activity</span>
          <div className="flex items-center gap-2">
            <div className="bg-[#23263a] text-white px-3 py-1 rounded-lg text-sm">
              Loading...
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 py-8">
          Loading contribution grid...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background dark:text-white text-black rounded-lg p-6 w-full border border-gray-300 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-semibold">My activity</span>
        <div className="flex items-center gap-2">
          <select
            className="bg-[#23263a] text-white px-3 py-1 rounded-lg text-sm"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div
        className="overflow-x-auto scrollbar-custom"
      >
        <table className="table-fixed border-separate border-spacing-1 select-none">
          <thead>
            <tr>
              <th className="w-8"></th>
              {monthHeaderSpans.map((m, i) => (
                <th
                  key={i}
                  colSpan={m.span / 7}
                  className="text-gray-600 dark:text-[#fafafa]/70 text-xs font-medium text-center pb-2"
                >
                  {m.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((dayLabel, rowIdx) => (
              <tr key={dayLabel}>
                <td className="text-gray-600 dark:text-[#fafafa]/70 text-xs pr-2 text-right align-middle w-8">
                  {dayLabel}
                </td>
                {grid[rowIdx].map((cell, colIdx) => {
                  const isFiller = cell.day === null;
                  const dateStr =
                    cell.day && cell.monthIdx !== null && cell.year !== null
                      ? `${cell.year}-${cell.monthIdx + 1}-${cell.day}`
                      : null;
                  return (
                    <td key={colIdx} className="align-middle">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center transition-colors duration-150
                          ${isFiller
                            ? "bg-[#23263a] opacity-40 cursor-not-allowed"
                            : activityData[dateStr!]
                              ? "bg-[#22c55e] cursor-pointer-custom"
                              : "bg-[#374152] cursor-pointer-custom"
                          }`}
                        onMouseEnter={(e) => {
                          if (
                            !isFiller &&
                            cell.day &&
                            cell.monthIdx !== null &&
                            cell.year !== null
                          ) {
                            setTooltip({
                              x:
                                e.currentTarget.getBoundingClientRect().left +
                                20,
                              y:
                                e.currentTarget.getBoundingClientRect().top -
                                10,
                              text: `${getOrdinal(cell.day)} ${monthNames[cell.monthIdx!]
                                }, ${cell.year}`,
                            });
                          }
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        aria-disabled={isFiller}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 rounded bg-black text-white text-xs pointer-events-none shadow"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
