import React, { useEffect, useRef, useState } from 'react';

function ChatBox({ theme, room, socket }) {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([{ message: '', sendBy: 0 }]);
  const messagesEndRef = useRef(null); // Create a ref for the messages end div

  const sendMsg = () => {
    socket.emit('player_message', { msg, room });
    setMsg('');
  };

  useEffect(() => {
    const handleMessageReceived = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log(messages);
    };

    socket.on('message_recieved', handleMessageReceived);

    return () => {
      socket.off('message_recieved', handleMessageReceived);
    };
  }, [socket]);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full w-2/5 bg-slate-900 p-4 pt-7 hidden md:flex md:flex-col items-center">
      <div className={`h-[90%] w-full bg-slate-950 text-white mb-2 rounded-2xl overflow-y-auto overflow-x-hidden scroll-m-4 flex flex-col p-4 border-4 border-${theme}-700 hide-scrollbar`}>
        {messages.map((msgObj, index) => (
          <div key={index} className={`w-full flex ${msgObj.sendBy == 0 ? 'justify-end' : 'justify-start'}`}>
            <div className={`message w-max h-8 bg-slate-700 m-1 rounded-3xl p-2 flex justify-center items-center ${msgObj.message ? 'flex' : 'hidden'}`}>
              {msgObj.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Add a div at the end to scroll to */}
      </div>
      <div className='h-[10%] w-full mb-4 p-1 pl-0 flex items-center'>
        <input
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          onKeyDown={(e) => { if (e.key === 'Enter') sendMsg(); }}
          placeholder='type here . . .'
          className={`w-[75%] h-full bg-black flex justify-center items-center rounded-full text-white p-4 border-2 border-${theme}-500`}
        />
        <button
          onClick={sendMsg}
          className={`w-[25%] h-4/5 rounded-3xl bg-${theme}-500 text-slate-900 font-bold text-xl font-serif ml-2 flex justify-center items-center hover:bg-${theme}-400`}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
