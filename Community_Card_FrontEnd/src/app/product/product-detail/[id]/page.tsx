'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BiCartAdd } from 'react-icons/bi'
import { RiBookMarkFill } from 'react-icons/ri'
import { DiCodeigniter } from 'react-icons/di'
import { ToastContainer, toast } from 'react-toastify'
import { get_product_by_id } from '@/Services/Admin/product'
import Loading from '@/components/loading'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/Store/store'
import { add_to_cart } from '@/Services/common/cart'
import { bookmark_product } from '@/Services/common/bookmark'
import { UserSessionSchema } from '@/model/User'
import { ProductSchema } from '@/model/Product'
import StarRating from '@/components/StarRating'
import RatingAndReviewForm from '@/components/RatingAndReviewForm'
import { setCartUpdate } from '@/utils/resolvers/CustomerDataSlice'
import GetData from '@/components/GetData'


interface pageParam {
    id: string
}

export default function Page({ params, searchParams }: { params: pageParam, searchParams: any }) {
    const dispatch = useDispatch();
    const [prodData, setprodData] = useState<ProductSchema | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const user = useSelector((state: RootState) => state.User.userData) as UserSessionSchema | null
    const custId = user?.customerId;

    useEffect(() => {
        const getProdById = async () => {
            setIsLoading(true)
            const res = await get_product_by_id(Number(params.id));
            if (res?.status !== 200) toast.error(res?.statusText)
            else {
                setprodData(res.data)
            }
            setIsLoading(false)
        }

        getProdById()
    }, [])

    const AddToCart = async () => {
        if (custId && prodData) {
            const res = await add_to_cart({ product: prodData, quantity: 1 }, custId);
            if (res?.status === 200) {
                dispatch(setCartUpdate(true))
                toast.success("Added to cart");
            } else {
                toast.error(res?.statusText)
            }
        } else {
            toast.error("Please login to add to cart")
        }
    }

    const AddToBookmark = async () => {
        if (custId) {
            const res = await bookmark_product({ productId: Number(params.id), customerId: custId });
            if (res?.status === 200) {
                toast.success("Action successful");
            } else {
                toast.error(res?.statusText)
            }
        } else {
            toast.error("Please login to bookmark")
        }
    }

    return (
        <GetData>
            <div className='w-full bg-gray-200 min-h-screen py-4 px-2'>
                <div className="text-sm breadcrumbs border-b-2 py-2 px-2 border-b-orange-600">
                    <ul>
                        <li>
                            <Link href={"/"}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href={`/category/category-product/${prodData?.categoryId}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                {prodData?.categoryId || "Loading Category Name"}
                            </Link>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            {prodData?.productName || "Loading Product Name"}
                        </li>
                    </ul>
                </div>
                <div className='w-full py-4 px-4 flex items-center justify-center'>
                    {
                        isLoading ?
                            <div className='w-4/5 bg-gray-100 rounded-xl h-4/5 flex items-center justify-center shadow-2xl '>
                                <Loading />
                            </div>
                            :
                            <div className='lg:w-4/5 w-full bg-gray-100 rounded-xl lg:h-4/5 items-center justify-center shadow-2xl  '>
                                <div className='grid md:grid-cols-2'>
                                    <div className='flex min-h-100 w-full justify-center z-10 relative' style={{ height: "200px" }}>
                                        <Image src={prodData?.productImageUrl || '/no-photo.jpg'} alt='no image' fill className='rounded-xl object-scale-down' />
                                    </div>
                                    <div className='w-full px-3 rounded flex flex-col lg:px-5 py-2'>
                                        <div className='flex flex-col  lg:flex-row md:justify-between w-full md:h-20 py-2 items-center'>
                                            <h1 className='text-3xl font-semibold text-black'>{prodData?.productName}</h1>
                                            {
                                                prodData?.productFeatured &&
                                                <p className='px-3 py-2 bg-orange-600 hidden lg:flex font-semibold tracking-widest rounded text-white  items-center justify-center '>
                                                    <DiCodeigniter className='mx-2' />
                                                    Featured Product
                                                </p>
                                            }
                                        </div>
                                        <p className='py-2 lg:h-40 w-full'>
                                            <StarRating rating={prodData?.rating || 0} />
                                            <div className='pt-5'>
                                                {prodData?.productDescription}
                                            </div>
                                        </p>
                                        <h1 className='text-3xl font-semibold text-black py-2'>{`${prodData?.productPrice}`} Rs.</h1>
                                        <div className='w-full py-2 lg:flex-row flex-col flex '>
                                            <button onClick={AddToCart} className='btn m-2 lg:w-52 h-10 btn-outline btn-success flex items-center justify-center'> <BiCartAdd className='text-3xl mx-2' /> Add to Cart</button>
                                            <button onClick={AddToBookmark} className='btn m-2  lg:w-52 h-10 btn-outline btn-success flex items-center justify-center'> <RiBookMarkFill className='text-3xl mx-2' />Bookmark</button>
                                        </div>

                                    </div>
                                </div>
                                {
                                    prodData ?
                                        <RatingAndReviewForm customerId={custId} productId={prodData?.productId} /> : ""
                                }
                            </div>
                    }

                </div>
                <ToastContainer />
            </div>
        </GetData>
    )
}
