import { createContext, useContext, useState, useEffect } from "react";
import { type ContextProvider } from "../types";
import { jwtDecode } from "jwt-decode";

type AuthContextTypes = {
  isAuthenticated: boolean,
  setIsAuthenticated: (arg: boolean) => void,
  isLoading: boolean,
  userName: string | null,
  setUserName: (arg: string) => void,
  userId: number | null,
  setUserId: (arg: number) => void
}

const AuthContext = createContext<AuthContextTypes | null>(null);

const AuthContextProvider = ({ children }: ContextProvider) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
      const decoded = jwtDecode(token);
      setUserName(decoded.username);
      setUserId(decoded.id);
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, [])

  const values = {
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    userName,
    setUserName,
    userId,
    setUserId
  }

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const val = useContext(AuthContext);

  if (val == undefined) {
    throw new Error("Context is undefined");
  }

  return val;
}

export default AuthContextProvider;
