import type { ReactNode } from "react"

export type Message = {
  message: string,
  time_sent: string,
  sentOrReceived: boolean,
  sender_id: string,
}

export type User = {
  id: number | string,
  name: string,
  username: string,
}

export type Chat = {
  id: number,
  participants: Array<User>,
  messages: Array<Message>,
}

export type ContextProvider = {
  children: ReactNode
}

export type ChatReducerState = {
  currentChat: Chat | null,
  allChats: Chat[]
}

export type ChatAction =
  | { type: 'SET_ALL_CHATS', payload: Chat[] }
  | { type: 'ADD_MESSAGE', payload: { chat_id: number; message: Message, sender_id: number | string, time_sent: string } }
  | { type: 'CREATE_NEW_CHAT', payload: Chat }
  | { type: 'SET_CURRENT_CHAT', payload: Chat }
