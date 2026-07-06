import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello. I am the Avibha AI assistant. Ask me about services, GST, registrations, or contact details.'
    }
  ]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      const panel = document.getElementById('ai-chat-panel');
      panel?.scrollTo({ top: panel.scrollHeight, behavior: 'smooth' });
    }, 50);
    return () => window.clearTimeout(timer);
  }, [messages, open]);

  const quickReplies = ['Services', 'GST filing', 'Company registration', 'Contact details'];

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((current) => [
      ...current,
      { role: 'user', text: trimmed }
    ]);
    setInput('');
    setError('');
    setSending(true);

    try {
      const result = await api.post('/chat', { message: trimmed });
      setMessages((current) => [...current, { role: 'assistant', text: result.reply }]);
    } catch (chatError) {
      console.error('[Chatbot error]', {
        message: chatError?.message,
        stack: chatError?.stack
      });
      setError(chatError.message || 'Chatbot request failed');
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: chatError.message || 'The chatbot is temporarily unavailable. Please try again or use the WhatsApp button in the header.'
        }
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      {open ? (
        <div className="w-[min(92vw,380px)] overflow-hidden rounded-3xl border border-white/10 bg-white shadow-[0_20px_60px_rgba(17,24,39,0.22)]">
          <div className="flex items-center justify-between bg-purple-900 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">AI Chatbot</p>
              <p className="text-[11px] text-white/75">Quick support for visitors</p>
            </div>
            <button type="button" className="text-xl leading-none" onClick={() => setOpen(false)} aria-label="Close chatbot">
              ×
            </button>
          </div>

          <div id="ai-chat-panel" className="max-h-[210px] space-y-3 overflow-y-auto bg-[#faf7ff] px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'bg-purple-900 text-white'
                      : 'bg-white text-slate-700 shadow-sm'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 px-4 py-3">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                disabled={sending}
                onClick={() => sendMessage(reply)}
                className="rounded-full border border-purple-200 bg-white px-3 py-1.5 text-xs font-medium text-purple-900 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reply}
              </button>
            ))}
          </div>

          <form
            className="flex gap-2 border-t border-border bg-white p-3"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(input);
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask something..."
              disabled={sending}
              className="flex-1 rounded-full border border-border px-4 py-2 text-sm outline-none focus:border-purple-400 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
            <button type="submit" disabled={sending} className="rounded-full bg-purple-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60">
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
          {error ? <p className="px-4 pb-3 text-xs text-red-600">{error}</p> : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="mt-3 rounded-full bg-purple-900 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(76,29,149,0.35)] transition hover:scale-[1.03]"
      >
        AI Chatbot
      </button>
    </div>
  );
}
