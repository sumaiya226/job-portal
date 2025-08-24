import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function Applicants(){
  const { jobId } = useParams()
  const [items,setItems] = useState([])
  const nav = useNavigate()

  async function load(){
    const res = await api.get(`/applications/for-job/${jobId}`)
    setItems(res.data.items)
  }
  useEffect(()=>{ load() },[jobId])

  async function update(id, status){
    await api.put(`/applications/${id}/status`, { status })
    await load()
  }

  return (
    <div className="grid gap-3">
      <h2 className="text-2xl font-semibold">Applicants</h2>
      {items.map(a=> <div key={a._id} className="card">
        <div className="flex flex-col md:flex-row md:justify-between gap-2">
          <div>
            <div className="font-semibold">{a.applicant?.name} • {a.applicant?.email}</div>
            <div className="text-slate-600 text-sm">{(a.applicant?.skills||[]).join(', ')}</div>
            {a.resumeUrl && <a className="underline" href={a.resumeUrl} target="_blank" rel="noreferrer">View Uploaded Resume</a>}
            {a.coverLetter && <p className="mt-2 whitespace-pre-line">{a.coverLetter}</p>}
            <div className="text-xs opacity-70 mt-1">Status: {a.status} {a.chatOpen ? "• Chat Open" : ""}</div>
          </div>
          <div className="flex flex-wrap gap-2 items-start">
            <button className="btn" onClick={()=>nav(`/messages/${jobId}/${a.applicant._id}`)}>Message</button>
            <button className="btn" onClick={()=>update(a._id, 'shortlisted')}>Shortlist</button>
            <button className="btn" onClick={()=>update(a._id, 'selected')}>Accept</button>
            <button className="btn" onClick={()=>update(a._id, 'rejected')}>Reject</button>
          </div>
        </div>
      </div>)}
    </div>
  )
}
