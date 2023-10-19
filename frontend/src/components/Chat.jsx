import React, { useState } from "react";
import { Container } from "./Container";
import { ChatBubble } from "./ChatBubble";

export function Chat() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState("Market Research");

  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  const optionPrompts = {
    "Market Research":
      "Provide an in-depth analysis, product details, and financial analysis of ",
    "Personalized Email Outreach":
      "Provide details for personalized email outreach regarding ",
    "Social Media Posting": "Provide details for a social media post about ",
  };

  const apiUrl = "http://localhost:8000/api/competitor-research";
  const apiToken = process.env.OPENAI_API_KEY;

  const handleInputChange = (e) => {
    if (!hasStartedTyping) {
      setCurrentMessage(
        "Provide an in-depth analysis, product details, and financial analysis of " +
          e.target.value
      );
      setHasStartedTyping(true);
    } else {
      setCurrentMessage(e.target.value);
    }
  };
  const currentPrompt = optionPrompts[selectedOption];

  const handleDropdownChange = (e) => {
    setSelectedOption(e.target.value);
    setHasStartedTyping(false); // Reset the typing status when the option changes
  };

  const sendMessage = async () => {
    setLoading(true); // Start loading

    try {
      // Define the request body
      const requestBody = {
        input: currentMessage,
        task_type: selectedOption
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ${apiToken}",
        },
        body: JSON.stringify(requestBody),
      };

      // Make the fetch request
      const response = await fetch(apiUrl, requestOptions);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.text();
      setResponse(result);

      setMessages([
        ...messages,
        { type: "user", content: currentMessage },
        {
          type: "response",
          content: result,
        },
      ]);

      setCurrentMessage("");
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setError("Error fetching data from the API.");
    } finally {
      setLoading(false);
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
        <select 
            value={selectedOption} 
            onChange={handleDropdownChange}
            className="mr-2 p-2 rounded-md shadow-md bg-gray-100">
            <option value="Market Research">Market Research</option>
            <option value="Personalized Email Outreach">Personalized Email Outreach</option>
            <option value="Social Media Posting">Social Media Posting</option>
        </select>
        <input
          className="flex-1 p-2 rounded-md shadow-md"
          value={currentMessage}
          onChange={handleInputChange}
          placeholder={!hasStartedTyping ? currentPrompt : ""}
          disabled={loading}
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
