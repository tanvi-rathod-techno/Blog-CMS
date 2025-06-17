import './globals.css'
import { Providers } from './providers'
import { Inter } from 'next/font/google';
import Header from '@/app/components/layout/Header'
import Footer from '@/app/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NextBlog CMS',
  description: 'Built with Next.js and JSONPlaceholder',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
        <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
