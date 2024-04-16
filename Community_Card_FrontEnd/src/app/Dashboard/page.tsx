"use client"
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';
import SuperComponent from '@/components/SuperComponent';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import Loading from '../../components/loading';
import { setNavActive } from '@/utils/resolvers/SellerSlice';
import GetData from '@/components/GetData';

export default function Dashboard() {
  const Router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    let usr = JSON.parse(localStorage.getItem('user') || '{}')
    if (!Cookies.get('token') || usr?.role !== 'SELLER') {
      if(!Cookies.get('token')) {
        localStorage.removeItem('user')
      }
      Router.push('/')
    }
    dispatch(setNavActive('Base'))
  }, [dispatch, Cookies, Router])

  return (
    <div className='w-full h-screen flex  bg-gray-50 overflow-hidden'>
      <AdminSidebar />
      <div className='w-full h-full '>
        <AdminNavbar />
        <div className='w-full h-5/6  flex flex-wrap items-start justify-center overflow-y-auto  px-4 py-2'>
          <SuperComponent />
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}



