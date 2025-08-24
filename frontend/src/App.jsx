import React, { useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PostJob from './pages/PostJob'
import JobDetail from './pages/JobDetail'
import Applicants from './pages/Applicants'
import Messages from './pages/Messages'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './store/auth'

export default function App(){
  const { token, user, fetchMe } = useAuth()
  useEffect(()=>{ if(token && !user) fetchMe() },[token])
  return (
    <div>
      <Navbar />
      <div className="container py-6">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/jobs" element={<Home/>} />
          <Route path="/jobs/:id" element={<JobDetail/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="/post-job" element={<ProtectedRoute roles={['employer','admin']}><PostJob/></ProtectedRoute>} />
          <Route path="/applicants/:jobId" element={<ProtectedRoute roles={['employer','admin']}><Applicants/></ProtectedRoute>} />
          <Route path="/messages/:jobId/:userId" element={<ProtectedRoute><Messages/></ProtectedRoute>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </div>
    </div>
  )
}
