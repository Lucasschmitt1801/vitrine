"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) alert("Acesso negado: Verifique suas credenciais.")
    else router.push('/admin')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#dfdbcc] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#916749] mb-6 hover:text-black transition-all">
          <ArrowLeft size={14}/> Voltar para a Vitrine
        </Link>
        
        <div className="bg-white p-10 shadow-2xl border-t-8 border-[#916749]">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-serif font-bold uppercase tracking-[0.2em] text-[#916749] mb-2">Haras do Sul</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 italic">Área Administrativa</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase text-[#ab8d6f] tracking-widest">E-mail de Acesso</label>
              <input type="email" required className="w-full p-4 border border-[#dfdbcc] focus:outline-[#916749] bg-[#fcfbf9]" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase text-[#ab8d6f] tracking-widest">Senha</label>
              <input type="password" required className="w-full p-4 border border-[#dfdbcc] focus:outline-[#916749] bg-[#fcfbf9]" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-black text-white p-5 font-bold uppercase tracking-[0.3em] hover:bg-[#916749] transition-all shadow-lg flex justify-center">
              {loading ? <Loader2 className="animate-spin" /> : "Autenticar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}