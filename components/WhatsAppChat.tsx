"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { X, Check, Send } from "lucide-react";
import Image from "next/image";

type Message = {
  text: string;
  isUser: boolean;
  timestamp?: string;
};

type WhatsAppChatProps = {
  brandName?: string;
  brandMessage?: string;
  brandColor?: string;
  badgeDelay?: number; // in milliseconds
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  chatWidth?: string;
  chatHeight?: string;
  autoResponse?: string;
  showTimestamp?: boolean;
  className?: string;
};

const reaplay_message_Sound = () => {
  const audio = new Audio("/sounds/replay-message-effect.mp3");
  audio.play();
};

const WhatsAppChat = ({
  brandName = "MadeenaIslamicArt",
  brandMessage = "",
  brandColor = "#25D366",
  badgeDelay = 5000,
  position = "bottom-right",
  chatWidth = "20rem",
  chatHeight = "25rem",
  autoResponse = "Thanks for your message! Our team will get back to you soon.",
  showTimestamp = true,
  className = "",
}: WhatsAppChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showConfirmation, setIsShowConfirmation] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Position classes
  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-8 left-8";
      case "top-right":
        return "top-8 right-8";
      case "top-left":
        return "top-8 left-8";
      default:
        return "bottom-20 right-5";
    }
  };

  const getChatPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "left-0 bottom-20";
      case "top-right":
        return "right-0 top-20";
      case "top-left":
        return "left-0 top-20";
      default:
        return "right-0 bottom-20";
    }
  };

  // Simulate idle time notification
  useEffect(() => {
    const startIdleTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      idleTimerRef.current = setTimeout(() => {
        setUnreadCount((prev) => prev + 1);
        // Play sound when badge appears
      }, badgeDelay);
    };

    startIdleTimer();

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [badgeDelay]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showConfirmation]);

  const handleOpenChat = () => {
    setIsOpen(true);
    if (unreadCount > 0) {
      setUnreadCount(0);
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setIsShowConfirmation(false);
    setUnreadCount(0);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const newMessage: Message = {
      text: inputValue,
      isUser: true,
      timestamp: showTimestamp
        ? new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Simulate typing indicator
    setIsTyping(true);

    // Simulate response after a delay
    setTimeout(() => {
      setIsTyping(false);
      const responseMessage: Message = {
        text: autoResponse,
        isUser: false,
        timestamp: showTimestamp
          ? new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : undefined,
      };
      setMessages((prev) => [...prev, responseMessage]);
      reaplay_message_Sound();

      // Show confirmation after another delay
      setTimeout(() => {
        setIsShowConfirmation(true);
      }, 1000);
    }, 2000);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp || !showTimestamp) return null;
    return (
      <span className="block mt-1 text-xs text-gray-500">{timestamp}</span>
    );
  };

  return (
    <div className={`fixed z-50  ${getPositionClasses()} ${className}`}>
      {/* WhatsApp Icon */}
      <div className="relative cursor-pointer" onClick={handleOpenChat}>
        <div
          className="flex items-center justify-center w-16 h-16 transition-colors duration-200 rounded-full shadow-lg hover:opacity-90"
          style={{ backgroundColor: brandColor }}
        >
          <svg
            className="text-white w-7 h-7"
            viewBox="0 0 32 32"
            fill="currentColor"
            aria-hidden="true"
          >
            <g>
              <path
                d="M16.001 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.6 4.47 1.74 6.41L3.2 28.8l6.61-1.72A12.74 12.74 0 0 0 16 28.8c7.06 0 12.8-5.74 12.8-12.8s-5.74-12.8-12.799-12.8zm0 23.04c-2.01 0-3.99-.53-5.7-1.54l-.41-.24-3.93 1.02 1.05-3.83-.27-.39A10.57 10.57 0 0 1 5.44 16c0-5.83 4.74-10.56 10.56-10.56 5.82 0 10.56 4.73 10.56 10.56 0 5.82-4.74 10.56-10.56 10.56zm5.8-7.97c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.36-.5-2.6-1.6-.96-.85-1.61-1.89-1.8-2.21-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.62-.53-.54-.71-.55-.18-.01-.39-.01-.6-.01-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.65 0 1.56 1.14 3.07 1.3 3.29.16.21 2.24 3.42 5.44 4.66.76.29 1.36.46 1.83.59.77.2 1.47.17 2.02.1.62-.08 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37z"
                fill="currentColor"
              />
            </g>
          </svg>
        </div>

        {/* Notification Badge */}
        {unreadCount > 0 && (
          <div className="absolute flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full -top-2 -right-2 animate-bounce">
            {unreadCount}
          </div>
        )}
      </div>

      {/* Chat Box */}
      {isOpen && (
        <div
          className={`absolute overflow-hidden bg-white border border-gray-200 rounded-lg  shadow-xl ${getChatPositionClasses()}`}
          style={{ width: chatWidth, height: chatHeight }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-3 text-white bg-gray-700"
            // style={{ backgroundColor: brandColor }}
          >
            <div className="flex items-end gap-3">
              <Image
                src={"/images/whatsapp-profile-image.jpg"}
                width={55}
                height={55}
                alt="profile"
                className="object-cover rounded-full"
              />
              <div className="flex flex-col items-start">
                <span className="text-base font-roboto">{brandName}</span>
                <span className="text-xs font-roboto">
                  {isTyping ? "typing" : "online"}
                </span>
              </div>
            </div>
            <button
              onClick={handleCloseChat}
              className="text-white hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="p-4 h-[260px] overflow-y-auto bg-gray-50">
            {/* Brand Message */}
            <div className="mb-4">
              <div className="max-w-xs p-3 bg-white rounded-lg shadow-sm md:text-lg">
                <p className="mb-2 font-bold text-end">, السلام عليكم</p>
                <p className="text-sm text-gray-800">
                  Welcome to <strong>MadeenaIslamicArt</strong> — premium modern
                  Islamic calligraphy for homes, offices, and gifts.
                  {brandMessage}
                </p>
              </div>
              {formatTime(
                new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              )}
            </div>

            {/* User Messages */}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-lg shadow-sm max-w-[300px] ${message.isUser ? "bg-green-100" : "bg-white"}`}
                >
                  <p className="text-base text-gray-800 md:text-lg">
                    {message.text}
                  </p>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation Message */}
            {showConfirmation && (
              <div className="flex justify-center mb-4">
                <div className="flex items-center p-2 rounded-full bg-blue-50">
                  <Check className="w-4 h-4 mr-1 text-blue-500" />
                  <span className="text-base text-blue-600">That's it</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 ">
            <div className="flex items-center p-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 px-4 py-1 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-green-500"
                disabled={showConfirmation}
              />
              <button
                onClick={handleSendMessage}
                disabled={inputValue.trim() === "" || showConfirmation}
                className={`ml-2 p-2 rounded-full ${inputValue.trim() === "" || showConfirmation ? "text-gray-400" : "text-green-500 hover:bg-green-50"}`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppChat;
