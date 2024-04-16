"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'


export default function PaymentFailed() {
  const Router = useRouter()
  useEffect(() => {
    setTimeout(() => {
      Router.push('/')
    }, 5000)
  },[])
  return (
    <div>
      Payment failed.. Please don't close the browser. Redirecting you to home page.
    </div>
  )
}
