"use client"
import { RootState } from '@/Store/store';
import Image from 'next/image'
import React from 'react'
import { useSelector } from 'react-redux';


export default function SellerBrief() {
  const shopDetails = useSelector((state: RootState) => state.Seller.seller);

  if (shopDetails) {
    return (
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
    )
  }
  return null;
}