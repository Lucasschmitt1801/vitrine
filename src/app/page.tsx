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
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
      >
        <MessageCircle size={24} className="md:w-7 md:h-7" />
      </a>

      {/* Top Bar Minimalista */}
      <div className="bg-black text-[8px] md:text-[9px] text-white/60 uppercase tracking-[0.2em] py-2.5 px-4 md:px-6 flex justify-between items-center relative z-30">
        <div className="flex gap-3 md:gap-4">
          <a href="https://www.instagram.com/harasdosul/" target="_blank" className="hover:text-white transition-colors flex items-center gap-1">
            <Instagram size={10} /> Instagram
          </a>
          <a href="https://wa.me/5551999321074" target="_blank" className="hover:text-white transition-colors flex items-center gap-1">
            <Phone size={10} /> (51) 99932-1074
          </a>
        </div>
        <p className="hidden sm:block">Envios para todo o Brasil</p>
      </div>

      {/* Header Slim - ALTURA REDUZIDA AQUI (py-8 no mobile e py-16 no desktop) */}
      <header 
        className="relative py-8 md:py-16 text-center overflow-hidden border-b border-[#916749]/20"
        style={{
          backgroundImage: 'url(/couro-header.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col items-center px-4">
          <h1 className="text-3xl md:text-6xl font-serif font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase text-white mb-1 md:mb-3 drop-shadow-2xl">
            Haras do Sul
          </h1>
          <div className="flex items-center justify-center gap-2 md:gap-6">
            <div className="h-[0.5px] w-6 md:w-20 bg-white/40"></div>
            <p className="text-white uppercase tracking-[0.2em] md:tracking-[0.4em] text-[7px] md:text-xs font-black italic drop-shadow-md whitespace-nowrap">
              Artigos em Couro Legítimo
            </p>
            <div className="h-[0.5px] w-6 md:w-20 bg-white/40"></div>
          </div>
        </div>
      </header>

      {/* Navegação de Categorias */}
      <nav className="bg-white/95 sticky top-0 z-20 border-b border-[#ab8d6f]/10 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-start md:justify-center gap-6 md:gap-12 p-4 overflow-x-auto scrollbar-hide">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold pb-1 transition-all whitespace-nowrap ${
                filtro === cat ? 'text-[#916749] border-b-2 border-[#916749]' : 'text-[#ab8d6f]/60 hover:text-[#916749]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* Vitrine */}
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 gap-y-10">
          {produtosFiltrados.map((produto) => (
            <Link href={`/produto/${produto.id}`} key={produto.id} className="group">
              <div className="relative w-full aspect-[3/4] bg-white p-1 md:p-1.5 shadow-sm border border-[#ab8d6f]/10 overflow-hidden transition-all duration-700 group-hover:shadow-2xl group-hover:border-[#ab8d6f]/40">
                <div className="w-full h-full overflow-hidden relative bg-[#fcfbf9]">
                  <img 
                    src={produto.imagem_url} 
                    alt={produto.nome} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
                  <div className="absolute top-0 left-0 bg-[#916749] text-white text-[6px] md:text-[7px] px-2 py-1 uppercase tracking-widest font-bold z-10">
                    {produto.categoria}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h2 className="text-[9px] md:text-[11px] font-bold text-black uppercase tracking-[0.1em] mb-1 line-clamp-1 px-1">
                  {produto.nome}
                </h2>
                <div className="w-4 h-[0.5px] bg-[#916749]/30 mx-auto mb-1.5"></div>
                <p className="text-[#916749] font-black text-[10px] md:text-xs tracking-tight">
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