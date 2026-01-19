"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { MessageCircle, ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ProdutoDetalhes() {
  const params = useParams()
  const id = params?.id as string
  
  const [produto, setProduto] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [fotoAtiva, setFotoAtiva] = useState('')

  useEffect(() => {
    const buscarProduto = async () => {
      if (!id) return
      const { data } = await supabase.from('produtos').select('*').eq('id', id).single()
      if (data) {
        setProduto(data)
        setFotoAtiva(data.imagem_url)
      }
      setLoading(false)
    }
    buscarProduto()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-[#dfdbcc] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#916749]" size={40} />
    </div>
  )

  if (!produto) return (
    <div className="min-h-screen bg-[#dfdbcc] flex items-center justify-center p-6">
      <div className="text-center bg-white p-12 shadow-xl border-t-8 border-[#916749]">
        <p className="text-[#916749] font-bold uppercase tracking-widest">Artigo não encontrado.</p>
        <Link href="/" className="text-xs underline mt-4 block font-bold">Voltar ao Acervo</Link>
      </div>
    </div>
  )

  const whatsappUrl = `https://wa.me/5551999321074?text=${encodeURIComponent(
    `Olá Haras do Sul! Vi este artigo no site e gostaria de mais informações: ${produto.nome}`
  )}`

  return (
    <main className="min-h-screen bg-[#dfdbcc] p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[#916749] font-bold mb-8 hover:gap-4 transition-all uppercase text-[10px] tracking-[0.2em]">
          <ChevronLeft size={16} /> Voltar para o Acervo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white shadow-2xl border border-[#ab8d6f]/20">
          <div className="lg:col-span-7 bg-[#fcfbf9] p-4 md:p-8 border-r border-[#dfdbcc]">
            <div className="aspect-square w-full overflow-hidden bg-white border border-[#dfdbcc] shadow-inner mb-4">
              <img src={fotoAtiva} alt={produto.nome} className="w-full h-full object-contain transition-all duration-500" />
            </div>
            {produto.galeria && produto.galeria.length > 1 && (
              <div className="grid grid-cols-5 gap-2 mt-4">
                {produto.galeria.map((imgUrl: string, index: number) => (
                  <button key={index} onClick={() => setFotoAtiva(imgUrl)} className={`aspect-square border-2 transition-all overflow-hidden ${fotoAtiva === imgUrl ? 'border-[#916749] opacity-100 scale-95' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                    <img src={imgUrl} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 p-8 md:p-16 flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-[1px] w-8 bg-[#ab8d6f]"></span>
                <span className="text-[#ab8d6f] text-[10px] font-black uppercase tracking-[0.4em]">Haras do Sul</span>
              </div>
              <h1 className="text-4xl font-serif font-bold text-black uppercase mb-6 leading-tight tracking-tighter">{produto.nome}</h1>
              <div className="bg-[#fcfbf9] p-4 border-l-4 border-[#916749] mb-8">
                <p className="text-3xl font-serif text-[#916749] font-bold italic">R$ {Number(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-[9px] uppercase text-gray-400 mt-1 tracking-widest font-bold"></p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-black">Descrição do produto</h3>
                  <div className="flex-1 h-[1px] bg-[#dfdbcc]"></div>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line font-medium italic">{produto.descricao}</p>
              </div>
            </div>
            <div className="mt-12 space-y-4">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-4 bg-black text-white p-5 font-bold uppercase tracking-[0.3em] hover:bg-[#916749] transition-all shadow-xl group">
                <MessageCircle size={20} className="group-hover:scale-125 transition-transform" />
                Encomendar Peça
              </a>
              <p className="text-center text-[9px] text-gray-400 uppercase tracking-widest">* Encomendas exclusivas via consultoria WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}