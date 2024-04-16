"use client"

import './globals.css'
import { Poppins } from 'next/font/google'
import { Providers } from '@/Store/Provider'
import Script from 'next/script'
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react'

const poppin = Poppins({
  weight: ['100', '400'],
  subsets: ['latin'],
})

function initMap(): void { }

declare global {
  interface Window {
    initMap: () => void;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    window.initMap = initMap;
  }, []);
  
  return (
    <html lang="en">
      <head>
        <Script async
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_PLACES_API_KEY}&callback=initMap`}>
        </Script>
      </head>
      <body className={poppin.className}>
        <Providers>
          {children}
        </Providers>
      </body>

    </html>
  )
}
