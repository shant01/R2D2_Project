import React, { useState } from "react";
import { Container } from "./Container";
import { ChatBubble } from "./ChatBubble";

export function Chat() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = "http://localhost:8000/api/competitor-research";

  const fetchDataFromAPI = async () => {
    try {
      // Define the request body
      const requestBody = {
        task: currentMessage,
        task: "competitor_research"
      };

      // Send an HTTP POST request to your FastAPI backend
      const response = await fetch(
        "http://localhost:8000/api/competitor-research",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResponse(data.result);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setError("Error fetching data from the API.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    setLoading(true); // Start loading

    await fetchDataFromAPI(currentMessage);

    if (currentMessage) {
      setMessages([
        ...messages,
        { type: "user", content: currentMessage },
        {
          task: "response",
          content: response,
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
            if (message.type === "user") {
              return (
                <ChatBubble
                  key={index}
                  message={message}
                  response={messages[index + 1]}
                  index={index}
                />
              );
            } else {
              return null;
            }
          })}
        </div>
      </Container>
      <div className="fixed bottom-0 w-full pb-4 items-center bg-gradient-to-b from-white to-gray-200">
        <Container className="flex bg-white shadow-md rounded-md p-2 shadow-gray-400">
          <input
            className="flex-1 p-2 rounded-md"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={loading} // Disable input while loading
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-blue-500 text-white p-2 rounded-md"
            disabled={loading} // Disable the button while loading
          >
            Send
          </button>
        </Container>
        {loading && <p>Loading...</p>} {/* Display loading indicator */}
        {error && <p>{error}</p>} {/* Display error message */}
      </div>
    </div>
  );
}
