import React, { useState, useEffect } from "react";
import { BiSolidUserDetail } from "react-icons/bi";

export default function ApprovalAction({ isOpen, onClose, row, onUpdateStatus }) {
  const [showModal, setShowModal] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [activeTab, setActiveTab] = useState("consumer");
  const [showReasonBox, setShowReasonBox] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      setTimeout(() => setAnimateIn(true), 20);
    } else {
      setAnimateIn(false);
      setTimeout(() => setShowModal(false), 300);
    }
  }, [isOpen]);

  if (!showModal || !row) return null;

  const { consumer, premiseDetails, connection_details, survey_data, images } = row;

  const handleRelease = async () => {
    if (!showReasonBox) {
      setShowReasonBox(true);
      return;
    }

    if (!rejectionReason.trim()) {
      alert("Please enter a reason before releasing the ticket.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken"); 

      const response = await fetch("https://magneetarsolutions.com/api/tickets/create_ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({
          survey_id: survey_data?.surveyor_id, 
          type: "correction",
          notes: rejectionReason,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to release ticket.");
      }

      const result = await response.json();
      alert("Ticket released successfully!");

      onUpdateStatus(consumer.consumer_code, "Released", rejectionReason);
      setRejectionReason("");
      setShowReasonBox(false);
      onClose(); 
    } catch (error) {
      console.error(error);
      alert("Error releasing ticket. Please try again.");
    }
  };

  const handleApprove = () => {
    onUpdateStatus(consumer.consumer_code, "Approved");
    onClose(); 
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-end transition-opacity duration-300 ease-in-out">
      <div
        className={`bg-white w-full max-w-lg h-full overflow-y-auto px-5 transform transition-transform duration-300 ease-in-out ${
          animateIn ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-2 py-3 border-b">
          <h2 className="text-lg font-semibold text-[#1e1e60] flex items-center gap-3">
            <BiSolidUserDetail size={28} /> WASA Customer Details
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="flex items-center justify-between px-2 py-3 border-b">
          <div className="flex items-center gap-4">
            <img
              src={consumer.profile_image || "https://via.placeholder.com/50"}
              alt="User"
              className="w-12 h-12 rounded-full border object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">{consumer.full_name}</p>
              <p className="text-xs text-gray-500">{consumer.email}</p>
              <p className="text-xs text-gray-500">{consumer.type || "Customer"}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">
              Category: <span className="ml-2 text-black">{premiseDetails.category || ""}</span>
            </p>
            <p className="text-xs text-gray-500">
              Status: <span className="ml-8 text-black">{premiseDetails.status || "N/A"}</span>
            </p>
          </div>
        </div>

        <div className="flex justify-around border-b px-4 py-3 text-sm font-medium bg-gray-50 mt-3">
          {["consumer", "property", "connection", "survey", "images"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded ${activeTab === tab ? "bg-blue-600 text-white" : "text-gray-700"}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Info
            </button>
          ))}
        </div>

        {activeTab === "consumer" && (
          <div className="p-4 grid grid-cols-3 gap-4 text-xs">
            <div><p className="text-gray-500">Consumer Code</p><p>{consumer.consumer_code}</p></div>
            <div><p className="text-gray-500">Full Name</p><p>{consumer.full_name}</p></div>
            <div><p className="text-gray-500">CNIC</p><p>{consumer.cnic}</p></div>
            <div><p className="text-gray-500">Phone</p><p>{consumer.phone}</p></div>
            <div><p className="text-gray-500">WhatsApp</p><p>{consumer.whatsapp}</p></div>
            <div><p className="text-gray-500">Email</p><p>{consumer.email}</p></div>
            <div><p className="text-gray-500">Address</p><p>{consumer.address}</p></div>
            <div><p className="text-gray-500">Registration Date</p><p>{consumer.registration_date}</p></div>
            <div><p className="text-gray-500">UC</p><p>{consumer.uc}</p></div>
            <div><p className="text-gray-500">Ward</p><p>{consumer.ward}</p></div>
            <div><p className="text-gray-500">Zone</p><p>{consumer.zone}</p></div>
            <div><p className="text-gray-500">WASA Employee</p><p>{consumer.wasa_employee ? "Yes" : "No"}</p></div>
            <div><p className="text-gray-500">Remarks</p><p>{consumer.remarks}</p></div>
          </div>
        )}

        {activeTab === "property" && (
          <div className="p-4 grid grid-cols-5 gap-4 text-xs">
            {Object.entries(premiseDetails).map(([key, value]) => (
              <div key={key}>
                <p className="text-gray-500 capitalize">{key.replace(/_/g, " ")}</p>
                <p>{String(value)}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "connection" && (
          <div className="p-4 grid grid-cols-3 gap-4 text-xs">
            {Object.entries(connection_details).map(([key, value]) => (
              <div key={key}>
                <p className="text-gray-500 capitalize">{key.replace(/_/g, " ")}</p>
                <p>{String(value)}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "survey" && (
          <div className="p-4 grid grid-cols-3 gap-4 text-xs">
            {Object.entries(survey_data).map(([key, value]) => (
              <div key={key}>
                <p className="text-gray-500 capitalize">{key.replace(/_/g, " ")}</p>
                <p>{String(value)}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "images" && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Uploaded Images</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {images.map((img) => (
                <div key={img.id} className="mb-4">
                  <img src={img.uri} alt={img.name} className="w-[250px] h-[180px] border rounded" />
                </div>
              ))}
            </div>
          </div>
        )}

        {showReasonBox && (
          <div className="px-6 py-4 bg-red-50">
            <label className="block text-xs font-medium text-red-800 mb-1">Reason for Release Ticket</label>
            <textarea
              rows={3}
              className="w-full border border-red-300 rounded px-3 py-2 text-xs focus:border-black focus:outline-none focus:ring-0 resize-none"
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
      </div>
    </div>
  );
}
