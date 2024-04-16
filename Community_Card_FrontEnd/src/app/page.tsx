"use client"
import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import FeaturedProduct from '@/components/FeaturedProduct'
import TopShops from '@/components/TopShops'
import { get_all_products } from '@/Services/Admin/product'
import { toast, ToastContainer } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import Loading from '../components/loading'
import { setUserData } from '@/utils/resolvers/UserDataSlice'
import { SellerSchema } from '@/model/Seller'
import { ProductSchema } from '@/model/Product'
import GetData from '@/components/GetData'
import { UserSessionSchema } from '@/model/User'
import { useRouter } from 'next/navigation'
import { RootState } from '@/Store/store'


export default function Home() {
  const dispatch = useDispatch();
  const Router = useRouter();
  const [ratio, setRatio] = useState(16 / 9)
  const [topShops, setTopShops] = useState<SellerSchema[]>([])
  const [featuredProdSlice, setFeaturedProdSlice] = useState<ProductSchema[]>([])
  const featuredProducts: ProductSchema[] = useSelector((state: RootState) => state.Customer.featuredProducts)

  const nearbySellers = useSelector((state: RootState) => state.Customer.nearbySellers)

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;

    let userObj = JSON.parse(userData) as UserSessionSchema;
    dispatch(setUserData(userObj));
    if (userObj.role === 'SELLER') {
      Router.push('/Dashboard');
    }
  }, [])

  useEffect(() => {
    if (Object.keys(nearbySellers).length > 0) {
      setTopShops(Object.values(nearbySellers).slice(0, 3))
    }
  }, [nearbySellers])

  useEffect(() => {
    if (featuredProducts.length > 0) setFeaturedProdSlice(featuredProducts.slice(0, 9))
  }, [featuredProducts])

  return (
    <GetData>
      <Navbar />
      <Hero setRatio={setRatio} />
      <TopShops topShops={topShops} />
      <FeaturedProduct products={featuredProdSlice} />
      <Footer />
      <ToastContainer />
    </GetData>
  )
}
