import { createContext, useContext, useReducer, useEffect } from "react";
import { type ContextProvider, type Chat, type ChatReducerState, type ChatAction } from "../types";
import { chatReducer } from "../reducers/ChatReducer";

const initialState: ChatReducerState = {
  allChats: [],
  currentChat: null,
}

const ChatContext = createContext<{
  state: ChatReducerState,
  dispatch: React.Dispatch<ChatAction>
} | null>(null);

const ChatContextProvider = ({ children }: ContextProvider) => {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  return (
    <ChatContext.Provider value={{state, dispatch}}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const val = useContext(ChatContext);

  if (val == undefined) {
    throw new Error("Context is undefined");
  }

  return val;
}

export default ChatContextProvider;
