"use client"

import { RootState } from '@/Store/store'
import React from 'react'
import { useSelector } from 'react-redux'
import Loading from '@/components/loading';
import ShopCard from './ShopCard';
import { SellerSchema } from '@/model/Seller';

export default function TopShops({ topShops }: any) {
    return (
        <div id='my-Sellers' className='w-full bg-gray-50  flex items-center flex-col justify-start'>
            <div className='flex items-center justify-center px-2 py-2 mb-2'>
                <h1 className='py-2 px-4 border-x-2 border-x-orange-500 text-black font-semibold text-2xl '>Sellers near you</h1>
            </div>
            <div className='md:w-4/5 w-full min-h-16  px-1  py-2 md:px-4 flex items-center justify-center flex-wrap'>
                {
                    topShops?.length < 1 ? <h1 className='text-2xl font-semibold text-gray-500'>No Sellers</h1> :
                        topShops?.map((item: SellerSchema, index: any) => {
                            return <ShopCard
                                shopName={item?.shopName}
                                sellerId={item?.sellerId}
                                shopImageUrl={item?.shopPhotoUrl} // to be replaced with shopImageUrls
                                key={index} />
                        })
                }

            </div>
        </div>
    )
}
