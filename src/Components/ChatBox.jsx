import { useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { getMessages, postMessage } from "../API/index.js";
import TabSelector from "./TabSelector.jsx";

export default function ChatBox({
  ticketId,
  surveyId,
  token,
  chatMessages,
  setChatMessages,
  input,
  setInput,
  onClose,
  filter,
  setFilter,
  issue,
}) {
  const loginUserId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!surveyId) return;
    const fetchMessages = async () => {
      try {
        const res = await getMessages(ticketId, token, surveyId);
        if (res?.success && res?.data) {
          const formatted = res.data.map((msg) => ({
            ...msg,
            text: msg.message,
            isMine: msg.sender?.user_id?.toString() === loginUserId?.toString(),
          }));
          setChatMessages(formatted);

          if (issue && !formatted.some((m) => m.text.includes(issue))) {
            await postMessage(ticketId, `Ticket Issue: ${issue}`, token);
            setChatMessages((prev) => [
              ...prev,
              { text: `Ticket Issue: ${issue}`, isMine: true },
            ]);
          }
        }
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 20000);
    return () => clearInterval(interval);
  }, [ticketId, token, loginUserId, issue, setChatMessages, surveyId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      const res = await postMessage(ticketId, input, token);
      if (res?.success) {
        const newMessage = {
          text: input,
          sender: { user_id: loginUserId },
          isMine: true,
        };
        setChatMessages((prev) => [...prev, newMessage]);
        setInput("");
      }
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <div className="flex flex-col bg-white h-[375px] 2xl:h-[770px] 2xl:text-lg">
      <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${msg.isMine ? "justify-end" : "justify-start"}`}
          >
            {!msg.isMine && <FaUserCircle size={22} className="text-gray-500 mt-1" />}

            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] break-words text-sm 2xl:text-lg
                ${msg.isMine ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}
            >
              {msg.text}
            </div>

            {msg.isMine && <FaUserCircle size={22} className="text-blue-500 mt-1" />}
          </div>
        ))}
      </div>

      <TabSelector filter={filter} setFilter={setFilter} surveyId={surveyId} />

      <div className="flex items-center p-3 border-t">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          className="border rounded px-3 py-2 text-sm 2xl:text-lg w-full mr-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 2xl:text-lg"
        >
          ➤
        </button>
        <button
          onClick={onClose}
          className="ml-2 text-sm 2xl:text-lg text-gray-500 hover:text-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
