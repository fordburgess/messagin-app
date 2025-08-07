import React from 'react'
import { Routes, Route } from 'react-router'
import Home from '../features/Home'
import Login from '../features/Login';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />} >
        <Route path='/' element={<Home />}/>
      </Route>
    </Routes>
  )
}

export default AppRoutes
