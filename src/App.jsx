import { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import ChatWindow from './components/ChatWindow';
import HandoffSummary from './components/HandoffSummary';
import { useChat } from './hooks/useChat';
import { useFontSize } from './hooks/useFontSize';

function AppContent() {
  const {
    messages,
    isLoading,
    phase,
    quickReplies,
    startChat,
    sendMessage,
    generateHandoff,
    backToChat,
    resetChat,
  } = useChat();

  const { sizeLabel, cycle } = useFontSize();
  const [handoffData, setHandoffData] = useState(null);

  const handleQuickReply = async (text) => {
    if (text === 'Show me a summary for my doctor') {
      const data = await generateHandoff();
      if (data) setHandoffData(data);
      return;
    }
    sendMessage(text);
  };

  const handleSend = (text) => {
    const lower = text.toLowerCase();
    if (
      lower.includes('show me a summary') ||
      lower.includes('show summary') ||
      lower.includes("i'm done") ||
      lower.includes('im done')
    ) {
      generateHandoff().then((data) => {
        if (data) setHandoffData(data);
      });
      return;
    }
    sendMessage(text);
  };

  const handleRestart = () => {
    setHandoffData(null);
    resetChat();
  };

  return (
    <div className="h-full flex flex-col bg-offwhite max-w-2xl mx-auto shadow-sm">
      <Header
        showRestart={phase !== 'welcome'}
        onRestart={handleRestart}
        fontSizeLabel={sizeLabel}
        onCycleFont={cycle}
      />

      {phase === 'welcome' && <WelcomeScreen onSelectRole={startChat} />}

      {phase === 'chat' && (
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          quickReplies={quickReplies}
          onSend={handleSend}
          onQuickReply={handleQuickReply}
        />
      )}

      {phase === 'summary' && handoffData && (
        <HandoffSummary
          providerSummary={handoffData.providerSummary}
          patientSummary={handoffData.patientSummary}
          onBack={backToChat}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
