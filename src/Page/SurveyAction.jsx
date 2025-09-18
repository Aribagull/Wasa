import React, { useState, useEffect } from "react";
import { BiSolidUserDetail } from "react-icons/bi";
import { releaseTicket } from "../API/index.js";

export default function ApprovalAction({ isOpen, onClose, row, onUpdateStatus }) {
  const [showModal, setShowModal] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [activeTab, setActiveTab] = useState("consumer");
  const [showReasonBox, setShowReasonBox] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState(""); 

  useEffect(() => {
    if (isOpen && row) {
      setShowModal(true);
      setActiveTab("consumer");
      setTimeout(() => setAnimateIn(true), 20);
    } else {
      setAnimateIn(false);
      setTimeout(() => {
        setShowModal(false);
        setRejectionReason("");
        setShowReasonBox(false);
      }, 300);
    }
  }, [isOpen, row]);

  if (!showModal || !row) return null;

  const {
    consumer = {},
    property = {},
    connection = {},
    survey_status,
    survey_type,
    remarks,
    supervisor = {},
    surveyor = {},
  } = row;

  const survey_id = row.survey_id || row.survey?.survey_id;

  const renderFields = (data, priorityOrder = []) => {
    if (!data) return null;
    const orderedEntries = [
      ...priorityOrder.filter((key) => key in data).map((key) => [key, data[key]]),
      ...Object.entries(data).filter(([key]) => !priorityOrder.includes(key)),
    ];

    return orderedEntries.map(([key, value]) => (
      <div key={key}>
        <p className="text-gray-500 capitalize">{key.replace(/_/g, " ")}</p>
        <p>{String(value)}</p>
      </div>
    ));
  };

  const showToast = (message, type) => {
    setPopupMessage(message);
    setPopupType(type);
    setTimeout(() => setPopupMessage(""), 3000); 
  };

  const handleRelease = async () => {
    if (!showReasonBox) {
      setShowReasonBox(true);
      return;
    }
    if (!rejectionReason.trim()) {
      showToast("⚠️ Please enter a reason before releasing the ticket.", "error");
      return;
    }

    const result = await releaseTicket({
      surveyId: survey_id,
      notes: rejectionReason,
    });

    if (result.success) {
      onUpdateStatus(
        consumer.consumer_code,
        "Released",
        rejectionReason,
        result.data,
        "Ticket released successfully!"
      );
      showToast("Ticket released successfully!", "success");
      setRejectionReason("");
      setShowReasonBox(false);
      onClose();
    } else {
      showToast(result.error || "Failed to release ticket.", "error");
    }
  };

  const handleApprove = () => {
    onUpdateStatus(consumer.consumer_code, "Approved", null, null, "Ticket approved successfully!");
    showToast("Ticket approved successfully!", "success");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-end transition-opacity duration-300 ease-in-out"
      onClick={onClose}
    >
      <div
        className={`bg-white w-full max-w-xl h-full overflow-y-auto px-5 transform transition-transform duration-300 ease-in-out ${
          animateIn ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex justify-between items-center px-2 py-3 border-b">
          <h2 className="text-lg font-semibold text-[#1e1e60] flex items-center gap-3">
            <BiSolidUserDetail size={28} /> WASA Customer Details
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="flex items-center justify-between px-2 py-3 border-b">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-800">{consumer.full_name}</p>
              <p className="text-xs text-gray-500">{consumer.email}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">
              Category: <span className="ml-2 text-black">{property.category || ""}</span>
            </p>
            <p className="text-xs text-gray-500">
              Status: <span className="ml-8 text-black">{property.status || "N/A"}</span>
            </p>
          </div>
        </div>

        <div className="flex justify-around border-b px-4 py-3 text-sm font-medium bg-gray-50 mt-3">
          {["consumer", "property", "connection", "survey"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-4 rounded ${
                activeTab === tab ? "bg-blue-600 text-white" : "text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Info
            </button>
          ))}
        </div>

        {activeTab === "consumer" && (
          <div className="p-4 grid grid-cols-3 gap-4 text-xs">
            {renderFields(consumer, ["full_name", "email", "phone_number", "type"])}
          </div>
        )}
        {activeTab === "property" && (
          <div className="p-4 grid grid-cols-3 gap-4 text-xs">
            {renderFields(property, ["address", "city", "category", "status"])}
          </div>
        )}
        {activeTab === "connection" && (
          <div className="p-4 grid grid-cols-3 gap-4 text-xs">
            {renderFields(connection, ["connection_id", "connection_status", "created_at"])}
          </div>
        )}
        {activeTab === "survey" && (
          <div className="p-4 grid grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-gray-500">Survey ID</p>
              <p>{survey_id}</p>
            </div>
            <div>
              <p className="text-gray-500">Survey Status</p>
              <p>{survey_status}</p>
            </div>
            <div>
              <p className="text-gray-500">Survey Type</p>
              <p>{survey_type}</p>
            </div>
            <div className="col-span-3">
              <p className="text-gray-500">Remarks</p>
              <p>{remarks}</p>
            </div>
          </div>
        )}

        {showReasonBox && (
          <div className="px-6 py-4 bg-red-50">
            <label className="block text-xs font-medium text-red-800 mb-1">
              Reason for Release Ticket
            </label>
            <textarea
              rows={3}
              className="w-full border border-red-300 rounded px-3 py-2 text-xs focus:border-black focus:outline-none resize-none"
              placeholder="Enter reason here..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
        )}

        <div className="flex justify-between items-center px-6 py-4">
          <button
            onClick={handleRelease}
            className="px-4 py-2 border rounded hover:bg-black hover:text-white text-gray-700 text-xs"
          >
            Release Ticket
          </button>
          <button
            onClick={handleApprove}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-gray-800 text-xs"
          >
            Approve
          </button>
        </div>

        {popupMessage && (
          <div
            className={`fixed top-5 right-5 px-4 py-2 rounded shadow-md text-white text-sm transition-all duration-300
            ${popupType === "success" ? "bg-green-500" : "bg-red-500"}`}
          >
            {popupMessage}
          </div>
        )}
      </div>
    </div>
  );
}
