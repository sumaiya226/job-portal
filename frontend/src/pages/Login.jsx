import React, { useState } from 'react'
import { useAuth } from '../store/auth'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const { login } = useAuth()
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    await login(email,password)
    nav('/dashboard')
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto card grid gap-3">
      <h2 className="text-2xl font-semibold">Login</h2>
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="btn btn-primary">Login</button>
    </form>
  )
}
