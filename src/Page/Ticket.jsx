import React, { useEffect, useState } from "react";
import TicketModal from "../Components/TicketModal";

export default function TicketTabs() {
  const [allTickets, setAllTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("tickets");
    if (stored) {
      setAllTickets(JSON.parse(stored));
    }
  }, []);

  const openTickets = allTickets.filter(ticket => ticket.status === "Released");
  const closedTickets = allTickets.filter(ticket => ticket.status === "Approved");

   const handleUpdate = (id, status, reason, issue) => {
  const updated = allTickets.map(t =>
    t.id === id
      ? {
          ...t,
          status,
          ...(reason ? { releaseReason: reason } : {}),
          ...(issue ? { issue: issue } : {})
        }
      : t
  );

    setAllTickets(updated);
    localStorage.setItem("tickets", JSON.stringify(updated));
    setSelectedTicket(null);
  };

  return (
    <div className="py-4 px-4">
      {!selectedTicket ? (
        <>
     
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
            <h3 className="text-lg font-semibold text-blue-600">Open Tickets</h3>
            <h3 className="text-lg font-semibold text-green-600">Closed Tickets</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[510px] overflow-y-auto">
             
            <div className="bg-white p-4 rounded shadow custom-scrollbar">
              {openTickets.length === 0 ? (
                <p className="text-gray-500">No open tickets.</p>
              ) : (
                <div className="divide-y">
                  {openTickets.map((ticket, index) => (
                    <div key={index} className="px-2 py-3">
                      <h4 className="text-red-600 text-sm font-semibold">
                        {ticket.releaseReason || "No reason provided"}
                      </h4>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-700 text-sm">
                          Consumer ID: <span className="font-medium">{ticket.cid}</span>
                        </p>
                        <div className="flex gap-2">
                          <button
                            className="border text-xs border-gray-300 hover:bg-gray-100 text-black px-2 py-1 rounded"
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            Release Ticket
                          </button>
                          <button className="bg-blue-600 text-xs hover:bg-blue-800 text-white px-2 py-1 rounded">
                            Approve
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

      
            <div className="bg-white p-4 rounded shadow custom-scrollbar">
              {closedTickets.length === 0 ? (
                <p className="text-gray-500">No closed tickets.</p>
              ) : (
                <div className="divide-y">
                  {closedTickets.map((ticket, index) => (
                    <div key={index} className="bg-green-50 p-2 py-[15px]">
                      <h4 className="text-green-700 text-sm font-semibold">Ticket Approved</h4>
                      <p className="text-gray-700 text-sm">
                        Consumer ID: <span className="font-medium">{ticket.cid}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        
        <div className="">
          <button
            onClick={() => setSelectedTicket(null)}
            className="text-sm text-blue-600 underline mb-2"
          >
            ← Back to Tickets
          </button>

          <TicketModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            onUpdate={handleUpdate}
          />
        </div>
      )}
    </div>
  );
}
