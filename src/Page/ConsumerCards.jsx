import React, { useState } from "react";
import { FaUser, FaHome, FaPlug } from "react-icons/fa";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

export default function ConsumerDetailCards({ consumer }) {
  const [openConnections, setOpenConnections] = useState([]);

  if (!consumer) return <p>No consumer data found.</p>;

  const toggleConnection = (key) => {
    setOpenConnections((prev) =>
      prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key]
    );
  };


  const formatKey = (key) => key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());


  const renderKeyValue = (obj) => {
    return Object.entries(obj).map(([key, value]) => {
      if (Array.isArray(value) || typeof value === "object" || value === null) return null; // skip nested
      return (
        <p key={key} className="text-sm text-gray-600">
          <span className="text-gray-800">{formatKey(key)}:</span>{" "}
          <p className="font-semibold">{String(value) || "N/A"}</p>
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col gap-6 mt-1">
 
      <div className="bg-white px-6 py-2">
  <div className="mt-6 grid grid-cols-4 gap-4 text-sm ml-5 text-gray-600">
    {Object.entries(consumer).map(([key, value]) => {
      if (
        typeof value === "object" ||
        Array.isArray(value) ||
        key === "full_name" ||
        key === "consumer_id" ||
        key === "properties"
      )
        return null;

      return (
        <div key={key}>
          <p className="text-gray-800">{key.replace(/_/g, " ")}</p>
          <p className="font-semibold">{String(value) || "N/A"}</p>
        </div>
      );
    })}
  </div>
</div>




      {consumer.properties?.map((property, idx) => (
        <div key={idx} className="bg-white p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-semibold text-blue-600 flex items-center gap-2 uppercase">
              <FaHome /> Property {idx + 1}
            </h3>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            {renderKeyValue(property)}
          </div>


          <div className="mt-4">
            <h4 className="font-semibold text-blue-600 mb-2 flex items-center gap-2 uppercase"><FaPlug />Connections</h4>
            {property.connections?.map((conn, cIdx) => {
              const key = `${idx}-${cIdx}`;
              return (
                <div key={cIdx} className="border rounded mb-2">
                  <button
                    className="w-full flex justify-between items-center px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700"
                    onClick={() => toggleConnection(key)}
                  >
                    <span className="flex items-center gap-2">
                      <FaPlug /> Connection {cIdx + 1}
                    </span>
                    <span>
  {openConnections.includes(key) ? (
    <RiArrowDropUpLine className="text-xl" />
  ) : (
    <RiArrowDropDownLine className="text-xl" />
  )}
</span>

                  </button>

                  {openConnections.includes(key) && (
                    <div className="p-4 grid grid-cols-4 gap-4 ">
                      {renderKeyValue(conn)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
