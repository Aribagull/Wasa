import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function TicketModal({ ticket, onClose, onUpdate }) {
  const oldMessages = [
    { role: "Admin", text: "Hello" },
    { role: "Surveyor", text: "Hi" },
    { role: "Surveyor", text: "Thank you" },
  ];

  const [chatMessages, setChatMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showReasonBox, setShowReasonBox] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    const newMessage = { role: "Admin", text: input };
    setChatMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const handleApprove = () => {
    onUpdate(ticket.id, "Approved");
  };

  const handleReject = () => {
    if (!showReasonBox) {
      setShowReasonBox(true);
      return;
    }
    if (rejectionReason.trim() === "") return;
    onUpdate(ticket.id, "Rejected", rejectionReason);
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-sm font-semibold pb-2 border-b">Ticket Details</h2>

      <div className="mb-2 bg-white mt-2 p-4">
        <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
          <div>
            <span className="font-semibold text-base text-[#1e1e60]">
              {ticket.issue || "N/A"}
            </span>
          </div>
          <div>
            Ticket ID:
            <span className="font-semibold ml-1">{ticket.id || "N/A"}</span>
          </div>
        </div>

        <div className="text-sm text-gray-700 mb-2">
          Name:
          <span className="font-semibold ml-1">
            {ticket.consumer?.full_name || "N/A"}
          </span>
        </div>

        <div className="text-sm text-gray-700 mb-2">
          Category:
          <span className="font-semibold ml-1">
            {ticket.premiseDetails?.category || "N/A"}
          </span>
        </div>

        <div className="text-sm text-gray-700 mb-3 flex items-center justify-between">
          <div>
            Status:
            <span className="font-semibold ml-1">
              {ticket.premiseDetails?.status || "N/A"}
            </span>
          </div>
          <button
            onClick={handleApprove}
            className="text-xs bg-black text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Approve
          </button>
        </div>

        {showReasonBox && (
          <div className="mb-3">
            <textarea
              className="w-full border p-2 text-sm rounded"
              placeholder="Type reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
        )}
      </div>

      <h3 className="text-sm font-semibold text-blue-600 pb-1">
        Chat Conversation With Surveyor
      </h3>

      <div className="flex-1 mt-2 flex gap-4">

        <div className="w-1/2 bg-white p-4 h-[300px] overflow-y-auto custom-scrollbar">
          <h4 className="text-xs font-semibold mb-3 text-gray-600 border-b pb-1">
            Old Messages
          </h4>
          <div className="space-y-2 text-xs text-gray-700">
            {oldMessages.map((msg, index) => {
              const isAdmin = msg.role === "Admin";
              return (
                <div
                  key={index}
                  className={`flex items-start gap-2 ${isAdmin ? "justify-end" : "justify-start"
                    }`}
                >
                  {!isAdmin && (
                    <FaUserCircle size={20} className="text-gray-500" />
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg text-xs max-w-xs ${isAdmin
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                      }`}
                  >
                    {msg.text}
                  </div>
                  {isAdmin && (
                    <FaUserCircle size={20} className="text-blue-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>


        <div className="w-1/2 flex bg-white flex-col justify-between h-[300px] custom-scrollbar">
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            {chatMessages.map((msg, index) => {
              const isAdmin = msg.role === "Admin";
              return (
                <div
                  key={index}
                  className={`flex items-start gap-2 ${isAdmin ? "justify-end" : "justify-start"
                    }`}
                >
                  {!isAdmin && (
                    <FaUserCircle size={20} className="text-gray-500" />
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg text-xs max-w-xs ${isAdmin
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800"
                      }`}
                  >
                    {msg.text}
                  </div>
                  {isAdmin && (
                    <FaUserCircle size={20} className="text-blue-500" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
                  }
                }}
                className="border rounded px-3 py-2 text-sm w-full mr-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
              >
                ➤
              </button>
            </div>

            <div className="mt-2 text-right">
              <button
                onClick={onClose}
                className="text-sm text-gray-500 hover:text-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
