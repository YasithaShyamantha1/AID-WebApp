// import { useState } from "react";
// import axios from "axios";

// export default function ChatBot() {
//   const [messages, setMessages] = useState([]); // Remove the TypeScript type declaration
//   const [input, setInput] = useState("");

//   const sendMessage = async () => {
//     if (!input) return;

//     const newMessages = [...messages, { role: "user", content: input }];
//     setMessages(newMessages);
//     setInput("");

//     try {
//         const response = await axios.post("http://localhost:8000/api/chat", {
//             messages: newMessages,
//           });

//       setMessages([...newMessages, response.data.message]); // Append AI response
//     } catch (error) {
//       setMessages([...newMessages, { role: "assistant", content: "Sorry, something went wrong." }]);
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="messages">
//         {messages.map((msg, index) => (
//           <div key={index} className={`message ${msg.role}`}>
//             {msg.content}
//           </div>
//         ))}
//       </div>
//       <input 
//         type="text" 
//         value={input} 
//         onChange={(e) => setInput(e.target.value)} 
//         placeholder="Type a message..." 
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// }
