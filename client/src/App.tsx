import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import BuilderPage from './pages/BuilderPage';
import './styles/globals.css';

type AppView = 'landing' | 'builder';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage
          onGetStarted={() => setCurrentView('builder')}
        />
      ) : (
        <BuilderPage
          onBack={() => setCurrentView('landing')}
        />
      )}
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
        }}
      />
    </>
  );
}

export default App;
