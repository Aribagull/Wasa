import { useState, useEffect } from "react";
import TicketUserInfo from "./TicketUserInfo";
import { approveSurvey, closeTicket } from "../API/index.js";
import ChatBox from "./ChatBox.jsx";

export default function TicketModal({ ticket, onClose, onUpdate, allTickets = [] }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showReasonBox, setShowReasonBox] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [filter, setFilter] = useState("chat");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const authToken = localStorage.getItem("token");

  
  useEffect(() => {
    if (!showOverlay) {
      setFilter("chat");
    }
  }, [showOverlay]);

  const handleSend = () => {
    if (input.trim() === "") return;
    const newMessage = { role: "Admin", text: input, type: "new" };
    setChatMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const handleApprove = async () => {
    setLoading(true);
    setError("");

    try {
      const surveyId = ticket.survey_id;
      if (!surveyId) throw new Error("Survey ID not found");

      const surveyTickets = allTickets.filter((t) => t.survey_id === surveyId);
      console.log("Survey Tickets before closing:", surveyTickets);

      const results = await Promise.all(
        surveyTickets.map((t) => closeTicket(t.ticket_id))
      );
      console.log("Close ticket results:", results);

      const failed = results.find((r) => !r.success);
      if (failed) {
        setError(failed.error || "Failed to close some ticket.");
        return;
      }

      surveyTickets.forEach((t) => {
        onUpdate(t.ticket_id, "Approved");
      });

      const approveResult = await approveSurvey(surveyId);
      console.log("Approve response:", approveResult);

      if (!approveResult.success) {
        setError(approveResult.error || "Failed to approve survey.");
        return;
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => {
    if (!showReasonBox) {
      setShowReasonBox(true);
      return;
    }
    if (rejectionReason.trim() === "") return;
    onUpdate(ticket.survey_id, "Rejected", rejectionReason);
  };

  return (
    <div className="flex flex-col h-full">
    
      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-white w-[81%] h-[90vh] rounded-lg shadow-lg flex flex-col p-4 ">
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <h2 className="text-blue-600 font-semibold text-sm">
                {filter === "new"
                  ? "New Data"
                  : filter === "old"
                  ? "Old Data"
                  : "Split View"}
              </h2>
              <button
                onClick={() => setShowOverlay(false)} 
                className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                ← Back
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              <TicketUserInfo ticket={ticket} filter={filter} />
            </div>
          </div>
        </div>
      )}

      <div className="mb-2 bg-white p-4">
        <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
          <div>
            <span className="font-semibold text-sm text-red-600 uppercase">
              {ticket.issue || ticket.notes || "N/A"}
            </span>
          </div>
          <div>
            Ticket ID:
            <span className="font-semibold ml-1">
              {ticket.ticket_id || "N/A"}
            </span>
          </div>
        </div>

        <div className="text-sm text-gray-700 mb-2">
          Name:
          <span className="font-semibold ml-1">
            {ticket.temp_consumer?.full_name
              ? ticket.temp_consumer.full_name.charAt(0).toUpperCase() +
                ticket.temp_consumer.full_name.slice(1).toLowerCase()
              : "N/A"}
          </span>
        </div>

        <div className="text-sm text-gray-700 mb-2">
          Category:
          <span className="font-semibold ml-1">
            {ticket.temp_property?.category
              ? ticket.temp_property.category.charAt(0).toUpperCase() +
                ticket.temp_property.category.slice(1).toLowerCase()
              : "N/A"}
          </span>
        </div>

        <div className="text-sm text-gray-700 mb-3 flex items-center justify-between">
          <div>
            Status:
            <span className="font-semibold ml-1">
              {ticket.temp_property?.status
                ? ticket.temp_property.status.charAt(0).toUpperCase() +
                  ticket.temp_property.status.slice(1).toLowerCase()
                : "N/A"}
            </span>
          </div>
          <button
            onClick={handleApprove}
            disabled={loading}
            className={`text-xs px-4 py-2 rounded ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-transparent hover:text-black hover:border text-white"
            }`}
          >
            {loading ? "Approving..." : "Approve"}
          </button>
        </div>

        {error && <p className="text-red-500 text-xs">{error}</p>}

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

    
      {filter === "chat" && (
        <>
          <h3 className="text-sm font-semibold text-blue-600 pb-1">
            Chat Conversation With Surveyor
          </h3>
          <ChatBox
            ticketId={ticket.ticket_id}
            surveyId={ticket.survey_id}
            token={authToken}
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
            input={input}
            setInput={setInput}
            filter={filter}
            setFilter={(val) => {
              setFilter(val);
              if (val !== "chat") setShowOverlay(true); 
            }}
            issue={ticket.issue || ticket.notes}
            onClose={onClose}
          />
        </>
      )}
    </div>
  );
}
