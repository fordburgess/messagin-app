import React, { useState } from 'react'
import { Authenticate } from '../api/Authenticate';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from "react-router";
import { trpc } from '../utils/trpc'
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const authContext = useAuthContext();
  const navigate = useNavigate();

  const mutation = trpc.authenticate.useMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    setError(null);
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username');
    const password = formData.get('password');

    if (username && password && username.toString().trim() !== '' && password.toString().trim() !== '') {

      mutation.mutate(
        { username: username.toString(), password: password.toString() },
        {
          onSuccess: (data) => {
            const token: string = data.token;
            const decodedToken = jwtDecode(token);

            console.log(decodedToken)
            authContext.setUserId(decodedToken.id);
            authContext.setUserName(decodedToken.username);
            authContext.setIsAuthenticated(true);
            localStorage.setItem('authToken', token);
            navigate('/');
          },
          onError: (error) => {
            console.error('Login failed:', error.message);
          },
        }
      );
    }
    else {
      setLoading(false);
      setError('Please enter a username and password');
    }
  }

  return (
    <div className='h-full p-5 flex justify-center items-center'>
      <form onSubmit={handleSubmit} className='w-full md:w-[20%] text-center'>
        <h1 style={{fontSize: '2rem'}}>Log In</h1>
        <div className='mb-5 text-left'>
          <label>Username</label>
          <input type="text" name="username" />
        </div>
        <div className='mb-5 text-left'>
          <label>Password</label>
          <input type="password" name="password" />
        </div>
        {
          loading ? (
            <span className="loader"></span>
          ) : (
            <input type='submit' className='mb-5' />
          )
        }
        {
          error && (
            <p className="text-red-600">{error}</p>
          )
        }
      </form>
    </div>
  )
}

export default Login
