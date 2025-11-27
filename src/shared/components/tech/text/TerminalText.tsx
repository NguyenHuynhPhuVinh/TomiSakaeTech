"use client";
import React, { useEffect, useState } from "react";

interface TerminalTextProps {
  children: string;
  className?: string;
  color?: string;
  prefix?: string;
  typingSpeed?: number;
  showCursor?: boolean;
  cursorChar?: string;
}

export const TerminalText: React.FC<TerminalTextProps> = ({
  children,
  className = "",
  color = "#00ff88",
  prefix = "> ",
  typingSpeed = 50,
  showCursor = true,
  cursorChar = "█",
}) => {
  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    setDisplayText("");
    setIsTyping(true);

    const typeInterval = setInterval(() => {
      if (index < children.length) {
        setDisplayText(children.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [children, typingSpeed]);

  useEffect(() => {
    if (!showCursor) return;
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, [showCursor]);

  return (
    <span className={`font-mono inline-block ${className}`} style={{ color }}>
      <span style={{ color: `${color}80` }}>{prefix}</span>
      {displayText}
      {showCursor && (
        <span
          style={{
            opacity: cursorVisible ? 1 : 0,
            marginLeft: "2px",
            animation: isTyping ? "none" : undefined,
          }}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
};

export default TerminalText;
