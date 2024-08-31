"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaMicrophone, FaPaperPlane, FaUser } from 'react-icons/fa';
import { TypewriterEffect } from '@/components/ui/typewriter-effect';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { BellRing, Snowflake, Network, Ticket } from "lucide-react";

const cardItems = [
  {
    title: "Get data from service ticket applications",
    icon: <Ticket size={24} />,
    prompt: "Get data from service ticket applications" // Associated prompt text
  },
  {
    title: "Generate a snow ticket",
    icon: <Snowflake size={24} />,
    prompt: "Generate a snow ticket" // Associated prompt text
  },
  {
    title: "Perform a network pathtrace",
    icon: <Network size={24} />,
    prompt: "Perform a network pathtrace" // Associated prompt text
  },
  {
    title: "Monitor system performance",
    icon: <BellRing size={24} />,
    prompt: "Monitor system performance" // Associated prompt text
  },
];

const Ido = () => {
  const [showGreeting, setShowGreeting] = useState(false);
  const [textareaValue, setTextareaValue] = useState(''); // State to manage textarea content
  const [showChat, setShowChat] = useState(false); // State to toggle between greeting/cards and chat interface
  const [chatMessages, setChatMessages] = useState([]); // State to store chat messages
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    // Timer to show the greeting message after typewriter effect completes
    const timer = setTimeout(() => {
      setShowGreeting(true);
    }, 5000); // Duration of typewriter effect

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto'; // Reset height to auto to shrink back if necessary
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    }
  }, [textareaValue]); // Trigger effect whenever textareaValue changes

  const handleInput = (e) => {
    const { value } = e.target;
    setTextareaValue(value);
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto'; // Reset height to auto to shrink back if necessary
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior (form submission)
      handleSendClick();
    }
  };

  const handleMicrophoneClick = () => {
    console.log('Microphone clicked');
  };

  const handleSendClick = () => {
    if (textareaValue.trim()) {
      // Add user's message to chat
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: textareaValue }
      ]);

      // Simulate GPT response
      setTimeout(() => {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { role: 'gpt', content: `This is a simulated response to: "${textareaValue}"` }
        ]);
      }, 1000);

      // Clear textarea and switch to chat view
      setTextareaValue('');
      setShowChat(true); // Show chat interface only after sending a message
    }
  };

  const handleCardClick = (prompt: string) => {
    setTextareaValue(prompt); // Update textarea value with the card's prompt
    // Do not set `showChat` to true here. Just update the prompt text.
  };

  const Words = [
    { text: " I " },
    { text: " DO " },
    { text: "EVERYTHING !", className: "text-blue-500 dark:text-blue-500" },
  ];

  return (
    <div className="relative h-[calc(100%-5.5rem)] flex flex-col">
      {/* Header Section */}
      <div className="flex items-center gap-3 p-4">
        <h1 className="text-2xl font-bold text-primary">IDOe</h1>
        <FaRobot className="h-10 w-10 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center overflow-hidden">
        {/* Initial View (Greeting and Cards or Typewriter) */}
        {!showChat ? (
          <>
            {/* Typewriter Effect Centered */}
            {!showGreeting && (
              <div className="flex items-center justify-center h-[40rem]">
                <div className="flex items-center space-x-4 text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center">
                  <FaRobot size={64} className="text-neutral-700 dark:text-neutral-200" />
                  <TypewriterEffect
                    words={Words}
                  />
                </div>
              </div>
            )}

            {/* Greeting and Cards Section */}
            {showGreeting && (
              <div className="flex flex-col items-center mt-10 p-4 w-full max-w-4xl">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 text-left w-full">
                  Hello, VIDHANT
                </h1>
                <h2 className="text-5xl font-semibold text-gray-500 mt-4 text-left w-full">
                  How can I help you today?
                </h2>

                {/* Responsive Cards Section */}
                <div className="flex flex-wrap lg:flex-nowrap justify-start gap-6 mt-8 w-full">
                  {cardItems.map((item, index) => (
                    <Card
                      key={index}
                      onClick={() => handleCardClick(item.prompt)} // Add onClick handler
                      className="w-[200px] h-[250px] flex flex-col items-center justify-between p-6 rounded-lg shadow-lg bg-white dark:bg-neutral-800 transform hover:scale-105 transition-transform duration-200 ease-out cursor-pointer"
                    >
                      <CardContent className="flex flex-col items-center text-center space-y-2">
                        <div className="flex items-center mb-2 text-blue-500">
                          {item.icon}
                        </div>
                        <p className="text-base font-semibold text-gray-700 dark:text-gray-200">
                          {item.title}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Notice Section */}
                <div className="mt-8 w-full p-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-center">
                  <p className="text-base md:text-lg">
                    NOTE: IDOe is still in development. AI can make mistakes. Please use with caution and provide feedback to help improve the system.
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Chat Interface */
          <div className="flex flex-col items-center w-full max-w-4xl mt-10 p-4 overflow-y-auto flex-grow">
            <div className="w-full flex flex-col gap-4">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Chat message box */}
                  {message.role === 'gpt' && (
                    <FaRobot className="h-6 w-6 flex-shrink-0 text-neutral-700 dark:text-neutral-200 mr-4 mt-3" />
                  )}
                  <div
                    className={`p-3 rounded-lg max-w-[75%] ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white self-end'
                        : 'bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === 'user' && (
                    <FaUser className="h-6 w-6 flex-shrink-0 ml-4 mt-3" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Textarea */}
      <div className="relative w-full flex justify-center">
        <div className="relative w-full max-w-4xl">
          <div className="relative flex items-center">
            <Textarea
              ref={textareaRef}
              value={textareaValue}
              onChange={handleInput}
              placeholder="Enter Prompt Here ..."
              onKeyDown={handleKeyDown}
              className="resize-none overflow-auto w-full min-h-[30px] max-h-[160px] pr-16"
            />
            <div className="absolute right-2 bottom-3 flex items-center space-x-2">
              <button
                onClick={handleMicrophoneClick}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <FaMicrophone size={24} />
              </button>
              <button
                onClick={handleSendClick}
                className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                disabled={!textareaRef.current?.value.trim()}
              >
                <FaPaperPlane size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ido;
