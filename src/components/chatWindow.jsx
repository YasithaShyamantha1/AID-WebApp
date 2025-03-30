import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { 
  selectChatMessages,
  selectChatLoading,
  selectChatError,
  selectSuggestedHotels,
  selectSuggestionsLoading,
  clearSuggestions,
} from '../lib/features/chatSlice';
import { useChat } from '../hooks/useChat';
import { Sparkles, User, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import HotelSuggestionCard from './HotelSuggestionCard';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { motion } from 'framer-motion';

export default function ChatPopup() {
  const [open, setOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const messages = useSelector(selectChatMessages);
  const isLoading = useSelector(selectChatLoading);
  const error = useSelector(selectChatError);
  const suggestedHotels = useSelector(selectSuggestedHotels);
  const isSuggestionsLoading = useSelector(selectSuggestionsLoading);
  const { isLoaded, isSignedIn, user } = useAuth();
  const { sendChatMessage } = useChat();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const [highlight, setHighlight] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;
    dispatch(clearSuggestions());
    sendChatMessage(inputMessage);
    setInputMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, suggestedHotels]);

  useEffect(() => {
    const timer = setTimeout(() => setHighlight(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
        <motion.div
  animate={{ opacity: [1, 0.5, 1], backgroundColor: ["#000", "#333", "#000"] }}
  transition={{ duration: 1, repeat: Infinity }}
>
  <Button className="fixed bottom-6 right-6 bg-black hover:bg-gray-900 rounded-full p-8 shadow-lg border-4 border-white hover:border-blue-500">
    <Bot className="w-8 h-8 text-white" />
  </Button>
</motion.div>

        </DialogTrigger>
        <DialogContent className="w-full max-w-md p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="flex flex-col h-[500px]">
            <div className="p-4 border-b bg-white dark:bg-gray-800 flex justify-between items-center rounded-t-lg">
              <div className="flex items-center gap-3">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="User" className="w-10 h-10 rounded-full shadow-md" />
                ) : (
                  <User className="w-10 h-10 text-gray-500 dark:text-gray-300" />
                )}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.fullName || 'Traveler'}</h2>
                  <p className="text-sm opacity-80 text-gray-600 dark:text-gray-300">AI Assistant</p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}> 
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-md ${message.role === 'user' ? 'bg-gradient-to-r from-gray-900 to-black text-white' : 'bg-gray-700 text-gray-100'}`}>
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && <p className="text-center text-gray-400">Typing...</p>}
              {error && <p className="text-center text-red-400">Error: {error}</p>}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t bg-white dark:bg-gray-800">
              <div className="flex gap-3 items-center">
                <Input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Describe your dream staycation..." className="flex-1 px-4 py-2 rounded-full border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500" disabled={isLoading} />
                <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-gray-900 to-black text-white rounded-full px-6 py-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> Send
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { ChatPopup };