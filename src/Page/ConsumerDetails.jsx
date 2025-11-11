import React, { useState, useEffect } from "react";
import ConsumerDetailCards from "./ConsumerCards.jsx";
import { TbSearch } from "react-icons/tb";
import { FaUser } from "react-icons/fa";
import axios from "axios";

export default function ConsumerDetails() {
  const [consumerId, setConsumerId] = useState("");
  const [searchedConsumerId, setSearchedConsumerId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [wardFilter, setWardFilter] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [allConsumers, setAllConsumers] = useState([]);
  const [displayedConsumers, setDisplayedConsumers] = useState([]);
  const [selectedConsumer, setSelectedConsumer] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    async function fetchConsumers() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://magneetarsolutions.com/api/consumers",
          // {
          //   headers: token ? { Authorization: `Bearer ${token}` } : {},
          // }
        );
        setAllConsumers(response.data);
        setDisplayedConsumers(response.data);
      } catch (err) {
        console.error("Error fetching consumers:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user_id");
          localStorage.removeItem("user");
          window.location.href = "/";
        }
      }
    }
    fetchConsumers();
  }, []);

  const uniqueStatuses = [
    ...new Set(allConsumers.flatMap((c) => c.properties?.map((p) => p.status) || [])),
  ].filter(Boolean);

  const uniqueWards = [
    ...new Set(allConsumers.flatMap((c) => c.properties?.map((p) => p.ward) || [])),
  ].filter(Boolean);

  const uniqueZones = [
    ...new Set(allConsumers.flatMap((c) => c.properties?.map((p) => p.zone) || [])),
  ].filter(Boolean);

  useEffect(() => {
    let filtered = [...allConsumers];

    if (searchedConsumerId) {
      filtered = filtered.filter(
        (c) => c.consumer_id?.toLowerCase() === searchedConsumerId.toLowerCase()
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((c) =>
        c.properties?.some((p) => p.status === statusFilter)
      );
    }

    if (wardFilter) {
      filtered = filtered.filter((c) =>
        c.properties?.some((p) => String(p.ward) === wardFilter)
      );
    }

    if (zoneFilter) {
      filtered = filtered.filter((c) =>
        c.properties?.some((p) => p.zone === zoneFilter)
      );
    }

    setDisplayedConsumers(filtered);
    setSelectedConsumer(filtered.length === 1 ? filtered[0] : null);
  }, [allConsumers, statusFilter, wardFilter, zoneFilter, searchedConsumerId]);

  const handleSearch = () => {
    if (consumerId.trim() === "") {
      setSearchedConsumerId("");
      setSearched(false);
    } else {
      setSearchedConsumerId(consumerId.trim());
      setSearched(true);
    }
  };

  const handleCardClick = (consumer) => {
    setSelectedConsumer((prev) =>
      prev?.consumer_id === consumer.consumer_id ? null : consumer
    );
  };

  return (
    <div className="px-4 py-6 bg-[#F6F7FF] min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-semibold text-[#1e1e60] 2xl:text-2xl 3xl:text-3xl">
          WASA Consumer Record
        </p>

        <div className="flex items-center gap-2 2xl:gap-3 3xl:gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md px-3 py-2 2xl:px-4 2xl:py-3 3xl:px-5 3xl:py-4 border border-gray-300 bg-white text-sm 2xl:text-base 3xl:text-lg focus:outline-none focus:ring-1 focus:ring-blue-300"
          >
            <option value="">All Status</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="rounded-md px-3 py-2 2xl:px-4 2xl:py-3 3xl:px-5 3xl:py-4 border border-gray-300 bg-white text-sm 2xl:text-base 3xl:text-lg focus:outline-none focus:ring-1 focus:ring-blue-300"
          >
            <option value="">All Wards</option>
            {uniqueWards.map((ward) => (
              <option key={ward} value={ward}>
                {ward}
              </option>
            ))}
          </select>

          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="rounded-md px-3 py-2 2xl:px-4 2xl:py-3 3xl:px-5 3xl:py-4 border border-gray-300 bg-white text-sm 2xl:text-base 3xl:text-lg focus:outline-none focus:ring-1 focus:ring-blue-300"
          >
            <option value="">All Zones</option>
            {uniqueZones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Enter Consumer ID"
            value={consumerId}
            onChange={(e) => {
              setConsumerId(e.target.value);
              if (e.target.value === "") {
                setSearchedConsumerId("");
                setSearched(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && consumerId.trim()) {
                handleSearch();
              }
            }}
            className="rounded-md w-72 2xl:w-96 3xl:w-[26rem] px-4 2xl:px-5 3xl:px-6 py-2 2xl:py-3 3xl:py-4 bg-white border border-gray-300 text-sm 2xl:text-base 3xl:text-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <button
            onClick={handleSearch}
            disabled={!consumerId.trim()}
            className={`flex items-center px-4 2xl:px-5 3xl:px-6 py-2 2xl:py-3 3xl:py-4 rounded-md text-white bg-blue-500 hover:bg-blue-800 transition ${
              !consumerId.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <TbSearch className="w-4 h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {!searched && displayedConsumers.length === 0 ? (
          <div className="flex justify-center items-center mt-10">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
        ) : searched && displayedConsumers.length === 0 ? (
          <p className="text-red-500 text-lg flex justify-center">
            No consumer data found.
          </p>
        ) : (
          displayedConsumers.map((consumer) => (
            <div
              key={consumer.consumer_id || Math.random()}
              className="bg-white p-4 cursor-pointer transition"
            >
              <div
                className="flex items-center justify-between mb-3 mx-5"
                onClick={() => handleCardClick(consumer)}
              >
                <div className="flex items-center gap-3 2xl:gap-6 3xl:gap-8">
                  <div className="w-12 h-12 2xl:w-16 2xl:h-16 3xl:w-20 3xl:h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl 2xl:text-2xl 3xl:text-3xl">
                    <FaUser />
                  </div>
                  <div>
                    <p className="font-semibold text-base 2xl:text-xl 3xl:text-2xl">
                      {consumer.full_name || "N/A"}
                    </p>
                    <p className="text-gray-500 text-sm 2xl:text-base 3xl:text-lg">
                      ID:{" "}
                      <span className="font-semibold text-base 2xl:text-lg 3xl:text-xl">
                        {consumer.consumer_id || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {selectedConsumer?.consumer_id === consumer.consumer_id && (
                <ConsumerDetailCards consumer={selectedConsumer} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
