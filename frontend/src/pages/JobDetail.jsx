import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../store/auth'

export default function JobDetail(){
  const { id } = useParams()
  const [job,setJob] = useState(null)
  const [coverLetter,setCoverLetter] = useState('')
  const [resumeUrl,setResumeUrl] = useState('')
  const { user } = useAuth()

  useEffect(()=>{ (async()=>{
    const res = await api.get(`/jobs/${id}`); setJob(res.data.job)
  })() },[id])

  async function uploadResume(e){
    const file = e.target.files[0]
    const form = new FormData(); form.append('file', file)
    const res = await api.post('/uploads/resume', form, { headers: { 'Content-Type':'multipart/form-data' } })
    setResumeUrl(res.data.url)
  }
  async function apply(){
    await api.post('/applications', { jobId: id, coverLetter, resumeUrl })
    alert('Applied!')
  }
  async function closeJob(){
    await api.post(`/jobs/${id}/close`)
    const res = await api.get(`/jobs/${id}`); setJob(res.data.job)
  }

  if(!job) return null
  const isOwner = user && (user.role==='admin' || user.id === (job.postedBy?._id || job.postedBy))

  return (
    <div className="grid gap-4">
      <div className="card">
        <h2 className="text-2xl font-semibold">{job.title} {job.active ? '' : '• (Closed)'}</h2>
        <p className="text-slate-600">{job.location} • {job.type}</p>
        <p className="mt-3 whitespace-pre-line">{job.description}</p>
        <div className="mt-3 flex gap-2">{(job.skills||[]).map(s=> <span key={s} className="badge">{s}</span>)}</div>
        {isOwner && <div className="mt-4 flex gap-2">
          {job.active && <button className="btn" onClick={closeJob}>Close Opening</button>}
          <Link className="btn btn-primary" to={`/applicants/${job._id}`}>View Applicants</Link>
        </div>}
      </div>
      {user?.role==='seeker' && job.active && <div className="card grid gap-3">
        <h3 className="text-lg font-semibold">Apply to this job</h3>
        <textarea className="input h-32" placeholder="Cover letter" value={coverLetter} onChange={e=>setCoverLetter(e.target.value)} />
        <input type="file" onChange={uploadResume} />
        {resumeUrl && <a className="underline text-sm" href={resumeUrl} target="_blank">Uploaded resume</a>}
        <button className="btn btn-primary" onClick={apply}>Submit Application</button>
      </div>}
    </div>
  )
}
