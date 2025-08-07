import { useEffect } from 'react';
import '../App.css'
import ChatsColumn from '../components/ChatsColumn';
import ChatInterface from '../components/ChatInterface';
import { useChatContext } from '../contexts/ChatContext';
import { useAuthContext } from '../contexts/AuthContext';
import { useContactContext } from '../contexts/ContactContext';
import { GetAllData } from '../api/GetAllData';
import { ToastContainer } from 'react-toastify';
import { trpc } from '../utils/trpc'

function Home() {
  const authContext = useAuthContext();
  const contactContext = useContactContext();
  const { state, dispatch } = useChatContext();
  const allDataQuery = trpc.getAllData.useQuery(authContext.userId?.toString() ?? '', {
    enabled: !!authContext.userId,
  });

  useEffect(() => {
    if (allDataQuery.isSuccess) {
      console.log(allDataQuery.data)
      const chatData = allDataQuery.data.chatData;
      const userData = allDataQuery.data.users;
      if (userData) contactContext.setUsers(userData);

      dispatch({ type: 'SET_ALL_CHATS', payload: chatData });
    }
  }, [allDataQuery.isSuccess, allDataQuery.data])

  return (
    <div className='w-screen h-full flex flex-start'>
      <ToastContainer
        position='top-center'
        toastStyle={{ backgroundColor: '#cacaca' }}
        toastClassName={'dark-toast'}
        hideProgressBar={true}
      />
      <ChatsColumn chats={state.allChats} />
      {
        state.currentChat && (
          <ChatInterface currentChat={state.currentChat} />
        )
      }
    </div>
  )
}

export default Home
