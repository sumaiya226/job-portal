import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function Navbar(){
  const { user, logout } = useAuth()
  const nav = useNavigate()
  return (
    <div className="border-b bg-white">
      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="font-semibold text-lg">TalentHive</Link>
        <div className="flex items-center gap-2">
          <Link className="navlink" to="/jobs">Jobs</Link>
          {user?.role==='employer' && <Link className="navlink" to="/post-job">Post Job</Link>}
          {user && <Link className="navlink" to="/dashboard">Dashboard</Link>}
          {!user ? <>
            <Link className="navlink" to="/login">Login</Link>
            <Link className="navlink" to="/register">Register</Link>
          </> : <button className="btn" onClick={()=>{ logout(); nav('/'); }}>Logout</button>}
        </div>
      </div>
    </div>
  )
}
