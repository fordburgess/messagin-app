import React, { useRef, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import CreateMessage from './CreateMessage';
import MessageBox from './MessageBox';
import { type Chat } from '../types';
import "../index.css";

type ChatInterfaceProps = {
  currentChat: Chat
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentChat }) => {
  const authContext = useAuthContext();
  const bottomRef = useRef(null);

  const contact = currentChat.participants.find((participant: User) => participant.id !== authContext.userId);

  const handleBack = () => {
    const chatInterface = document.getElementById("chat-interface-container");
    const chatBoxColumn = document.getElementById("chatbox-column");

    if (chatInterface && chatBoxColumn) {
      chatInterface.classList.remove('active');
      chatInterface.classList.add('inactive');

      chatBoxColumn.classList.remove('inactive');
      chatBoxColumn.classList.add('active');
    }
  }

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [currentChat.messages])

  return (
    <div id='chat-interface-container' className='chat-inferface-container inactive h-full w-full md:w-3/4 relative box-border'>
      <div className='fixed top-0 bg-stone-900 w-full py-2 px-5 flex justify-between'>
        <p className='chat-close-button' onClick={() => handleBack()}>Back</p>
        <p><strong>{contact.name}</strong></p>
      </div>
      {
        currentChat ? (
          <div className='flex flex-col justify-flex-end' style={{ height: '100%', overflowY: 'scroll', padding: '15px 15px 70px 15px' }}>
            {
              currentChat.messages.map((message) => {
                const sentOrReceived = message.sender_id == authContext.userId;

                return (
                  <MessageBox
                    message={message.message}
                    sender_id={message.sender_id}
                    time_sent={message.time_sent}
                    sentOrReceived={sentOrReceived}
                    key={message.time_sent}
                  />
                )
              })
            }
            <div ref={bottomRef}/>
          </div>
        ) : (
          <div className='h-full w-full flex justify-center items-center'>
            <p>No Chat Selected</p>
          </div>
        )
      }
      {
        currentChat ? (
          <CreateMessage />
        ) : (
          <div className='h-full w-full flex justify-center items-center'>
            <p>No Chat Selected</p>
          </div>
        )
      }
    </div>
  )
}

export default ChatInterface
