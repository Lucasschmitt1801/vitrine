import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Lock } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Haras do Sul | Artigos em Couro Legítimo",
  description: "Exclusividade e tradição em artigos de couro feitos à mão.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#dfdbcc]`}>
        {children}
        
        {/* Rodapé Minimalista e Discreto */}
        <footer className="bg-white border-t border-[#ab8d6f]/10 py-6 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Esquerda: Copyright Haras */}
            <p className="text-[#ab8d6f] text-[9px] uppercase tracking-[0.2em] font-medium">
              © {new Date().getFullYear()} Haras do Sul
            </p>

            {/* Centro: Seu Link de Lead (Elegante e sutil) */}
            <a 
              href="https://wa.me/5551997517996?text=Olá%20Lucas,%20vi%20o%20projeto%20Haras%20do%20Sul%20e%20gostaria%20de%20fazer%20um%20orçamento."
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400 group-hover:text-black transition-colors duration-300">
                Desenvolvido por Lucas Schmitt
              </span>
            </a>

            {/* Direita: Acesso Admin Discreto */}
            <Link 
              href="/login" 
              className="text-gray-300 hover:text-[#916749] transition-colors"
              title="Painel Interno"
            >
              <Lock size={12} />
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}