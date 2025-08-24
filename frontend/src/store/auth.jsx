import { create } from 'zustand'
import { api } from '../lib/api'

export const useAuth = create((set,get)=>({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  setUser: (user)=> set({ user }),
  login: async (email,password)=>{
    const res = await api.post('/auth/login',{ email,password })
    localStorage.setItem('token', res.data.token)
    set({ token: res.data.token, user: res.data.user })
    return res.data.user
  },
  register: async (payload)=>{
    const res = await api.post('/auth/register', payload)
    localStorage.setItem('token', res.data.token)
    set({ token: res.data.token, user: res.data.user })
    return res.data.user
  },
  fetchMe: async ()=>{
    const res = await api.get('/auth/me')
    set({ user: res.data.user })
  },
  logout: ()=> { localStorage.removeItem('token'); set({ user:null, token:null }) }
}))
