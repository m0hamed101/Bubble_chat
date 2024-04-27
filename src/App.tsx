// App.tsx
import React from 'react';
import Chat from './Chat';
import avatar from './istockphoto-1300845620-612x612.jpg'
const App: React.FC = () => {
  const props = {
    username: 'John', // Example username
    direction: "rtl",
    avatarURL:avatar,
    userType: "receiver" as const, 
  };

  return (
    <div>
      <Chat {...props} />
    </div>
  );
};

export default App;
