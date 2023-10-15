import React, { useState } from "react";
import { Container } from "./Container";
import { ChatBubble } from "./ChatBubble";

export function Chat() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const sendMessage = () => {
    if (currentMessage) {
      setMessages([
        ...messages,
        { type: "user", content: currentMessage },
        {
          type: "response",
          content: "Some test Response",
        },
      ]);
      setCurrentMessage("");
    }
  };

  return (
    <div className="bg-white flex flex-col h-full">
      <Container className="flex flex-col pb-10 w-full h-full">
        <div className="flex-1 p-4 overflow-y-auto items-center">
          {messages.map((message, index) => {
            // Check if the message type is 'user', then render ChatBubble with response
            if (message.type === "user") {
              return (
                <ChatBubble
                  key={index}
                  message={message}
                  response={messages[index + 1]} // This assumes there is always a response after a user message
                  index={index}
                />
              );
            } else {
              return null; // Do not render a separate ChatBubble for responses
            }
          })}
        </div>
      </Container>
      <div className="fixed bottom-0  w-full pb-4 items-center   bg-gradient-to-b from-white to-gray-200">
        <Container className="flex bg-white shadow-md rounded-md p-2 shadow-gray-400 ">
          <input
            className="flex-1 p-2  rounded-md"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-blue-500 text-white p-2 rounded-md"
          >
            Send
          </button>
        </Container>
      </div>
    </div>
  );
}