"use client"


import { delete_a_cart_item } from '@/Services/common/cart'
import { RootState } from '@/Store/store'
import { CartItem, CartViewSchema } from '@/model/Cart'
import { ProductSchema } from '@/model/Product'
import { setCart, setCartUpdate } from '@/utils/resolvers/CustomerDataSlice'
import Image from 'next/image'
import React, { useState } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function CartCard({ customerId, product, cartItemId , quantity }: {product: ProductSchema, cartItemId: number, quantity: number, customerId:number}) {
    const dispatch = useDispatch();
    const [qnt, setQnt] = useState(quantity)
    const cart = useSelector((state: RootState) => state.Customer.cart) as CartViewSchema | null

    const handleDeleteCartItem = async () => {
        const res = await delete_a_cart_item(customerId, product.productId)
        if (res?.status === 200) {
            dispatch(setCartUpdate(true))
            dispatch(setCart(res.data));
            return toast.success("Deleted from cart")
        }
        return toast.error(res?.statusText)
    }

    const handleIncrement = () => {
        const newCartItems = cart?.items.map((item: CartItem) => {
            if (item?.cartItemId === cartItemId) {
                if (item?.product?.productQuantity > item?.quantity) {
                    return {
                        ...item,
                        quantity: Number(item?.quantity) + 1,
                    }
                }else{
                    toast.error('Product Quantity is not available')
                    return {
                        ...item,
                        quantity: Number(item?.product?.productQuantity),
                    }
                }
            }
            return item
        }) || [];
        if (qnt > 0) {
            let quantity = qnt + 1
            setQnt(quantity)
            if(cart && newCartItems.length > 0) dispatch(setCart({
                ...cart,
                items: newCartItems
            }))
        }
        else {
            setQnt(quantity)
            if(cart && newCartItems.length > 0) dispatch(setCart({
                ...cart,
                items: newCartItems
            }))
        }
    }


    const handleDecrement = () => {
        const newCartItems = cart?.items.map((item: CartItem) => {
            if (item.cartItemId === cartItemId) {
                if (item?.quantity > 1) {
                    return {
                        ...item,
                        quantity: Number(item.quantity) - 1,
                    }
                }
            }
            return item
        }) || []
        if (qnt > 1) {
            let quantity = qnt - 1
            setQnt(quantity)
            if(cart && newCartItems.length > 0) dispatch(setCart({
                ...cart,
                items: newCartItems
            }))
        }
        else {
            setQnt(quantity)
            if(cart && newCartItems.length > 0) dispatch(setCart({
                ...cart,
                items: newCartItems
            }))
        }
    }


    return (
        <div className='bg-white w-10/12  rounded-xl m-2 border-b flex-col md:flex-row h-72  md:h-40 py-2 px-4 flex justify-around items-center'>
            <Image src={product?.productImageUrl || "/no-photo.jpg"} alt='no image found' width={100} height={150} className='rounded' />
            <h4 className='font-semibold text-lg'>{product?.productName}</h4>
            <h3 className='font-semibold text-lg'>Rs {product?.productPrice}</h3>
            <div className='flex  justify-center items-center'>
                <button onClick={handleIncrement} className='btn btn-circle dark:text-white  text-xl'>+</button>
                <p className='mx-2 text-xl'>{quantity}</p>
                <button onClick={handleDecrement} className='btn btn-circle dark:text-white  text-xl'>-</button>
            </div>
            <AiFillDelete onClick={handleDeleteCartItem} className="text-red-500 text-2xl cursor-pointer " />
        </div>
    )
}
