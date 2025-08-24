import React, { useEffect, useState } from 'react'
import { useAuth } from '../store/auth'
import { api } from '../lib/api'
import { Link, useNavigate } from 'react-router-dom'

export default function Dashboard(){
  const { user } = useAuth()
  const [stats,setStats] = useState(null)
  const [myJobs,setMyJobs] = useState([])
  const [myApps,setMyApps] = useState([])
  const nav = useNavigate()

  useEffect(()=>{
    (async()=>{
      if(!user) return
      if(user.role){
        const r1 = await api.get('/admin/stats'); setStats(r1.data)
      }
      if(user.role==='employer'){
        const r2 = await api.get('/jobs/mine-with-stats'); setMyJobs(r2.data.items)
      }
      if(user.role==='seeker'){
        const r3 = await api.get('/applications/mine'); setMyApps(r3.data.items)
      }
    })()
  },[user])

  if(!user) return <div className="card">Please login.</div>

  return (
    <div className="grid gap-6">
      <div className="card">
        <h2 className="text-2xl font-semibold">Hello, {user.name} 👋</h2>
        <p className="text-slate-600">Role: {user.role}</p>
      </div>

      {user.role==='employer' && <div className="grid gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">My Posted Jobs</h3>
          <button className="btn btn-primary" onClick={()=>nav('/post-job')}>Post a Job</button>
        </div>
        {myJobs.length===0 && <div className="card">No jobs yet.</div>}
        {myJobs.map(j=> <div key={j._id} className="card flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="font-semibold">{j.title} • {j.location} • {j.type} {j.active ? '' : '• (Closed)'}</div>
            <div className="text-sm text-slate-600">Applicants: {j?.stats?.total||0} • Shortlisted: {j?.stats?.shortlisted||0} • Selected: {j?.stats?.selected||0} • Rejected: {j?.stats?.rejected||0}</div>
          </div>
          <div className="flex gap-2">
            <Link className="btn btn-primary" to={`/applicants/${j._id}`}>View Applicants</Link>
            {j.active && <button className="btn" onClick={async()=>{ await api.post(`/jobs/${j._id}/close`); const res = await api.get('/jobs/mine-with-stats'); setMyJobs(res.data.items); }}>Close Opening</button>}
          </div>
        </div>)}
      </div>}

      {user.role==='seeker' && <div className="grid gap-4">
        <h3 className="text-xl font-semibold">My Applications</h3>
        {myApps.length===0 && <div className="card">No applications yet.</div>}
        {myApps.map(a=> <div key={a._id} className="card flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="font-semibold">{a.job?.title}</div>
            <div className="text-slate-600 text-sm">Status: {a.status.replace('_',' ')}</div>
            <div className="text-slate-600 text-sm">Applied: {new Date(a.createdAt).toLocaleString()}</div>
          </div>
          <div className="flex gap-2 items-center">
            <Link className="underline text-sm" to={`/jobs/${a.job?._id}`}>View Job</Link>
            {a.chatOpen ? <button className="btn" onClick={()=>nav(`/messages/${a.job?._id}/${user.id}`)}>Open Chat</button> : <span className="text-xs text-slate-500">Chat locked</span>}
          </div>
        </div>)}
      </div>}

      {stats && <div className="grid md:grid-cols-3 gap-4">
        <Stat label="Users" value={stats.users}/>
        <Stat label="Jobs" value={stats.jobs}/>
        <Stat label="Applications" value={stats.applications}/>
      </div>}
    </div>
  )
}

function Stat({label,value}){
  return <div className="card text-center">
    <div className="text-3xl font-semibold">{value}</div>
    <div className="text-slate-600">{label}</div>
  </div>
}
