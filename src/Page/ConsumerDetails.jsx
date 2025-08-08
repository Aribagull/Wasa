import React, { useState, useEffect } from "react";
import consumersData from "../Data/consumersData.js";
import ConsumerDetailCards from "./ConsumerCards.jsx";

export default function ConsumerDetails() {
  const [consumerId, setConsumerId] = useState("");
  const [selectedConsumer, setSelectedConsumer] = useState(null);

  useEffect(() => {
    if (consumersData.length > 0) {
      setSelectedConsumer(consumersData[0]);
    }
  }, []);

  const handleSearch = () => {
    const found = consumersData.find(
      (c) => c.consumerInfo.id.toLowerCase() === consumerId.toLowerCase()
    );

    if (found) {
      setSelectedConsumer(found);
    } else {
      setSelectedConsumer(null);
      alert("Consumer not found!");
    }
  };

  return (
    <div className="px-2 py-6 bg-[#F6F7FF]">
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-semibold text-[#1e1e60]">WASA Consumer Record</p>
        
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter Consumer ID"
            value={consumerId}
            onChange={(e) => setConsumerId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="rounded-md w-72 px-4 bg-white border border-gray-300 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
          />

          <button
            onClick={handleSearch}
            className="bg-blue-700 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-900 transition"
          >
            Search
          </button>
        </div>
      </div>

      <ConsumerDetailCards consumer={selectedConsumer} />
    </div>
  );
}
