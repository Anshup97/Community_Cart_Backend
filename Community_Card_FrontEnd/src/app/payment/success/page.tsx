"use client"
import { create_a_new_order } from '@/Services/common/order'
import { CreateOrderSchema } from '@/model/Order'
import { UserSessionSchema } from '@/model/User'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'


export default function PaymentSuccess() {
  const Router = useRouter()
  
  useEffect(() => {
    const userData = localStorage.getItem('user') || "{}";
    const user = JSON.parse(userData);
    if (!user || !user?.customerId) {
      Router.push('/')
    } else {
      console.log("userData")
      console.log(userData)
    }

    const createOrder = async () => {
      if(!user?.customerId) return;
      const sessionId = Cookies.get("sessionId");
      if(!sessionId)  return;
      const finalData: CreateOrderSchema = {
        customerId: user?.customerId,
        paymentMethod: "ONLINE",
        sessionId: sessionId
      }
    
      const res = await create_a_new_order(finalData);
      if (res?.status === 200) {
        toast.success("Order created")

        setTimeout(() => {
          Router.push('/order/view-orders')
        }, 3000)
      } else {
        toast.error(res?.statusText)
      }
    }
    createOrder();
  }, [])
  return (
    <div>
      Payment successful.. Please don't close the browser. Redirecting you to orders page.
    </div>
  )
}