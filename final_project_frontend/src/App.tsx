import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import SignUpPage from "./pages/SignUpPage";
import UserInfoPage from "./pages/UserInfo";
import ChatComponent from "./components/ChatComponent";
import { ChatProvider } from './context/ChatContext';
import CommunityBoard from './pages/board';
import LiveStreamingPage from './pages/LiveStreamingPage';
import LiveListPage from './pages/LiveListPage';
import { userApi } from './services/api';  // authApi 대신 userApi 사용
import CommunityBoardTest from "./pages/CommunityBoardTest";
import ProductMainPage from "./pages/productMainPage";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        window.location
        // await userApi.findMy(); // authApi.findMy() 대신 userApi.findMy() 사용
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        localStorage.removeItem("accessToken");
      }
    };

    checkAuthStatus();
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <ChatProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/login" element={isLoggedIn ? <Navigate to="/main" replace /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/main" element={<ProtectedRoute><MainPage isLoggedIn={isLoggedIn} /></ProtectedRoute>} />
            <Route path="/userinfo" element={<ProtectedRoute><UserInfoPage /></ProtectedRoute>} />
            <Route path="/communities" element={<ProtectedRoute><CommunityBoard /></ProtectedRoute>} />
            <Route path="/communitiess" element={<CommunityBoardTest />} />
            <Route path="/live" element={<ProtectedRoute><LiveListPage /></ProtectedRoute>} />
            <Route path="/live/:liveId" element={<ProtectedRoute><LiveStreamingPage /></ProtectedRoute>} />
            <Route path="/product" element={<ProtectedRoute><ProductMainPage /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/main" replace />} />
            <Route path="*" element={<Navigate to="/main" replace />} />
          </Routes>

          {isLoggedIn && (
            <>
              <button 
                onClick={toggleChat} 
                className="fixed bottom-5 right-5 z-50 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                {isChatOpen ? '채팅 닫기' : '채팅 열기'}
              </button>
              {isChatOpen && (
                <div className="fixed bottom-20 right-5 w-80 h-96 z-50 bg-white shadow-lg rounded-lg overflow-hidden">
                  <ChatComponent />
                </div>
              )}
            </>
          )}
        </div>
      </Router>
    </ChatProvider>
  );
};

export default App;
