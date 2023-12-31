import React from "react";

export function ChatBubble({ message, response, index }) {
  const parsedContent = JSON.parse(response.content); 

  return (
    <div
      key={index}
      className="my-2 p-3 rounded-lg ml-auto bg-gray-100 text-black shadow-md"
      style={{ whiteSpace: "pre-line", verticalAlign: "bottom" }}
    >
      <div 
        className="p-2 mb-2 rounded-lg bg-gray-100 text-black flex items-center"
      >
        {message.content}
      </div>
      {response && (
        <div className="p-2 rounded-lg bg-white text-black flex items-center">
          {parsedContent} 
        </div>
      )}
    </div>
  );
}
