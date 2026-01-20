"use client"

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2, LogOut, Images, ChevronDown, Pencil, X, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [produtos, setProdutos] = useState<any[]>([])
  const [sugestoesCategorias, setSugestoesCategorias] = useState<string[]>([])
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const router = useRouter()
  const sugestaoRef = useRef<HTMLDivElement>(null)

  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [descricao, setDescricao] = useState('')
  const [categoria, setCategoria] = useState('')
  const [imagens, setImagens] = useState<FileList | null>(null)

  useEffect(() => {
    const inicializar = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      await carregarDados()
    }
    inicializar()
  }, [router])

  async function carregarDados() {
    const { data } = await supabase.from('produtos').select('*').order('criado_at', { ascending: false })
    if (data) {
      setProdutos(data)
      const cats = Array.from(new Set(data.map(p => p.categoria).filter(Boolean))) as string[]
      setSugestoesCategorias(cats)
    }
  }

  function prepararEdicao(p: any) {
    setEditandoId(p.id); setNome(p.nome); setPreco(p.preco.toString()); setDescricao(p.descricao); setCategoria(p.categoria)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelarEdicao() {
    setEditandoId(null); setNome(''); setPreco(''); setDescricao(''); setCategoria(''); setImagens(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      let urls: string[] = []
      if (imagens && imagens.length > 0) {
        for (let i = 0; i < imagens.length; i++) {
          const file = imagens[i]
          const fileName = `${Date.now()}-${file.name}`
          const { data: uploadData } = await supabase.storage.from('produtos').upload(fileName, file)
          if (uploadData) {
            const { data: { publicUrl } } = supabase.storage.from('produtos').getPublicUrl(fileName)
            urls.push(publicUrl)
          }
        }
      }

      const dados: any = { nome, preco: parseFloat(preco), descricao, categoria: categoria.trim() }
      if (urls.length > 0) { dados.imagem_url = urls[0]; dados.galeria = urls }

      if (editandoId) await supabase.from('produtos').update(dados).eq('id', editandoId)
      else await supabase.from('produtos').insert([dados])

      cancelarEdicao(); await carregarDados()
      alert("Acervo atualizado!")
    } catch (error) { alert("Erro ao processar") } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#dfdbcc] p-4 md:p-8 text-black font-sans text-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-black pb-4">
          <Link href="/" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black hover:text-[#916749] transition-all">
            <ArrowLeft size={14}/> Voltar ao Site
          </Link>
          <h1 className="text-xl font-bold uppercase tracking-[0.3em] text-black text-center">Gestão Haras do Sul</h1>
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="text-[10px] font-bold uppercase text-black hover:text-red-600 transition-all flex items-center gap-2">
            <LogOut size={14}/> Sair
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-5 bg-white p-8 shadow-2xl border-t-8 border-black">
            <div className="flex justify-between mb-8 uppercase font-serif italic font-bold">
              <h2 className="text-lg">{editandoId ? 'Editar Artigo' : 'Novo Registro'}</h2>
              {editandoId && <button onClick={cancelarEdicao} className="text-red-500 flex items-center gap-1 text-[10px] font-bold"><X size={14}/> Cancelar</button>}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-black tracking-widest">Nome da Peça</label>
                <input 
                  type="text" required value={nome} onChange={(e) => setNome(e.target.value)} 
                  className="w-full p-3 border border-black text-black focus:outline-[#916749] bg-white font-medium" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 relative" ref={sugestaoRef}>
                   <label className="text-[9px] font-bold uppercase text-black tracking-widest">Categoria</label>
                   <div className="relative">
                    <input 
                      type="text" required value={categoria} onFocus={() => setMostrarSugestoes(true)} onChange={(e) => setCategoria(e.target.value)} 
                      className="w-full p-3 border border-black text-black focus:outline-[#916749] bg-white font-medium pr-10" 
                    />
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-black"/>
                   </div>
                   {mostrarSugestoes && (
                     <div className="absolute z-50 w-full bg-white border border-black shadow-2xl max-h-40 overflow-auto">
                       {sugestoesCategorias.map(c => <button key={c} type="button" onClick={() => {setCategoria(c); setMostrarSugestoes(false)}} className="w-full text-left p-3 hover:bg-[#dfdbcc] text-[10px] uppercase font-bold border-b border-gray-100 text-black">{c}</button>)}
                     </div>
                   )}
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-black tracking-widest">Preço (R$)</label>
                  <input 
                    type="number" step="0.01" required value={preco} onChange={(e) => setPreco(e.target.value)} 
                    className="w-full p-3 border border-black text-black focus:outline-[#916749] bg-white font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-black tracking-widest">Descrição Técnica</label>
                <textarea 
                  value={descricao} onChange={(e) => setDescricao(e.target.value)} 
                  className="w-full p-3 border border-black text-black focus:outline-[#916749] bg-white font-medium" rows={4} 
                />
              </div>

              <label className="flex flex-col items-center p-8 border-2 border-dashed border-black cursor-pointer hover:bg-gray-50 transition-all">
                <Images size={28} className="text-black mb-2 opacity-70"/>
                <span className="text-[10px] font-bold uppercase text-black">{imagens ? `${imagens.length} arquivos selecionados` : 'Carregar Fotos'}</span>
                <input type="file" multiple className="hidden" onChange={(e) => setImagens(e.target.files)} />
              </label>

              <button type="submit" disabled={loading} className="w-full bg-black text-white p-5 font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-lg">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : editandoId ? 'Salvar Alterações' : 'Registrar Peça'}
              </button>
            </form>
          </section>

          <section className="lg:col-span-7 bg-white p-8 shadow-2xl border-t-8 border-black">
            <h2 className="text-lg font-bold mb-8 uppercase italic font-serif">Acervo Ativo</h2>
            <div className="space-y-4 max-h-[700px] overflow-auto pr-4 scrollbar-thin scrollbar-thumb-black">
              {produtos.map(p => (
                <div key={p.id} className="flex items-center gap-4 p-4 border border-black bg-[#fcfbf9]">
                  <img src={p.imagem_url} className="w-14 h-14 object-cover border border-black" alt="" />
                  <div className="flex-1">
                    <p className="font-bold uppercase text-[11px] tracking-tight text-black">{p.nome}</p>
                    <p className="text-black text-[9px] font-bold uppercase opacity-60">{p.categoria} — R$ {p.preco}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => prepararEdicao(p)} className="p-2 text-black hover:scale-110 transition-transform"><Pencil size={18}/></button>
                    <button onClick={async () => { if(confirm("Excluir item?")) { await supabase.from('produtos').delete().eq('id', p.id); carregarDados() } }} className="p-2 text-black hover:text-red-600 transition-colors"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}