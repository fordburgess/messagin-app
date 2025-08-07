import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import AppRoutes from './routes/AppRoutes.tsx';
import ChatContextProvider from './contexts/ChatContext.tsx';
import AuthContextProvider from './contexts/AuthContext.tsx';
import SocketContextProvider from './contexts/SocketContext.tsx';
import ContactContextProvider from './contexts/ContactContext.tsx';
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, trpcClient } from './utils/trpc';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <StrictMode>
          <AuthContextProvider>
            <ContactContextProvider>
              <ChatContextProvider>
                <SocketContextProvider>
                  <AppRoutes />
                </SocketContextProvider>
              </ChatContextProvider>
            </ContactContextProvider>
          </AuthContextProvider>
        </StrictMode>
      </BrowserRouter>
    </QueryClientProvider>
  </trpc.Provider>
)
