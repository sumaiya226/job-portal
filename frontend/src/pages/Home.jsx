import React, { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { Link } from 'react-router-dom'

export default function Home(){
  const [q,setQ] = useState('')
  const [location,setLocation] = useState('')
  const [type,setType] = useState('')
  const [items,setItems] = useState([])

  async function search(){
    const res = await api.get('/jobs', { params: { q, location, type } })
    setItems(res.data.items)
  }

  useEffect(()=>{ search() },[])

  return (
    <div className="grid gap-4">
      <div className="card grid md:grid-cols-4 gap-2">
        <input className="input" placeholder="Keywords" value={q} onChange={e=>setQ(e.target.value)} />
        <input className="input" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} />
        <select className="input" value={type} onChange={e=>setType(e.target.value)}>
          <option value="">Any type</option>
          <option>full-time</option><option>part-time</option><option>internship</option><option>remote</option><option>contract</option>
        </select>
        <button className="btn btn-primary" onClick={search}>Search</button>
      </div>

      <div className="grid gap-3">
        {items.map(j=> <Link key={j._id} to={`/jobs/${j._id}`} className="card block">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{j.title}</div>
              <div className="text-sm text-slate-600">{j.location} • {j.type}</div>
            </div>
            {!j.active && <span className="badge">Closed</span>}
          </div>
        </Link>)}
        {items.length===0 && <div className="card">No jobs found.</div>}
      </div>
    </div>
  )
}
