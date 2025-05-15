import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ClientAuthProvider } from './auth/ClientAuthProvider'
import ServiceWorkerRegistrar from "../components/ServiceWorkerRegistrar"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Gummy Dashboards",
  description: "Visualização de relatórios Power BI da Gummy Original",
  generator: 'b3rnardo_15',
  icons: { // Adicionando a forma recomendada para favicon em Next.js 13+
    icon: '/favicon.png',
  },
  manifest: '/manifest.json'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="light h-full">
      {/* <head> tag é gerenciada pelo Next.js, o link do favicon é melhor na metadata ou como abaixo se necessário para versões mais antigas */}
      {/* Se a metadata.icons não funcionar por alguma razão específica do setup, o <link> manual pode ser descomentado */}
      {/* <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head> */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-pink-50 dark:bg-gray-900`}>
        <ClientAuthProvider>
        <ServiceWorkerRegistrar />
          <div className="flex-grow"> {/* Este div faz o conteúdo principal crescer e empurrar o rodapé para baixo */}
            {children}
          </div>
        </ClientAuthProvider>
        <footer className="w-full text-center p-4 text-sm text-pink-700 dark:text-pink-300 border-t border-pink-200 dark:border-gray-700 mt-auto">
          Gummy Dashboards © 2025
        </footer>
      </body>
    </html>
  )
}

