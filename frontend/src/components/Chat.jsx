import React, { useState } from "react";
import { Container } from "./Container";
import { ChatBubble } from "./ChatBubble";

export function Chat() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = "http://localhost:8000/api/chat";

  const fetchDataFromAPI = async () => {
    try {
      setLoading(true);

      const apiUrl = "http://localhost:8000/api/ask-openai";
      const requestBody = {
        text: currentMessage,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResponse(data.response);
      setError("");
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setError("There was an error processing your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    await fetchDataFromAPI();

    if (currentMessage) {
      setMessages([
        ...messages,
        { type: "user", content: currentMessage },
        {
          type: "response",
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

// const getResponse = async () => {
//   // Declare the function as async
//   try {
//     const response = await fetch(apiUrl, {
//       method: "GET", // Use GET method to retrieve data
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     const data = await response.json();

//     // Update the messages with the received response
//     setResponse(data.message);
//   } catch (error) {
//     console.error("There was a problem with the fetch operation:", error);
//   }
// };

// const connectToOpenAIStream = () => {
//   const eventSource = new EventSource("http://localhost:8000/stream");

//   eventSource.onmessage = (event) => {
//     const openaiResponse = event.data;
//     setResponse(openaiResponse);

//     // Add the OpenAI response to the messages
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { type: "response", content: openaiResponse },
//     ]);
//   };

//   eventSource.onerror = (error) => {
//     console.error("Error connecting to OpenAI stream:", error);
//   };
// };

// useEffect(() => {
//   connectToOpenAIStream();
// }, []);
