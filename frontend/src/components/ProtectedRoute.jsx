import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function ProtectedRoute({ children, roles }){
  const { token, user } = useAuth()
  if(!token) return <Navigate to="/login" replace />
  if(roles && user && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}
