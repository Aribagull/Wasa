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

  const formatKey = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const renderKeyValue = (obj) => {
    return Object.entries(obj).map(([key, value]) => {
      // Show "N/A" for null, undefined, or empty string
      if (value === null || value === undefined || value === "") {
        return (
          <p key={key} className="text-sm 2xl:text-lg 3xl:text-xl text-gray-600">
            <span className="text-gray-800 2xl:text-lg 3xl:text-xl">{formatKey(key)}:</span>{" "}
            <span className="font-semibold 2xl:text-lg 3xl:text-xl">N/A</span>
          </p>
        );
      }

      // Render images if present
      // Render images if present
if (key === "images" && Array.isArray(value) && value.length > 0) {
  return (
    <div key={key} className="col-span-4 mt-2">
      <p className="text-gray-800 2xl:text-lg 3xl:text-xl mb-2">{formatKey(key)}:</p>
      <div className="grid grid-cols-3 gap-2">
        {value.map((img, idx) => {
          // Check if img already starts with "http" (full URL), else prepend domain
          const imgUrl = img.startsWith("http")
            ? img
            : `https://www.magneetarsolutions.com/${img}`;
          return (
            <img
              key={idx}
              src={imgUrl}
              alt={`property-img-${idx}`}
              className="w-full h-32 object-cover rounded shadow cursor-pointer"
            />
          );
        })}
      </div>
    </div>
  );
}


      // Skip nested objects/arrays except images
      if (Array.isArray(value) || typeof value === "object") return null;

      return (
        <p key={key} className="text-sm 2xl:text-lg 3xl:text-xl text-gray-600">
          <span className="text-gray-800 2xl:text-lg 3xl:text-xl">{formatKey(key)}:</span>{" "}
          <span className="font-semibold 2xl:text-lg 3xl:text-xl">{String(value)}</span>
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col gap-6 mt-1">
      {/* Consumer Info */}
      <div className="bg-white px-6 py-2">
        <div className="mt-6 grid grid-cols-4 gap-4 text-sm 2xl:text-lg 3xl:text-xl ml-5 text-gray-600">
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
                <p className="text-gray-800 2xl:text-lg 3xl:text-xl">{key.replace(/_/g, " ")}</p>
                <p className="font-semibold 2xl:text-lg 3xl:text-xl">{String(value) || "N/A"}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Properties */}
      {consumer.properties?.map((property, idx) => (
        <div key={idx} className="bg-white p-6 2xl:p-8 3xl:p-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md 2xl:text-xl 3xl:text-2xl font-semibold text-blue-600 flex items-center gap-2 uppercase">
              <FaHome /> Property {idx + 1}
            </h3>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4 text-sm 2xl:text-lg 3xl:text-xl">
            {renderKeyValue(property)}
          </div>

          {/* Connections */}
          <div className="mt-4">
            <h4 className="font-semibold text-blue-600 mb-2 text-sm 2xl:text-lg 3xl:text-xl flex items-center gap-2 uppercase">
              <FaPlug /> Connections
            </h4>
            {property.connections?.map((conn, cIdx) => {
              const key = `${idx}-${cIdx}`;
              return (
                <div key={cIdx} className="border rounded mb-2">
                  <button
                    className="w-full flex justify-between items-center px-4 2xl:px-6 3xl:px-8 py-2 2xl:py-3 3xl:py-4 bg-gray-50 text-sm 2xl:text-lg 3xl:text-xl font-medium text-gray-700"
                    onClick={() => toggleConnection(key)}
                  >
                    <span className="flex items-center gap-2">
                      <FaPlug /> Connection {cIdx + 1}
                    </span>
                    <span>
                      {openConnections.includes(key) ? (
                        <RiArrowDropUpLine className="text-xl 2xl:text-2xl 3xl:text-3xl" />
                      ) : (
                        <RiArrowDropDownLine className="text-xl 2xl:text-2xl 3xl:text-3xl" />
                      )}
                    </span>
                  </button>

                  {openConnections.includes(key) && (
                    <div className="p-4 grid grid-cols-4 gap-4 text-sm 2xl:text-lg 3xl:text-xl">
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
