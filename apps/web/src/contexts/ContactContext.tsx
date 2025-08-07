import { createContext, useContext, useState, useEffect } from "react";
import { type ContextProvider, type User } from "../types";

type ContactContextTypes = {
  users: Array<User> | [],
  setUsers: (arg: Array<User>) => void
}

const ContactContext = createContext<ContactContextTypes | null>(null);

const ContactContextProvider = ({ children }: ContextProvider) => {
  const [users, setUsers] = useState<Array<User>>([]);

  return (
    <ContactContext.Provider value={{ users, setUsers }}>
      {children}
    </ContactContext.Provider>
  )
}

export const useContactContext = () => {
  const val = useContext(ContactContext);

  if (val == undefined) {
    throw new Error("Context is undefined");
  }

  return val;
}

export default ContactContextProvider;
