"use client";

import { useState } from "react";
import { Send, Bot, User } from "lucide-react";

// Circular Loader Component
function CircularLoader() {
    return (
        <div className="flex items-center justify-center py-4">
            <div className="relative">
                <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-r-blue-300 rounded-full animate-ping opacity-20"></div>
            </div>
        </div>
    );
}

export default function Chat() {
    const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    async function sendMessage() {
        if (!input.trim()) return;
        const userMessage = { role: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: input, userId: "default-user" }),
            });

            const data = await res.json();
            if (data.success) {
                setMessages((prev) => [...prev, { role: "bot", text: data.result }]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { role: "bot", text: `⚠️ Error: ${data.error}` },
                ]);
            }
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: "⚠️ Something went wrong." },
            ]);
        }

        setLoading(false);
        setInput("");
    }

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-4 overflow-y-auto max-h-[100%] min-h-[100%]">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        AI Assistant Chat
                    </h1>
                    <p className="text-gray-600">Ask me anything about candidates or any topic</p>
                </div>

                {/* Chat Container */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Chat Messages */}
                    <div className="p-6 space-y-4 bg-gradient-to-b from-white to-gray-50/30">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <Bot className="w-16 h-16 mb-4 opacity-50" />
                                <p className="text-lg">Start a conversation!</p>
                                <p className="text-sm">Ask me anything and I&apos;ll do my best to help.</p>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                {msg.role === "bot" && (
                                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                )}

                                <div
                                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.role === "user"
                                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                                            : "bg-white border border-gray-200 text-gray-800 shadow-sm"
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                        {msg.text}
                                    </p>
                                </div>

                                {msg.role === "user" && (
                                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="ml-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                                    <CircularLoader />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-white border-t border-gray-100">
                        <div className="flex gap-3 items-end">
                            <div className="flex-1 relative">
                                <input
                                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm resize-none"
                                    placeholder="Type your message here..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                                    disabled={loading}
                                />
                            </div>
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-blue-600"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        <div className="mt-2 text-xs text-gray-500 text-center">
                            Press Enter to send • Shift + Enter for new line
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}