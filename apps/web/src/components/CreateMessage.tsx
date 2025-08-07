import React, { useRef } from 'react'
import Microphone from '../assets/microphone.png';
import { useChatContext } from '../contexts/ChatContext';
import { NewMessage } from '../api/NewMessage';
import { useAuthContext } from '../contexts/AuthContext';
import { trpc } from '../utils/trpc'

const CreateMessage = () => {
  const { state, dispatch} = useChatContext();
  const authContext = useAuthContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const mutation = trpc.newMessage.useMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const message = inputRef.current?.value;

    if (message && authContext.userId && state.currentChat) {
      // const result = await NewMessage(message, authContext.userId, state.currentChat.id);
      mutation.mutate(
        { message, userId: authContext.userId.toString(), chatId: state.currentChat.id.toString() },
        {
          onSuccess: (data) => {
            if (inputRef.current) inputRef.current.value = '';
            dispatch({ type: 'ADD_MESSAGE', payload: { chat_id: state.currentChat.id, message, sender_id: authContext.userId, time_sent: data.timeSent  }})
          },
          onError: (error) => {
            console.error('Login failed:', error.message);
          },
        }
      )
    }
  }


  return (
    <div
      className='w-full p-4 fixed bottom-0 flex items-center bg-stone-900 box-border'
      style={{
        overflow: "hidden",
        width: 'inherit'
      }}
    >
      <img src={Microphone} alt="speech-to-text-mic" />
      <form onSubmit={handleSubmit} className='flex items-center'  style={{ flex: 1 }}>
        <input ref={inputRef} type="text" name="message" className='mr-2 w-full'/>
        <input type="submit" value="Send" id="message-submit"/>
      </form>
    </div>
  )
}

export default CreateMessage
