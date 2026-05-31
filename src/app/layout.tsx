import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Market.uz — O\'zbekistonning Premium Marketplace\'i',
    template: '%s | Market.uz',
  },
  description: 'O\'zbekistonning eng zamonaviy marketplace platformasi. Millionlab mahsulot, minglab ishonchli sotuvchilar.',
  keywords: ['marketplace', 'uzbekistan', 'online shopping', 'ecommerce', 'market.uz'],
  authors: [{ name: 'Market.uz Team' }],
  creator: 'Market.uz',
  metadataBase: new URL('https://market.uz'),
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    url: 'https://market.uz',
    title: 'Market.uz — O\'zbekistonning Premium Marketplace\'i',
    description: 'O\'zbekistonning eng zamonaviy marketplace platformasi',
    siteName: 'Market.uz',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Market.uz',
    description: 'O\'zbekistonning Premium Marketplace\'i',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'dark:bg-surface-800 dark:text-white',
              duration: 3000,
              style: {
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
