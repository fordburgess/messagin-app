import React, { useState, useEffect } from 'react'
import { type Chat, type User } from '../types'
import ChatBox from './ChatBox'
import Plus from '../assets/plus-button.png';
import xIcon from '../assets/x-icon.png';
import { useChatContext } from '../contexts/ChatContext'
import { useContactContext } from '../contexts/ContactContext';
import { useAuthContext } from '../contexts/AuthContext';
import { trpc } from '../utils/trpc';

type ChatsColumnProps = {
  chats: Array<Chat>
}

const ChatsColumn: React.FC<ChatsColumnProps> = ({ chats }) => {
  const { state, dispatch } = useChatContext();
  const { users } = useContactContext();
  const { userId } = useAuthContext();
  const [displayMenu, setDisplayMenu] = useState<boolean>(false);

  const mutation = trpc.newChat.useMutation();

  const handleClick = async (user: User) => {

    setDisplayMenu(prev => !prev);

    if (userId) {
      mutation.mutate(
        { senderId: userId, recipientProfile: { id: user.id.toString(), name: user.name, username: user.username } },
        {
          onSuccess: (data) => {
            dispatch({ type: 'CREATE_NEW_CHAT', payload: data })
          },
          onError: (error) => {
            console.log(error)
          }
        }
      )
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.reload();
  }

  useEffect(() => {
    console.log(state.allChats)
  }, [state.allChats])

  return (
    <>
      <div id="chatbox-column" className='h-full w-full md:w-1/4 border-r border-stone-500 box-border'>
        <button className='fixed bottom-2 left-2' onClick={() => handleLogout()}>Log Out</button>
        <div className='flex justify-between items-center p-2'>
          <h1 style={{ fontSize: '1.5rem' }}>Chats</h1>
          <img
            src={Plus}
            className='hover:cursor-pointer'
            style={{ height: '25px', width: '25px' }}
            alt='plus'
            onClick={() => setDisplayMenu(prev => !prev)}
          />
        </div>
        <div className='px-2 mb-2'>
          <input type="text" placeholder='Search' />
        </div>
        <div>
          {
            state.allChats && state.allChats.length > 0 ? (
              state.allChats.map((chat: Chat) => {
                return (
                  <ChatBox chatId={chat.id} key={chat.id}/>
                )
              })
            ) : (
              <div className='flex flex-col justify-start items-center pt-5'>
                <span className='loader mb-2'></span>
                <p>Loading Chats</p>
              </div>
            )
          }
        </div>
      </div>
      <div className={`contact-menu h-full w-full md:w-1/4 p-5 bg-stone-900 box-border overflow-hidden ${displayMenu ? 'expanded' : ''}`}>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-xl'>Start New Chat</h1>
          <img
            src={xIcon}
            alt='x-icon'
            style={{ height: '25px', width: '25px' }}
            onClick={() => setDisplayMenu(prev => !prev)}
          />
        </div>
        <ul className='h-full overflow-y-scroll'>
          {
            users.length > 0 && (
              users.map((user: User) => {

                if (user.id !== userId) {
                  return (
                    <li onClick={() => handleClick(user)} className='mb-2 rounded-sm p-2'>
                      <h2 className='text-base'>{user.username}</h2>
                      <p>{user.name}</p>
                    </li>
                  )
                }
              })
            )
          }
        </ul>
      </div>
    </>
  )
}

export default ChatsColumn
