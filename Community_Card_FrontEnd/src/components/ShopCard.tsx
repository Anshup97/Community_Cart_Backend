import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function ShopCard({ shopName, shopImageUrl, sellerId }: any) {
    const router = useRouter();
    return (
        <div onClick={() => router.push(`/seller/${sellerId}`)} className="card card-compact text-black cursor-pointer m-3 w-80 bg-gray-50 shadow-xl relative">
            <div className='w-full rounded relative h-60'>
                <Image src={shopImageUrl || '/no-photo.jpg'} alt='no Image' className='rounded' fill />
            </div>
            <div className="card-body">
                <h2 className="card-title mb-1">{shopName} </h2>
                <button className='btn text-white tracking-widest btn-wide mt-2' >View Products</button>
            </div>
        </div>
    )
}
