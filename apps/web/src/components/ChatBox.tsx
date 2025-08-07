import React, { useEffect } from 'react'
import { type User } from '../types'
import { useAuthContext } from '../contexts/AuthContext';
import DefaultPFP from '../assets/default-pfp.png';
import { useChatContext } from '../contexts/ChatContext';

type ChatBoxProps = {
  chatId: number | string
}

const ChatBox: React.FC<ChatBoxProps> = ({ chatId }) => {
  const { userId } = useAuthContext();
  const { state, dispatch } = useChatContext();

  const chat = state.allChats.find((chat) => chat.id == chatId);

  if (!chat) return null;

  const lastMessage = chat.messages[chat.messages.length - 1]?.message || "Send a message";
  const contact = chat.participants.find((participant: User) => participant.id !== userId);

  const handleClick = () => {
    const chatInterface = document.getElementById("chat-interface-container");
    const chatBoxColumn = document.getElementById("chatbox-column");

    if (chatInterface && chatBoxColumn) {
      chatInterface.classList.add('active');
      chatInterface.classList.remove('inactive');

      chatBoxColumn.classList.add('inactive');
    }

    dispatch({ type: 'SET_CURRENT_CHAT', payload: chat })
  }

  return (
    <div
      className='w-full max-h-[10%] flex items-center p-2 border-b border-stone-600 box-border hover:cursor-pointer'
      style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
      onClick={() => handleClick()}
    >
      <img
        src={DefaultPFP}
        alt={`${contact?.name}-pfp`}
        className='h-[40px] w-[40px] mr-2'
      />
      <div className='overflow-hidden'>
        <h3 style={{ fontSize: '1rem' }}>{contact?.name}</h3>
        <p className="w-full text-sm overflow-hidden whitespace-nowrap text-ellipsis">
          {lastMessage}
        </p>
      </div>
    </div>
  )
}

export default ChatBox
