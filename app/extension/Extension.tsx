// src/extension/ExtensionChat.tsx
import Chat from "../../components/chat/Chat";

export default function Extension() {
  return (
    <div className="w-80 h-96 overflow-hidden bg-white">
      {/* Scale down your original component to fit extension popup */}
      <div style={{ 
        transform: 'scale(0.6)', 
        transformOrigin: 'top left', 
        width: '166%', 
        height: '166%' 
      }}>
        <Chat />
      </div>
    </div>
  );
}