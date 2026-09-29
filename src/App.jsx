import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import Login from './pages/Login';
import Chat from './pages/Chat';
import './styles/global.css';

function AppContent() {
  const { credentials } = useAuth();
  return credentials ? <Chat /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </AuthProvider>
  );
}
