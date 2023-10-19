import React, { useState } from "react";
import { Container } from "./Container";
import { ChatBubble } from "./ChatBubble";

export function Chat() {
  const optionPrompts = {
    "Market Research":
      "Provide an in-depth analysis, product details, and financial analysis of ",
    "Personalized Email Outreach":
      "Provide details for personalized email outreach regarding ",
    "Social Media Posting": "Provide details for a social media post about ",
  };

  const [messages, setMessages] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Market Research");
  const [currentMessage, setCurrentMessage] = useState(
    optionPrompts[selectedOption]
  );
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentPrompt = optionPrompts[selectedOption];

  const apiUrl = "http://localhost:8000/api/competitor-research";
  const apiToken = process.env.OPENAI_API_KEY;

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Check if the value starts with any of the prompts.
    const matchesPrompt = Object.values(optionPrompts).some((prompt) =>
      value.startsWith(prompt)
    );

    if (matchesPrompt) {
      setCurrentMessage(value);
    } else {
      setCurrentMessage(optionPrompts[selectedOption]);
    }
  };

  const handleDropdownChange = (e) => {
    const selected = e.target.value;
    setSelectedOption(selected);
    setCurrentMessage(optionPrompts[selected]);
  };

  const sendMessage = async () => {
    setLoading(true); // Start loading

    try {
      const requestBody = {
        input: currentMessage,
        task_type: selectedOption,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ${apiToken}",
        },
        body: JSON.stringify(requestBody),
      };

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
            className="mr-2 p-2 rounded-md shadow-md bg-gray-100"
          >
            <option value="Market Research">Market Research</option>
            <option value="Personalized Email Outreach">
              Personalized Email Outreach
            </option>
            <option value="Social Media Posting">Social Media Posting</option>
          </select>
          <input
            className="flex-1 p-2 rounded-md shadow-md"
            value={currentMessage}
            onChange={handleInputChange}
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
        <Container>
          {loading && <p>Loading...</p>} {/* Display loading indicator */}
          {error && <p>{error}</p>} {/* Display error message */}
        </Container>
      </div>
    </div>
  );
}
