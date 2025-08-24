import React, { useState } from 'react'
import { useAuth } from '../store/auth'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [role,setRole] = useState('seeker')
  const { register } = useAuth()
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    await register({ name,email,password, role })
    nav('/dashboard')
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto card grid gap-3">
      <h2 className="text-2xl font-semibold">Create account</h2>
      <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <select className="input" value={role} onChange={e=>setRole(e.target.value)}>
        <option value="seeker">Job Seeker</option>
        <option value="employer">Employer</option>
      </select>
      <button className="btn btn-primary">Register</button>
    </form>
  )
}
