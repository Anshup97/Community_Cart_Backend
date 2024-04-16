"use client"

import React from 'react'
import ProductCard from './ProductCard'
import { ProductSchema } from '@/model/Product'

export default function FeaturedProduct({ products }: any) {
    return (
        <div className='w-full bg-gray-50 text-black  flex items-center flex-col justify-start'>
            <div className='flex items-center justify-center px-2 py-2 mb-2'>
                <h1 className='py-2 px-4 border-x-2 border-x-orange-500 font-semibold text-2xl '>Top Products</h1>
            </div>
            <div className='md:w-4/5 w-full px-1 h-full min-h-96 py-2 md:px-4 flex items-center justify-center flex-wrap'>
                {
                    products?.length < 1 ?
                        <h1 className='text-2xl font-semibold text-gray-500'>No Featured Products</h1>
                        :
                        products?.map((item: ProductSchema) => {
                            return <ProductCard item={item} key={item?.productId} />
                        })
                }

            </div>
        </div>
    )
}
