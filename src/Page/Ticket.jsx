import React, { useEffect, useState } from "react";
import TicketModal from "../Components/TicketModal";
import { getAllTickets, closeTicket } from "../API/index.js";

export default function TicketTabs() {
  const [allTickets, setAllTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeTab, setActiveTab] = useState("open");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await getAllTickets();
        if (response.success) {
          setAllTickets(response.data);
          setError(null);
        } else {
          setError(response.error);
        }
      } catch (err) {
        console.error("Error in TicketTabs:", err);
        setError("Failed to fetch tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);


  const closedTickets = allTickets
  .filter((t) => t.status?.toLowerCase() === "approved")
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

const openTickets = allTickets
  .filter((t) => t.status?.toLowerCase() === "open")
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));


  const handleUpdate = async (ticketId, status, reason, issue) => {
    if (status === "Approved") {
      const res = await closeTicket(ticketId);
      if (!res.success) {
        alert(res.error);
        return;
      }
    }


    const updated = allTickets.map((t) =>
      t.ticket_id === ticketId
        ? {
          ...t,
          status,
          ...(reason ? { releaseReason: reason } : {}),
          ...(issue ? { issue } : {}),
        }
        : t
    );
    setAllTickets(updated);
    setSelectedTicket(null);
  };

  return (
    <div className="py-4 px-4">
      <div className="flex gap-4 border-b mb-2">
        <div className="w-1/2 flex gap-4">
          <button
            className={`pb-2 text-sm ${activeTab === "open"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-gray-600"
              }`}
            onClick={() => setActiveTab("open")}
          >
            Open Tickets ({openTickets.length})
          </button>
          <button
            className={`pb-2 text-sm ${activeTab === "closed"
              ? "border-b-2 border-green-600 text-green-600 font-semibold"
              : "text-gray-600"
              }`}
            onClick={() => setActiveTab("closed")}
          >
            Closed Tickets ({closedTickets.length})
          </button>
        </div>

        <div className="w-1/2">
          <h2 className="pb-2 text-sm border-b-2 border-blue-600 text-blue-600 font-semibold inline-block">
            Ticket Details
          </h2>
        </div>
      </div>

      <div className="flex gap-4">

        <div className="bg-white p-4 h-[520px] overflow-y-auto custom-scrollbar w-1/2">
          {loading ? (
            <p className="text-gray-500">Loading tickets...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : activeTab === "open" ? (
            openTickets.length === 0 ? (
              <p className="text-gray-500">No open tickets.</p>
            ) : (
              <div className="divide-y">
                {openTickets.map((ticket) => (
                  <div key={ticket.ticket_id} className="px-2 py-3">
                    <h4 className="text-red-600 text-sm font-semibold uppercase">
                      {ticket.notes || "No reason provided"}
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Name:{" "}
                      <span className="font-medium">
                        {ticket.temp_consumer?.full_name ?? "N/A"}
                      </span>
                    </p>
                    <div className="flex items-center justify-between">



                      <p className="text-gray-700 text-sm">
                        Consumer ID:{" "}
                        <span className="font-medium">
                          {ticket.temp_consumer?.temp_consumer_id ?? "N/A"}
                        </span>
                      </p>
                      <div className="flex gap-2">
                        <button
                          className="border text-xs border-gray-300 hover:bg-gray-100 text-black px-2 py-1 rounded"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          View Ticket
                        </button>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : closedTickets.length === 0 ? (
            <p className="text-gray-500">No closed tickets.</p>
          ) : (
            <div className="divide-y">
              {closedTickets.map((ticket) => (
                <div
                  key={ticket.ticket_id}
                  className="bg-green-50 p-2 py-[15px]"
                >
                  <h4 className="text-green-700 text-sm font-semibold">
                    Ticket Approved
                  </h4>
                  <p className="text-gray-700 text-sm">
                      Name:{" "}
                      <span className="font-medium">
                        {ticket.temp_consumer?.full_name ?? "N/A"}
                      </span>
                    </p>
                  <p className="text-gray-700 text-sm">
                        Consumer ID:{" "}
                        <span className="font-medium">
                          {ticket.temp_consumer?.temp_consumer_id ?? "N/A"}
                        </span>
                      </p>
                </div>
              ))}
            </div>
          )}
        </div>


        <div className="w-1/2">
          {selectedTicket ? (
            <TicketModal
              ticket={selectedTicket}
              allTickets={allTickets}
              onClose={() => setSelectedTicket(null)}
              onUpdate={handleUpdate}
            />
          ) : (
            <div className="flex items-center justify-center text-gray-400 h-full">
              Select a ticket to see details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
