import { useState } from "react";

interface AIChatProps {
  onRecommend: (title: string) => void;
}

const AIChat = ({ onRecommend }: AIChatProps) => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<{ title: string; reason: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = "/api/ai";

  const askAI = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      console.log("Calling AI at:", `${baseUrl}/recommend`);  // ← debug
      const res = await fetch(`${baseUrl}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: input.trim() }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Status ${res.status}`);
      }

      const data = (await res.json()) as { movieTitle: string; reasoning: string };
      setResponse({ title: data.movieTitle, reason: data.reasoning });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 pt-8 pb-6 px-8 bg-gray-900 rounded-xl shadow-xl border border-gray-700 max-w-full md:max-w-3xl min-h-[320px] mx-auto">
      <input
        className="w-full p-3 rounded-md bg-gray-800 text-white placeholder-gray-400 text-base border border-gray-600"
        placeholder="Describe a mood…"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && askAI()}
      />

      <button
        onClick={askAI}
        disabled={isLoading}
        className="w-full bg-pink-600 hover:bg-pink-500 text-white py-2.5 rounded text-base font-medium disabled:opacity-50"
      >
        {isLoading ? "Thinking…" : "Ask AI"}
      </button>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      {response && (
        <div className="text-white text-base space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-pink-400 text-lg">{response.title}</p>
            <button
              onClick={() => onRecommend(response.title)}
              className="text-gray-400 hover:text-white border border-gray-700 hover:border-pink-500 text-sm px-3 py-1.5 rounded-md transition-colors"
            >
              Search
            </button>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{response.reason}</p>
        </div>
      )}
    </div>
  );
};

export default AIChat;
