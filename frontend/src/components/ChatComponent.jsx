import { useEffect, useState, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setMessages, fetchMessages } from "../redux/chatSlice";
import io from "socket.io-client";
import moment from "moment";
import Navbar from "./shared/Navbar";
import { ThemeContext } from "@/ThemeContext";
import { BACKEND } from "@/utils/constant";

const socket = io(`${BACKEND}`);

const getUserColor = (username) => {
  const colors = [
    "#FF5733", "#33FF57", "#3375FF", "#F3C300", "#BC8F8F", "#9370DB", "#40E0D0",
    "#FFA07A", "#FF69B4", "#DC143C", "#8A2BE2", "#00CED1", "#FFD700", "#6495ED",
    "#2E8B57", "#FF6347", "#4682B4", "#ADFF2F", "#9932CC", "#FF4500", "#1E90FF",
    "#D2691E", "#B22222", "#32CD32",
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const ChatComponent = () => {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.chat);
  const { user } = useSelector((store) => store.auth);

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showNewMessagesButton, setShowNewMessagesButton] = useState(false);

  useEffect(() => {
    dispatch(fetchMessages());

    socket.on("previousMessages", (msgs) => {
      dispatch(setMessages(msgs));
    });

    socket.on("receiveMessage", (msg) => {
      dispatch(addMessage(msg));
      if (isAtBottom) {
        scrollToBottom();
      } else {
        setShowNewMessagesButton(true);
      }
    });

    return () => {
      socket.off("previousMessages");
      socket.off("receiveMessage");
    };
  }, [dispatch, isAtBottom]);

  const sendMessage = () => {
    if (message.trim()) {
      const msgData = {
        sender: user.fullname,
        text: message,
        timestamp: new Date().toISOString(),
      };
      socket.emit("sendMessage", msgData);
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowNewMessagesButton(false);
  };

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    if (isAtBottom) setShowNewMessagesButton(false);
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages]);

  return (
    <>
      <Navbar />
      <div className={`p-4 w-auto overflow-y-hidden mx-auto ${theme === "dark" ? "bg-[#191919] text-white" : "bg-white text-black"}`}>
        <h2 className="text-lg text-center font-semibold mb-3">
          Chat Room - {user.fullname}
        </h2>

        {loading && (
          <div className="text-center p-4">
            <p className="animate-pulse">Loading messages...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 p-4">
            <p>Error: {error}</p>
          </div>
        )}

        <div
          ref={chatContainerRef}
          className="max-h-[75vh] overflow-y-auto relative p-3 rounded"
          onScroll={handleScroll}
          style={{ backgroundColor: theme === "dark" ? "#222" : "#f9f9f9" }}
        >
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 p-3 rounded-lg shadow ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <strong style={{ color: getUserColor(msg.sender) }}>{msg.sender}</strong>
                <p className={`text-justify ${theme === "dark" ? "text-gray-300" : "text-black"}`}>
                  {msg.text}
                </p>
                <span className={`text-xs block mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  {moment(msg.timestamp).format("h:mm A")}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
          )}

          <div ref={messagesEndRef} />
        </div>

        {showNewMessagesButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-20 right-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            New Messages ↓
          </button>
        )}

        <div className="mt-3 flex">
          <input
            type="text"
            className={`flex-1 p-2 rounded-l ${
              theme === "dark" ? "bg-[#2f2f2f] text-gray-100" : "border"
            }`}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-r">
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatComponent;
