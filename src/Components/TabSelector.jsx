import React from "react";

export default function TabSelector({ filter, setFilter }) {
  const tabs = ["new", "old", "split"];

  return (
    <div className="flex justify-center mb-2">
      <div className="flex bg-blue-50 rounded-full overflow-hidden">
        {tabs.map((tab, index, arr) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-1.5 text-xs 2xl:text-lg transition-colors duration-200
              bg-transparent text-gray-600 hover:bg-blue-100
              ${index === 0 ? "rounded-l-full" : ""}
              ${index === arr.length - 1 ? "rounded-r-full" : ""}`}
          >
            {tab === "new"
              ? "New Data"
              : tab === "old"
              ? "Old Data"
              : "Split"}
          </button>
        ))}
      </div>
    </div>
  );
}
