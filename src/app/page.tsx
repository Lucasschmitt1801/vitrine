"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { MessageCircle, Instagram, Phone } from 'lucide-react'

export default function Home() {
  const [produtos, setProdutos] = useState<any[]>([])
  const [filtro, setFiltro] = useState('Todos')
  const [categorias, setCategorias] = useState<string[]>(['Todos'])

  useEffect(() => {
    const buscarDados = async () => {
      const { data } = await supabase.from('produtos').select('*').order('criado_at', { ascending: false })
      if (data) {
        setProdutos(data)
        const catsExistentes = data.map(p => p.categoria).filter(Boolean)
        const listaUnica = ['Todos', ...Array.from(new Set(catsExistentes))]
        setCategorias(listaUnica)
      }
    }
    buscarDados()
  }, [])

  const produtosFiltrados = filtro === 'Todos' 
    ? produtos 
    : produtos.filter(p => p.categoria === filtro)

  return (
    <main className="min-h-screen relative bg-[#dfdbcc]">
      {/* Botão WhatsApp Flutuante */}
      <a 
        href="https://wa.me/5551999321074?text=Olá%20Haras%20do%20Sul!%20Gostaria%20de%20falar%20com%20um%20consultor."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
      >
        <MessageCircle size={28} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 whitespace-nowrap text-sm font-bold uppercase tracking-widest">
          Falar com Consultor
        </span>
      </a>

      {/* Top Bar Minimalista */}
      <div className="bg-black text-[9px] text-white/60 uppercase tracking-[0.3em] py-2 px-6 flex justify-between items-center relative z-30">
        <div className="flex gap-4">
          <a href="https://www.instagram.com/harasdosul/" target="_blank" className="hover:text-white transition-colors flex items-center gap-1">
            <Instagram size={10} /> Instagram
          </a>
          <a href="https://wa.me/5551999321074" target="_blank" className="hover:text-white transition-colors flex items-center gap-1">
            <Phone size={10} /> (51) 99932-1074
          </a>
        </div>
        <p className="hidden md:block">Envios para todo o Brasil</p>
      </div>

      {/* Header com Background em Couro */}
      <header 
        className="relative py-28 text-center overflow-hidden border-b border-[#916749]/20"
        style={{
          backgroundImage: 'url(/couro-header.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-5xl md:text-8xl font-serif font-bold tracking-[0.2em] uppercase text-white mb-4 drop-shadow-2xl">
            Haras do Sul
          </h1>
          <div className="flex items-center justify-center gap-6">
            <div className="h-[0.5px] w-12 md:w-24 bg-white/40"></div>
            <p className="text-white uppercase tracking-[0.5em] text-[10px] md:text-xs font-black italic drop-shadow-md">
              Artigos em Couro Legítimo
            </p>
            <div className="h-[0.5px] w-12 md:w-24 bg-white/40"></div>
          </div>
        </div>
      </header>

      {/* Navegação de Categorias */}
      <nav className="bg-white/95 sticky top-0 z-20 border-b border-[#ab8d6f]/10 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-center gap-8 md:gap-12 p-5 overflow-x-auto no-scrollbar">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`text-[10px] uppercase tracking-[0.25em] font-bold pb-1 transition-all whitespace-nowrap ${
                filtro === cat ? 'text-[#916749] border-b-2 border-[#916749]' : 'text-[#ab8d6f]/60 hover:text-[#916749]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* Vitrine com Efeito Hover Avançado */}
      <div className="max-w-[1500px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-16">
          {produtosFiltrados.map((produto) => (
            <Link href={`/produto/${produto.id}`} key={produto.id} className="group">
              <div className="relative w-full aspect-[3/4] bg-white p-1.5 shadow-sm border border-[#ab8d6f]/10 overflow-hidden transition-all duration-700 group-hover:shadow-2xl group-hover:border-[#ab8d6f]/40">
                <div className="w-full h-full overflow-hidden relative bg-[#fcfbf9]">
                  {/* Imagem Principal */}
                  <img 
                    src={produto.imagem_url} 
                    alt={produto.nome} 
                    className={`w-full h-full object-cover transition-all duration-1000 ${produto.galeria?.[1] ? 'group-hover:opacity-0 group-hover:scale-110' : 'group-hover:scale-110'}`} 
                  />
                  
                  {/* Segunda Imagem (Hover) - Só aparece se houver galeria */}
                  {produto.galeria?.[1] && (
                    <img 
                      src={produto.galeria[1]} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100" 
                    />
                  )}

                  <div className="absolute top-0 left-0 bg-[#916749] text-white text-[7px] px-2 py-1 uppercase tracking-widest font-bold z-10">
                    {produto.categoria}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <h2 className="text-[11px] font-bold text-black uppercase tracking-[0.1em] mb-1.5 group-hover:text-[#916749] transition-colors line-clamp-1">
                  {produto.nome}
                </h2>
                <div className="w-4 h-[1px] bg-[#916749]/30 mx-auto mb-2"></div>
                <p className="text-[#916749] font-black text-xs tracking-tight">
                  R$ {Number(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}