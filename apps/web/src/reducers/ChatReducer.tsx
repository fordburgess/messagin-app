import { type Chat, type Message, type ChatReducerState, type ChatAction } from "../types";


export const chatReducer = (state: ChatReducerState, action: ChatAction): ChatReducerState => {
  switch (action.type) {
    case "SET_ALL_CHATS": {

      var currChat = null;
      if (!localStorage.getItem('currentChat')) {
        const currId = action.payload[0].id;
        localStorage.setItem('currentChat', currId);
        currChat = action.payload.find((chat: Chat) => chat.id == currId);
      }
      else {
        currChat = action.payload.find((chat: Chat) => chat.id == localStorage.getItem('currentChat'));
      }

      return {
        ...state,
        allChats: action.payload,
        currentChat: currChat || null,
      }
    }

    case "ADD_MESSAGE": {
      const updatedChats = state.allChats.map((chat: Chat) => {
        if (chat.id == action.payload.chat_id) {
          return {
            ...chat,
            messages: [...chat.messages, action.payload]
          }
        }

        return chat
      });

      const updatedCurrentChat: Chat | null =
        state.currentChat?.id === action.payload.chat_id ?
        { ...state.currentChat, messages: [...state.currentChat.messages, action.payload] }
        :
        state.currentChat;

      return {
        ...state,
        allChats: updatedChats,
        currentChat: updatedCurrentChat
      }
    }

    case "CREATE_NEW_CHAT": {
      return {
        ...state,
        allChats: [...state.allChats, action.payload],
        currentChat: action.payload
      }
    }

    case "SET_CURRENT_CHAT": {
      localStorage.setItem('currentChat', action.payload.id);

      return {
        ...state,
        allChats: state.allChats,
        currentChat: action.payload
      }
    }

    default:
      return state
  }
}
