import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getHealthChatResponse } from "@/lib/healthChatbot";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "How can I improve my sleep?",
  "How many steps should I walk daily?",
  "What is a healthy calorie intake?",
  "How to reduce stress?",
  "Tips for better hydration",
];

export default function HealthChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! 👋 I'm your Health Assistant. Ask me anything about sleep, exercise, diet, hydration, or healthy habits!" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = getHealthChatResponse(trimmed);
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    }, 800 + Math.random() * 600);
  };

  return (
    <div className="glass-card flex flex-col h-[600px] max-w-3xl mx-auto glow-border">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-chart-green animate-pulse" />
          AI Health Assistant
        </h2>
        <p className="text-sm text-muted-foreground">Ask me about sleep, exercise, diet, hydration & more</p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line transition-all duration-200 ${
                msg.role === "user"
                  ? "gradient-primary text-primary-foreground rounded-br-md shadow-lg"
                  : "glass-card border-border/30 text-foreground rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
              <span className="typing-dot w-2 h-2 rounded-full bg-primary" />
              <span className="typing-dot w-2 h-2 rounded-full bg-primary" />
              <span className="typing-dot w-2 h-2 rounded-full bg-primary" />
            </div>
          </div>
        )}

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/40 transition-all duration-200"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a health question..."
            className="flex-1 bg-muted/50 border-primary/20 focus:border-primary/50 focus:shadow-[0_0_15px_hsl(190,90%,50%,0.1)] transition-shadow"
          />
          <Button type="submit" size="icon" disabled={!input.trim()} className="gradient-primary border-0 neon-glow hover:scale-105 transition-transform">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
