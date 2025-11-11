import React, { useState, useEffect } from "react";
import { BiSolidUserDetail } from "react-icons/bi";
import { releaseTicket, approveSurvey } from "../API/index.js";
import { domesticCategories, commercialCategories } from "../Data/Categories.js";

export default function ApprovalAction({ isOpen, onClose, row, onUpdateStatus }) {
  const [showModal, setShowModal] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [activeTab, setActiveTab] = useState("consumer");
  const [showReasonBox, setShowReasonBox] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1536);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1536);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCategoryLabel = (type, id) => {
    if (type === "domestic") {
      const found = domesticCategories.find((item) => Number(item.id) === Number(id));
      return found ? found.label : "N/A";
    } else if (type === "commercial") {
      const found = commercialCategories.find((item) => Number(item.id) === Number(id));
      return found ? found.label : "N/A";
    }
    return "N/A";
  };

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

  const surveyData = row.survey || {};
  const consumer = row.consumer || surveyData.consumer || {};
  const property = row.property || surveyData.property || {};
  const connection = row.connection || surveyData.connection || {};
  const survey_id = row.survey_id || surveyData.survey_id || "";
  const survey_status = row.survey_status || surveyData.survey_status || "";
  const survey_type = row.survey_type || surveyData.survey_type || "";
  const remarks = row.remarks || surveyData.remarks || "";

  const getImageUrl = (url) => {
    if (!url) return "";
    const fileName = url.split("/").pop();
    return `https://www.magneetarsolutions.com/${fileName}`;
  };

  const renderFields = (data, priorityOrder = [], excludeKeys = []) => {
    if (!data) return null;

    const orderedEntries = [
      ...priorityOrder
        .filter((key) => key in data && !excludeKeys.includes(key))
        .map((key) => [key, data[key]]),
      ...Object.entries(data).filter(
        ([key]) => !priorityOrder.includes(key) && !excludeKeys.includes(key)
      ),
    ];

    return orderedEntries
  .filter(([key, value]) => {
    if (
      (key === "domestic_category" && Number(value) === 0) ||
      (key === "commercial_category" && Number(value) === 0)
    ) {
      return false;
    }
    return true;
  })
  .map(([key, value]) => {
    let displayValue = value;

    if (key === "domestic_category") {
      const label = getCategoryLabel("domestic", value);
      displayValue = `${value} (${label})`;
    } else if (key === "commercial_category") {
      const label = getCategoryLabel("commercial", value);
      displayValue = `${value} (${label})`;
    }


      return (
        <div key={key}>
          <p className={`${isLargeScreen ? "text-lg" : "text-xs"} text-gray-500 capitalize`}>
  {key === "old_code"
    ? "Old Consumer Code"
    : key.replace(/_/g, " ")}
</p>
          <p
            className={`${isLargeScreen ? "text-xl" : "text-xs"} ${
              key === "domestic_category" || key === "commercial_category"
                ? "text-blue-600 font-semibold"
                : ""
            }`}
          >
            {displayValue !== null && displayValue !== "" ? String(displayValue) : "N/A"}
          </p>
        </div>
      );
    });
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

  const handleApprove = async () => {
  try {
    const result = await approveSurvey(survey_id);
    if (result.success) {
      onUpdateStatus(
        consumer.consumer_code,
        "Approved",
        null,
        result.data,
        "Ticket approved successfully!"
      );
      showToast("Ticket approved successfully!", "success");
      onClose();
    } else {
      showToast(result.error || "Failed to approve ticket.", "error");
    }
  } catch (err) {
    showToast("Unexpected error while approving ticket.", "error");
  }
};


  const handleImageClick = (url) => {
    setFullscreenImage(url);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-end transition-opacity duration-300 ease-in-out"
      onClick={onClose}
    >
      <div
        className={`bg-white w-full ${
          isLargeScreen ? "max-w-4xl" : "max-w-xl"
        } h-full overflow-y-auto px-5 transform transition-transform duration-300 ease-in-out ${
          animateIn ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex justify-between items-center px-2 py-3 border-b">
          <h2
            className={`font-semibold text-[#1e1e60] flex items-center gap-3 ${
              isLargeScreen ? "text-3xl" : "text-lg"
            }`}
          >
            <BiSolidUserDetail size={isLargeScreen ? 36 : 28} /> WASA Customer Details
          </h2>
          <button
            onClick={onClose}
            className={`text-gray-500 hover:text-gray-700 ${
              isLargeScreen ? "text-2xl" : "text-base"
            }`}
          >
            ✕
          </button>
        </div>

        <div
          className={`flex justify-around border-b px-4 py-3 font-medium bg-gray-50 mt-3 ${
            isLargeScreen ? "text-xl" : "text-sm"
          }`}
        >
          {["consumer", "property", "connection", "survey"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-4 rounded ${
                activeTab === tab ? "bg-blue-600 text-white" : "text-gray-700"
              } ${isLargeScreen ? "text-lg" : ""}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Info
            </button>
          ))}
        </div>

        {activeTab === "consumer" && (
          <div className={`p-4 grid grid-cols-3 gap-4 ${isLargeScreen ? "text-lg" : "text-xs"}`}>
            {renderFields(consumer, ["old_code", "full_name", "cnic", "phone", "email"])}
          </div>
        )}

        {activeTab === "property" && (
          <div className="p-4 space-y-6">
            <div
              className={`grid grid-cols-3 gap-4 ${isLargeScreen ? "text-lg" : "text-xs"}`}
            >
              {renderFields(property, ["address", "domestic_category", "commercial_category"], [
                "images",
                "consumer",
              ])}
            </div>

            {property.images && property.images.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {property.images.map((img, index) => (
                  <img
                    key={index}
                    src={getImageUrl(img)}
                    alt={`property-${index}`}
                    onClick={() => handleImageClick(getImageUrl(img))}
                    className="w-full h-40 object-cover rounded shadow cursor-pointer"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "connection" && (
          <div className={`p-4 grid grid-cols-3 gap-4 ${isLargeScreen ? "text-lg" : "text-xs"}`}>
            {renderFields(connection, [
              "connection_code",
              "connection_status",
              "meter_number",
              "created_at",
            ])}
          </div>
        )}

        {activeTab === "survey" && (
          <div className={`p-4 grid grid-cols-3 gap-4 ${isLargeScreen ? "text-lg" : "text-xs"}`}>
            <div>
              <p className="text-gray-500">Survey ID</p>
              <p>{survey_id || "-"}</p>
            </div>
            <div>
              <p className="text-gray-500">Survey Status</p>
              <p>{survey_status || "-"}</p>
            </div>
            <div>
              <p className="text-gray-500">Survey Type</p>
              <p>{survey_type || "-"}</p>
            </div>
            <div className="col-span-3">
              <p className="text-gray-500">Remarks</p>
              <p>{remarks || "-"}</p>
            </div>
          </div>
        )}

        {showReasonBox && (
          <div className="px-6 py-4 bg-red-50">
            <label
              className={`block font-medium mb-1 ${
                isLargeScreen ? "text-lg" : "text-xs"
              } text-red-800`}
            >
              Reason for Release Ticket
            </label>
            <textarea
              rows={3}
              className={`w-full border border-red-300 rounded px-3 py-2 focus:border-black focus:outline-none resize-none ${
                isLargeScreen ? "text-lg" : "text-xs"
              }`}
              placeholder="Enter reason here..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
        )}

        <div className="flex justify-between items-center px-6 py-4">
          <button
            onClick={handleRelease}
            className={`px-4 py-2 border rounded hover:bg-black hover:text-white text-gray-700 ${
              isLargeScreen ? "text-lg" : "text-xs"
            }`}
          >
            Release Ticket
          </button>
          <button
            onClick={handleApprove}
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-gray-800 ${
              isLargeScreen ? "text-lg" : "text-xs"
            }`}
          >
            Approve
          </button>
        </div>

        {popupMessage && (
          <div
            className={`fixed top-5 right-5 px-4 py-2 rounded shadow-md text-white transition-all duration-300 ${
              popupType === "success" ? "bg-green-500" : "bg-red-500"
            } ${isLargeScreen ? "text-lg" : "text-sm"}`}
          >
            {popupMessage}
          </div>
        )}

        {fullscreenImage && (
          <div
            className="fixed inset-0 z-[9999] bg-black bg-opacity-90 flex items-center justify-center"
            onClick={closeFullscreen}
          >
            <img
              src={fullscreenImage}
              alt="fullscreen"
              className="max-h-full max-w-full object-contain"
            />
            <button
              onClick={closeFullscreen}
              className="absolute top-5 right-5 text-white text-3xl"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
