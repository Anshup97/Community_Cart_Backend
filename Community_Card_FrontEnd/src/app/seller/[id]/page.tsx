"use client"


import { get_all_categories } from '@/Services/Admin/category'
import { get_all_products } from '@/Services/Admin/product'
import { get_seller } from '@/Services/Admin/seller'
import Loading from '@/components/loading'
import ProductCard from '@/components/ProductCard'
import { CategorySchema } from '@/model/Category'
import { ProductSchema } from '@/model/Product'
import { SellerSchema } from '@/model/Seller'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import GetData from '@/components/GetData'

interface pageParam {
    id: string
}

export default function Page({ params, searchParams }: { params: pageParam, searchParams: any }) {
    const [sellerCategories, setSellerCategoriesData] = useState<CategorySchema[]>([]);
    const [sellerProducts, setSellerProducts] = useState<ProductSchema[]>([]);
    const [noProducts, setNoProducts] = useState<boolean>(false);
    const [currentCatProducts, setCurrentCatProducts] = useState<ProductSchema[]>([]);
    const [shopDetails, setShopDetails] = useState<SellerSchema | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [activeCategoryId, setActiveCategoryId] = useState<number>(-1);

    useEffect(() => {
        const fetch_shop = async () => {
            setIsLoading(true)
            const shopRes = await get_seller({ sellerId: Number(params.id) })
            const catRes = await get_all_categories(Number(params.id))
            if (shopRes?.status !== 200 || catRes?.status !== 200) toast.error(shopRes?.statusText)
            else {
                setShopDetails(shopRes.data[0])
                setSellerCategoriesData(catRes.data)
            }
            setIsLoading(false)
        }

        fetch_shop()
        fetchProducts(-1)
    }, [])

    const fetchProducts = async (categoryId: number) => {
        setActiveCategoryId(categoryId)
        if (categoryId === -1) {
            setIsLoading(true)
            if (sellerProducts.length > 0) {
                setCurrentCatProducts(sellerProducts)
            } else {
                const prdRes = await get_all_products({ sellerId: Number(params.id) })
                setSellerProducts(prdRes.data)
                setCurrentCatProducts(prdRes.data)
            }
            setIsLoading(false)
        } else {
            setIsLoading(true)
            setCurrentCatProducts(sellerProducts.filter(prod => prod.categoryId === categoryId))
            setIsLoading(false)
        }
    }

    const activeTabStyle = "cursor-pointer mr-2 w-36 inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg"
    const inactiveTabStyle = "cursor-pointer mr-2 w-36 inline-block p-4 rounded-t-lg hover:text-gray-800 hover:bg-gray-100"

    return (
        <GetData>
            <div className='w-full h-screen dark:text-black bg-gray-50 py-4 px-2 '>
                <div className="text-sm breadcrumbs border-b-2 border-b-orange-600">
                    <ul>
                        <li>
                            <Link href={'/'}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                Home
                            </Link>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            {params.id || "Loading Shop"}
                        </li>
                    </ul>
                </div>
                <div className='w-full h-1/2 grid grid-cols-2 items-center justify-items-center'>
                    <div>
                        <Image src={shopDetails?.shopPhotoUrl || "/no-photo.jpg"} alt='no Image' className='rounded' width={300} height={300} />
                    </div>
                    <div className='justify-self-start'>
                        <h3 className='text-3xl font-bold'>{shopDetails?.shopName}</h3>
                        <br />
                        <p>{shopDetails?.address.address1}</p>
                        <p>{shopDetails?.address.address2}</p>
                        <p>{shopDetails?.address.city}</p>
                        <p>{shopDetails?.address.country}</p>
                        <p>GSTIN: {shopDetails?.gstin}</p>
                    </div>
                </div>
                <ul className="col-span-2 flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                    <li className={activeCategoryId === -1 ? activeTabStyle : inactiveTabStyle} onClick={() => { fetchProducts(-1) }}> All </li>
                    {
                        sellerCategories && sellerCategories.map((category, index) => {
                            const tabStyle = activeCategoryId === category.categoryId ? activeTabStyle : inactiveTabStyle

                            return (
                                <li className={tabStyle} key={category.categoryId} onClick={() => { fetchProducts(category.categoryId) }}> {category.categoryName} </li>
                            )
                        })
                    }
                    {
                        sellerCategories && sellerCategories.length > 10 ?
                            <li className="cursor-pointer mr-2 w-36 inline-block p-4 rounded-t-lg hover:text-gray-800 hover:bg-gray-100"> More.. </li> : ""
                    }
                </ul>
                <div className='w-full h-5/6  flex items-start justify-center flex-wrap overflow-auto'>
                    {
                        isLoading ? <Loading /> :
                            noProducts ?
                                <p className='text-2xl my-4 text-center font-semibold text-red-400'>No products found in selected category</p>
                                :
                                <>
                                    {
                                        currentCatProducts?.map((item, index) => {
                                            return <ProductCard key={index} item={item} />
                                        })
                                    }
                                </>
                    }
                    {
                        isLoading === false && sellerCategories === undefined || sellerCategories?.length < 1 && <p className='text-2xl my-4 text-center font-semibold text-red-400'>No products sold by this Seller</p>
                    }
                </div>
                <ToastContainer />
            </div>
        </GetData>
    )
}
