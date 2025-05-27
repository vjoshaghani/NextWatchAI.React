// src/Components/AIButton.tsx
import { useState } from "react";
import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/solid";
import AIChat from "./AIChat";

interface AIButtonProps {
  /** called with the movie title when user clicks Search in the chat panel */
  onRecommend: (title: string) => void;
}

const AIButton = ({ onRecommend }: AIButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-50 bg-pink-600 hover:bg-pink-500 text-white p-3 rounded-full shadow-lg"
      >
        <SparklesIcon className="w-6 h-6" />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="
            fixed bottom-6 right-6
            w-[88vw] max-w-sm
            rounded-2xl p-5 z-50
            bg-gradient-to-br from-gray-900 via-gray-950 to-black
            border border-white
            shadow-[0_8px_30px_rgb(255,105,180,0.25)]
            backdrop-blur-sm
          "
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-semibold">Ask AI</h3>
            <button onClick={() => setIsOpen(false)}>
              <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </div>

          {/* pass the callback down */}
          <AIChat onRecommend={onRecommend} />
        </div>
      )}
    </>
  );
};

export default AIButton;
