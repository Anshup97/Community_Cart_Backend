"use client"
import { get_customer_orders } from '@/Services/common/order'
import { RootState } from '@/Store/store'
import Loading from '@/components/loading'
import OrdersDetailsDataTable from '@/components/OrdersDetailsDataTable'
import { UserSessionSchema } from '@/model/User'
import { setOrder } from '@/utils/resolvers/CustomerDataSlice'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { GrDeliver } from 'react-icons/gr'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import GetData from '@/components/GetData'

export default function Page() {
  const Router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const usr: UserSessionSchema | null = JSON.parse(localStorage.getItem('user') || '{}');
    if (!Cookies.get('token') || !usr?.customerId) {
      Router.push('/')
      return;
    }

    fetchOrdersData(usr?.customerId);
  }, [])

  const fetchOrdersData = async (customerId: number) => {
    setLoading(true)
    const orderRes = await get_customer_orders(customerId)
    if (orderRes?.status === 200) {
      dispatch(setOrder(orderRes.data))
    } else {
      toast.error(orderRes?.statusText)
    }
    setLoading(false)
  }




  return (
    <GetData>
      <div className='w-full bg-gray-50 h-screen px-2 py-2'>
        <div className="text-sm breadcrumbs  border-b-2 border-b-orange-600">
          <ul className='dark:text-black'>
            <li>
              <Link href={'/'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                Home
              </Link>
            </li>
            <li>
              <GrDeliver className="w-4 h-4 mr-2 stroke-current" />
              Orders
            </li>
          </ul>
        </div>
        <div className='w-full h-5/6 py-2'>
          {
            !loading ?
              <OrdersDetailsDataTable />
              : <Loading />
          }
        </div>
        <ToastContainer />
      </div>
    </GetData>
  )
}
