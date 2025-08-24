import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../store/auth'

export default function Messages(){
  const { jobId, userId } = useParams() // applicant id
  const [items,setItems] = useState([])
  const [text,setText] = useState('')
  const [chatOpen,setChatOpen] = useState(false)
  const [status,setStatus] = useState('')
  const { user } = useAuth()
  const bottomRef = useRef(null)

  async function load(){
    const res = await api.get('/messages/thread', { params: { jobId, applicantId: userId } })
    setItems(res.data.items)
    setChatOpen(!!res.data.chatOpen)
    setStatus(res.data.status)
    setTimeout(()=> bottomRef.current?.scrollIntoView({ behavior:'smooth' }), 100)
  }
  useEffect(()=>{ load() },[jobId, userId])

  async function send(){
    if(!text.trim()) return
    try{
      await api.post('/messages/send', { jobId, applicantId: userId, text })
      setText('')
      await load()
    }catch(e){
      alert(e?.response?.data?.error || 'Unable to send')
    }
  }

  const isApplicant = user && user.id === userId

  return (
    <div className="grid gap-3">
      <h2 className="text-2xl font-semibold">Messages</h2>
      <div className="text-sm opacity-70">Application status: {status} • {chatOpen ? "Chat Open" : "Chat Locked"}</div>
      <div className="card h-[60vh] overflow-y-auto">
        {items.map(m=> <div key={m._id} className={`my-1 flex ${m.sender===user?.id ? 'justify-end' : 'justify-start'}`}>
          <div className={`px-3 py-2 rounded-2xl ${m.sender===user?.id ? 'bg-black text-white' : 'bg-slate-100'}`}>
            <div className="text-sm">{m.text}</div>
            <div className="text-[10px] opacity-70">{new Date(m.createdAt).toLocaleString()}</div>
          </div>
        </div>)}
        <div ref={bottomRef} />
      </div>
      <div className="card flex gap-2">
        <input className="input" placeholder={chatOpen || !isApplicant ? "Type a message" : "Chat locked until employer initiates or shortlists"} value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=> e.key==='Enter' && send() } disabled={isApplicant && !chatOpen} />
        <button className="btn btn-primary" onClick={send} disabled={isApplicant && !chatOpen}>Send</button>
      </div>
    </div>
  )
}
