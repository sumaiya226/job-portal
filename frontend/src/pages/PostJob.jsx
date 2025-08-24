import React, { useState } from 'react'
import { api } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function PostJob(){
  const [form,setForm] = useState({ title:'', location:'', type:'full-time', description:'', skills:'' })
  const [success,setSuccess] = useState(null)
  const nav = useNavigate()
  function upd(k,v){ setForm(s=>({ ...s, [k]:v })) }
  async function submit(){
    const payload = { ...form, skills: form.skills.split(',').map(s=>s.trim()).filter(Boolean) }
    const res = await api.post('/jobs', payload)
    setSuccess('Job posted successfully!')
    setTimeout(()=> nav(`/jobs/${res.data.job._id}`), 600)
  }
  return (
    <div className="max-w-2xl mx-auto card grid gap-3">
      <h2 className="text-2xl font-semibold">Post a Job</h2>
      {success && <div className="p-3 rounded-xl bg-green-100 text-green-800">{success}</div>}
      <input className="input" placeholder="Title" value={form.title} onChange={e=>upd('title',e.target.value)} />
      <input className="input" placeholder="Location" value={form.location} onChange={e=>upd('location',e.target.value)} />
      <select className="input" value={form.type} onChange={e=>upd('type',e.target.value)}>
        <option>full-time</option><option>part-time</option><option>internship</option><option>remote</option><option>contract</option>
      </select>
      <textarea className="input h-40" placeholder="Description" value={form.description} onChange={e=>upd('description',e.target.value)} />
      <input className="input" placeholder="Skills (comma separated)" value={form.skills} onChange={e=>upd('skills',e.target.value)} />
      <button className="btn btn-primary" onClick={submit}>Publish</button>
    </div>
  )
}
