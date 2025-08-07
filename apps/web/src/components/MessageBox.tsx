import React from 'react'
import { type Message } from '../types'

const MessageBox: React.FC<Message> = ({ message, sentOrReceived, time_sent }) => {

  const readableDate = (dateString: string) => {
    const localDate = new Date(dateString).toLocaleString();
    const today = new Date();

    let timeString = '';

    const hour = new Date(localDate).getHours();
    const minute = new Date(localDate).getMinutes();

    if (new Date(localDate).getDate() !== today.getDate()) {
      const month = new Date(localDate).toLocaleString('default', { month: 'long' });
      timeString = `${month} ${new Date(localDate).getDate()}, ${hour}:${minute}`
    }
    else {
      timeString = `${hour}:${minute}`;
    }

    return timeString;
  }

  return (
    <div className={`
      max-w-3/4 ${sentOrReceived ? 'sentMessage' : 'receivedMessage'} rounded-sm p-2 mb-5 text-sm
    `}
    >
      <p style={{ fontSize: '0.85rem' }}>{message}</p>
      <p style={{ fontSize: '0.75rem', textAlign: `${sentOrReceived ? 'right' : 'left'}` }}>{readableDate(time_sent)}</p>
    </div>
  )
}

export default MessageBox
