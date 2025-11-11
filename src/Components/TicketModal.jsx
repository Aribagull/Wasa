import { useState, useEffect } from "react";
import TicketUserInfo from "./TicketUserInfo";
import { closeTicket } from "../API/index.js";
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
    if (!showOverlay) setFilter("chat");
  }, [showOverlay]);

  const handleApprove = async () => {
    setLoading(true);
    setError("");
    try {
      const surveyId = ticket.survey_id;
      if (!surveyId) throw new Error("Survey ID not found");

      const surveyTickets = allTickets.filter((t) => t.survey_id === surveyId);
      const results = await Promise.all(
        surveyTickets.map((t) => closeTicket(t.ticket_id))
      );

      const failed = results.find((r) => !r.success);
      if (failed) {
        setError(failed.error || "Failed to close some ticket.");
        return;
      }

      surveyTickets.forEach((t) => onUpdate(t.ticket_id, "Approved"));

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col h-full 2xl:h-screen 2xl:text-lg">
      {showOverlay && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowOverlay(false)}
        >
          <div
            className="bg-white w-[81%] h-[90vh] 2xl:h-[95vh] 2xl:w-4/5 rounded-lg shadow-lg flex flex-col p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <h2 className="text-sm 2xl:text-xl text-blue-600 font-semibold">
                {filter === "new" ? "New Data" : filter === "old" ? "Old Data" : "Split View"}
              </h2>
              <button
                onClick={() => setShowOverlay(false)}
                className="px-3 py-1 text-xs 2xl:text-lg bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
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

      <div className="mb-2 bg-white p-4 2xl:text-lg 2xl:min-h-[300px]">
        <div className="flex items-center justify-between text-gray-700 mb-2">
          <div>
            <span className="font-semibold text-sm 2xl:text-xl text-red-600 uppercase">
              {ticket.issue || ticket.notes || "N/A"}
            </span>
          </div>
          <div>
            Ticket ID:
            <span className="font-semibold ml-1 text-sm 2xl:text-lg">{ticket.ticket_id || "N/A"}</span>
          </div>
        </div>

        <div className="text-gray-700 mb-2">
          Name:
          <span className="font-semibold ml-1 text-sm 2xl:text-lg">
            {ticket.temp_consumer?.full_name
              ? ticket.temp_consumer.full_name.charAt(0).toUpperCase() +
                ticket.temp_consumer.full_name.slice(1).toLowerCase()
              : "N/A"}
          </span>
        </div>

        <div className="text-gray-700 mb-2">
          Category:
          <span className="font-semibold ml-1 text-sm 2xl:text-lg">
            {ticket.temp_property?.category
              ? ticket.temp_property.category.charAt(0).toUpperCase() +
                ticket.temp_property.category.slice(1).toLowerCase()
              : "N/A"}
          </span>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <div>
            Status:
            <span className="font-semibold ml-1 text-sm 2xl:text-lg text-gray-700">
              {ticket.temp_property?.status
                ? ticket.temp_property.status.charAt(0).toUpperCase() +
                  ticket.temp_property.status.slice(1).toLowerCase()
                : "N/A"}
            </span>
          </div>
          <button
            onClick={handleApprove}
            disabled={loading}
            className={`px-4 py-2 rounded ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-transparent hover:text-black hover:border text-white"} text-xs 2xl:text-lg`}
          >
            {loading ? "Approving..." : "Approve"}
          </button>
        </div>

        {error && <p className="text-red-500 text-xs 2xl:text-lg">{error}</p>}

        {showReasonBox && (
          <div className="mb-3">
            <textarea
              className="w-full border p-2 text-sm 2xl:text-lg rounded"
              placeholder="Type reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
        )}
      </div>

      {filter === "chat" && (
        <>
          <h3 className="text-sm 2xl:text-xl font-semibold text-blue-600 pb-1">
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