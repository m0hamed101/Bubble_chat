import React, { useState, useEffect, useRef } from 'react';

interface Props {
  direction: string;
  avatarURL: string;
  userType: "sender" | "receiver";
  username: string;
}

interface Message {
  id: number;
  content: string;
  sender: string;
  files?: File[];
}

const Chat: React.FC<Props> = ({ direction, avatarURL, userType, username }) => {
  const [showChat, setShowChat] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [layoutDirection, setLayoutDirection] = useState<string>('ltr');
  const chatboxRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  useEffect(() => {
    setLayoutDirection(direction);
  }, [direction]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
    }
  };

  const handleMessageSend = () => {
    if (inputValue.trim() !== "" || selectedFiles.length > 0) {
      const newMessage: Message = {
        id: Date.now(),
        content: inputValue,
        sender: userType,
        files: selectedFiles,
      };
      const newMessages = [...messages, newMessage];
      setMessages(newMessages);
      setInputValue("");
      setSelectedFiles([]);

      if (chatboxRef.current) {
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleMessageSend();
    }
  };

  const renderMessageContent = (message: Message) => {
    const isUserMessage = message.sender === userType;
    const messageStyle: React.CSSProperties = {
      backgroundColor: isUserMessage ? "#E5E7EB" : "#3B82F6",
      color: isUserMessage ? "#111827" : "#FFFFFF",
    };

    return (
      <div className={`message-container ${isUserMessage ? 'text-right' : 'text-left'} mx-auto w-full`}>
        <p style={messageStyle} className="py-2 px-4 inline-block rounded-lg">
          {message.content}
        </p>
        {message.files && (
          <div className="mt-2">
            {message.files.map((file, index) => (
              <div key={index}>
                {renderFile(file, userType)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderFile = (file: File, userType: 'sender' | 'receiver') => {
    const type = file.type.split('/')[0];
    return (
      <div className="">
        {type === 'image' && (
          <img className={`py-2 px-4 inline-block rounded-lg ${userType === 'sender' ? "bg-blue-500 text-white rounded-l-md" : "bg-gray-200 text-gray-700 rounded-r-md"}`} src={URL.createObjectURL(file)} alt={file.name} style={{ maxWidth: '50%', maxHeight: '50%' }} />
        )}
        {type === 'audio' && (
          <audio className={`py-2 px-4 inline-block rounded-lg ${userType === 'sender' ? "bg-blue-500 text-white rounded-l-md" : "bg-gray-200 text-gray-700 rounded-r-md"}`} controls><source src={URL.createObjectURL(file)} type={file.type} />Your browser does not support the audio element.</audio>
        )}
        {type === 'video' && (
          <video className={`py-2 px-4 inline-block rounded-lg ${userType === 'sender' ? "bg-blue-500 text-white rounded-l-md" : "bg-gray-200 text-gray-700 rounded-r-md"}`} controls><source src={URL.createObjectURL(file)} type={file.type} />Your browser does not support the video tag.</video>
        )}
        {type !== 'image' && type !== 'audio' && type !== 'video' && (
          <a className={`py-2 px-4 inline-block rounded-lg ${userType === 'sender' ? "bg-blue-500 text-white rounded-l-md" : "bg-gray-200 text-gray-700 rounded-r-md"}`} href={URL.createObjectURL(file)} download={file.name}>{file.name}</a>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-r flex flex-col justify-end">
      <button
        onClick={toggleChat}
        className={`fixed bottom-1 ${layoutDirection === 'rtl' ? 'right-1' : 'left-1'} bg-indianred px-8 py-4 rounded-full text-base font-semibold focus:outline-none`}
      >
        {showChat ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
        )}
      </button>
      {showChat && (
        <div id="chat-container" className={`fixed bottom-16 ${layoutDirection === 'rtl' ? 'right-4' : 'left-4'} w-full sm:max-w-lg lg:w-96`}>
          <div className="bg-white shadow-md rounded-lg max-w-lg w-full">
            <div className="border-b bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
              <div className="flex items-center">
                <img className='w-9 m-3 rounded-2xl' src={avatarURL} alt="" />
                <p className="text-lg font-semibold">{username}</p>
              </div>
              <button
                onClick={toggleChat}
                className="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400 m-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div id="chatbox" ref={chatboxRef} className="p-4 h-80 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className="mb-2">
                  {renderMessageContent(message)}
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".jpg, .jpeg, .png, .gif, .pdf, .doc, .docx, .mp3, .mp4, .avi, .mov, .wav"
                multiple
                id="fileInput"
              />
              <label htmlFor="fileInput" className="bg-blue-500 text-white px-2 p-2 rounded-2xl hover:bg-blue-600 transition duration-300 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                </svg>
              </label>
              <button
                onClick={handleMessageSend}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.768 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
