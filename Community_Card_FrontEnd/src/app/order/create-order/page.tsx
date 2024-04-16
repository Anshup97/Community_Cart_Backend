"use client"

import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { useForm, SubmitHandler } from "react-hook-form";
import { TailSpin } from 'react-loader-spinner'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/Store/store'
import CartCard from '@/components/CartCard'
import { checkout_cart, get_all_cart_Items, update_cart } from '@/Services/common/cart'
import { setCart } from '@/utils/resolvers/CustomerDataSlice'
import { setNavActive } from '@/utils/resolvers/SellerSlice'
import { create_a_new_order } from '@/Services/common/order'
import { CartItem, CartViewSchema } from '@/model/Cart'
import { UserSessionSchema } from '@/model/User'
import { CreateOrderSchema } from '@/model/Order'
import GetData from '@/components/GetData'

export default function Page() {


    const [loader, setLoader] = useState(false)
    const Router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.User.userData) as UserSessionSchema | null
    const cartData = useSelector((state: RootState) => state.Customer.cart) as CartViewSchema | null;
    const [loading, setLoading] = useState(true)
    const [isPaymentMethodOnline, setIsPaymentMethodOnline] = useState(true)


    useEffect(() => {
        if (!Cookies.get('token') || user === null) {
            Router.push('/')
        }
        dispatch(setNavActive('Base'))
    }, [dispatch, Router])

    const fetchCartData = async () => {
        if (!user?.customerId) return Router.push('/')
        const cartData = await get_all_cart_Items(user?.customerId)
        if (cartData?.status === 200) {
            dispatch(setCart(cartData?.data))
        } else {
            toast.error(cartData?.statusText)
        }
        console.log(JSON.stringify(cartData));
        setLoading(false)
    }

    interface Inputs {
        isOnline: boolean,
    }

    const { register, formState: { errors }, handleSubmit } = useForm<Inputs>({
        criteriaMode: "all"
    });

    useEffect(() => {
        fetchCartData();
    }, [])


    const handleCheckboxChange = () => {
        setIsPaymentMethodOnline(!isPaymentMethodOnline)
    }

    const onSubmit: SubmitHandler<Inputs> = async data => {
        if (user?.customerId && cartData) {
            setLoader(true)
            const updateCartRes = await update_cart(user.customerId, cartData.items)
            if (updateCartRes?.status === 200) {
                if (isPaymentMethodOnline) {
                    const checkoutRes = await checkout_cart(user.customerId)
                    if (checkoutRes.status === 200) {
                        Cookies.set("sessionId", checkoutRes.data.sessionId);
                        location.replace(checkoutRes.data.url)
                    }
                } else {
                    const finalData: CreateOrderSchema = {
                        customerId: user?.customerId,
                        paymentMethod: "COD",
                    }

                    const res = await create_a_new_order(finalData);
                    if (res?.status === 200) {
                        toast.success("Order created")

                        setTimeout(() => {
                            Router.push('/order/view-orders')
                        }, 3000)
                    }
                }
            } else {
                toast.error("Unable to update cart.")
                setLoader(false)
            }
        } else {
            toast.error("Please login to place order.")
        }

    }


    function calculateTotalPrice(myCart: CartViewSchema) {
        const totalPrice = myCart?.items.reduce((acc, item) => {
            return acc + (Number(item?.quantity) * Number(item?.product.productPrice));
        }, 0);

        return totalPrice;
    }

    const totalPrice = calculateTotalPrice(cartData as CartViewSchema)

    return (
        <GetData>
            <div className='w-full h-full bg-gray-50 px-2'>
                <div className="text-sm breadcrumbs  border-b-2 border-b-orange-600">
                    <ul className='dark:text-black'>
                        <li>
                            <Link href={"/"}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                Home
                            </Link>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                            Order
                        </li>
                    </ul>
                </div>
                <div className='w-full h-20 my-2 text-center'>
                    <h1 className='text-2xl py-2 dark:text-black'>Your Order</h1>
                </div>


                {
                    loading || loader ? (
                        <div className='w-full  flex-col h-96 flex items-center justify-center '>
                            <TailSpin
                                height="50"
                                width="50"
                                color="orange"
                                ariaLabel="tail-spin-loading"
                                radius="1"
                                wrapperStyle={{}}
                                wrapperClass=""
                                visible={true}
                            />
                            <p className='text-sm mt-2 font-semibold text-orange-500'>Loading Hold Tight ....</p>
                        </div>
                    ) : (

                        <div className='w-full  h-full flex-col md:flex-row flex items-start justify-center'>

                            <div className='md:w-2/3 w-full px-2 h-full flex-col items-end justify-end flex'>
                                <div className='w-full flex flex-col items-center py-2 overflow-auto h-96'>
                                    {
                                        cartData?.items.length === 0 ?
                                            <div className='w-full h-full flex items-center justify-center flex-col'>
                                                <p className='my-4 mx-2 text-lg font-semibold '>No Item Available in Cart</p>
                                                <Link href={"/"} className='btn text-white'>Continue Shopping</Link>
                                            </div>
                                            :
                                            cartData?.items.map((item: CartItem) => {
                                                return <CartCard key={item?.cartItemId}
                                                    product={item?.product}
                                                    cartItemId={item?.cartItemId}
                                                    quantity={item?.quantity}
                                                    customerId={cartData.customerId}
                                                />
                                            })
                                    }
                                </div>
                                <div className='w-full  py-2 my-2 flex justify-end '>
                                    <h1 className='py-2 tracking-widest mb-2  border-b px-6 border-orange-600 text-sm  flex flex-col '>  Original Price  <span className='text-xl font-extrabold'>Rs {totalPrice || 0}</span> </h1>
                                    <h1 className='py-2 tracking-widest mb-2  border-b px-6 border-orange-600 text-sm  flex flex-col '>  Shipping Price  <span className='text-xl font-extrabold'>Rs {50}</span> </h1>
                                </div>
                                <div className='w-full  py-2 my-2 flex justify-end '>
                                    <h1 className='py-2 tracking-widest mb-2  border-b px-6 border-orange-600 text-sm  flex flex-col '>  Total Order Price  <span className='text-xl font-extrabold'>Rs {totalPrice + 50}</span> </h1>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="md:w-1/3 px-2 w-full max-w-lg  py-2 flex-col ">
                                <div className='text-center'>
                                    <label className='themeSwitcherTwo shadow-card relative inline-flex cursor-pointer select-none items-center justify-center rounded-md bg-white p-1'>
                                        <input
                                            type='checkbox'
                                            className='sr-only'
                                            {...register("isOnline")}
                                            checked={isPaymentMethodOnline}
                                            onChange={handleCheckboxChange}
                                        />
                                        <span
                                            className={`flex items-center space-x-[6px] rounded py-2 px-[18px] text-sm font-medium ${!isPaymentMethodOnline ? 'text-primary bg-[#f4f7ff]' : 'text-body-color'
                                                }`}
                                        >
                                            <svg
                                                width='16'
                                                height='16'
                                                viewBox='0 0 16 16'
                                                className='mr-[6px] fill-current'
                                            >
                                                <g clipPath='url(#clip0_3122_652)'>
                                                    <path
                                                        fillRule='evenodd'
                                                        clipRule='evenodd'
                                                        d='M8 0C8.36819 0 8.66667 0.298477 8.66667 0.666667V2C8.66667 2.36819 8.36819 2.66667 8 2.66667C7.63181 2.66667 7.33333 2.36819 7.33333 2V0.666667C7.33333 0.298477 7.63181 0 8 0ZM8 5.33333C6.52724 5.33333 5.33333 6.52724 5.33333 8C5.33333 9.47276 6.52724 10.6667 8 10.6667C9.47276 10.6667 10.6667 9.47276 10.6667 8C10.6667 6.52724 9.47276 5.33333 8 5.33333ZM4 8C4 5.79086 5.79086 4 8 4C10.2091 4 12 5.79086 12 8C12 10.2091 10.2091 12 8 12C5.79086 12 4 10.2091 4 8ZM8.66667 14C8.66667 13.6318 8.36819 13.3333 8 13.3333C7.63181 13.3333 7.33333 13.6318 7.33333 14V15.3333C7.33333 15.7015 7.63181 16 8 16C8.36819 16 8.66667 15.7015 8.66667 15.3333V14ZM2.3411 2.3424C2.60145 2.08205 3.02356 2.08205 3.28391 2.3424L4.23057 3.28906C4.49092 3.54941 4.49092 3.97152 4.23057 4.23187C3.97022 4.49222 3.54811 4.49222 3.28776 4.23187L2.3411 3.28521C2.08075 3.02486 2.08075 2.60275 2.3411 2.3424ZM12.711 11.7682C12.4506 11.5078 12.0285 11.5078 11.7682 11.7682C11.5078 12.0285 11.5078 12.4506 11.7682 12.711L12.7148 13.6577C12.9752 13.918 13.3973 13.918 13.6577 13.6577C13.918 13.3973 13.918 12.9752 13.6577 12.7148L12.711 11.7682ZM0 8C0 7.63181 0.298477 7.33333 0.666667 7.33333H2C2.36819 7.33333 2.66667 7.63181 2.66667 8C2.66667 8.36819 2.36819 8.66667 2 8.66667H0.666667C0.298477 8.66667 0 8.36819 0 8ZM14 7.33333C13.6318 7.33333 13.3333 7.63181 13.3333 8C13.3333 8.36819 13.6318 8.66667 14 8.66667H15.3333C15.7015 8.66667 16 8.36819 16 8C16 7.63181 15.7015 7.33333 15.3333 7.33333H14ZM4.23057 11.7682C4.49092 12.0285 4.49092 12.4506 4.23057 12.711L3.28391 13.6577C3.02356 13.918 2.60145 13.918 2.3411 13.6577C2.08075 13.3973 2.08075 12.9752 2.3411 12.7148L3.28776 11.7682C3.54811 11.5078 3.97022 11.5078 4.23057 11.7682ZM13.6577 3.28521C13.918 3.02486 13.918 2.60275 13.6577 2.3424C13.3973 2.08205 12.9752 2.08205 12.7148 2.3424L11.7682 3.28906C11.5078 3.54941 11.5078 3.97152 11.7682 4.23187C12.0285 4.49222 12.4506 4.49222 12.711 4.23187L13.6577 3.28521Z'
                                                    ></path>
                                                </g>
                                                <defs>
                                                    <clipPath id='clip0_3122_652'>
                                                        <rect width='16' height='16' fill='white'></rect>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            COD
                                        </span>
                                        <span
                                            className={`flex items-center space-x-[6px] rounded py-2 px-[18px] text-sm font-medium ${isPaymentMethodOnline ? 'text-primary bg-[#f4f7ff]' : 'text-body-color'
                                                }`}
                                        >
                                            <svg
                                                width='16'
                                                height='16'
                                                viewBox='0 0 16 16'
                                                className='mr-[6px] fill-current'
                                            >
                                                <path
                                                    fillRule='evenodd'
                                                    clipRule='evenodd'
                                                    d='M8.0547 1.67334C8.18372 1.90227 8.16622 2.18562 8.01003 2.39693C7.44055 3.16737 7.16651 4.11662 7.23776 5.07203C7.30901 6.02744 7.72081 6.92554 8.39826 7.60299C9.07571 8.28044 9.97381 8.69224 10.9292 8.76349C11.8846 8.83473 12.8339 8.5607 13.6043 7.99122C13.8156 7.83502 14.099 7.81753 14.3279 7.94655C14.5568 8.07556 14.6886 8.32702 14.6644 8.58868C14.5479 9.84957 14.0747 11.0512 13.3002 12.053C12.5256 13.0547 11.4818 13.8152 10.2909 14.2454C9.09992 14.6756 7.81108 14.7577 6.57516 14.4821C5.33925 14.2065 4.20738 13.5846 3.312 12.6892C2.41661 11.7939 1.79475 10.662 1.51917 9.42608C1.24359 8.19017 1.32569 6.90133 1.75588 5.71038C2.18606 4.51942 2.94652 3.47561 3.94828 2.70109C4.95005 1.92656 6.15168 1.45335 7.41257 1.33682C7.67423 1.31264 7.92568 1.44442 8.0547 1.67334ZM6.21151 2.96004C5.6931 3.1476 5.20432 3.41535 4.76384 3.75591C3.96242 4.37553 3.35405 5.21058 3.00991 6.16334C2.66576 7.11611 2.60008 8.14718 2.82054 9.13591C3.04101 10.1246 3.5385 11.0301 4.25481 11.7464C4.97111 12.4627 5.87661 12.9602 6.86534 13.1807C7.85407 13.4012 8.88514 13.3355 9.8379 12.9913C10.7907 12.6472 11.6257 12.0388 12.2453 11.2374C12.5859 10.7969 12.8536 10.3081 13.0412 9.78974C12.3391 10.0437 11.586 10.1495 10.8301 10.0931C9.55619 9.99813 8.35872 9.44907 7.45545 8.5458C6.55218 7.64253 6.00312 6.44506 5.90812 5.17118C5.85174 4.4152 5.9575 3.66212 6.21151 2.96004Z'
                                                ></path>
                                            </svg>
                                            Online
                                        </span>
                                    </label>
                                </div>
                                <button className='btn btn-block mt-3'>Order !</button>

                            </form >

                        </div >


                    )
                }


                <ToastContainer />
            </div>
        </GetData>
    )
}
