"use client"

import { update_order_status } from '@/Services/Admin/order';
import { update_a_product } from '@/Services/Admin/product';
import { ProductSchema } from '@/model/Product'
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'


export default function QtyUpdate({ product, qty, toggleLoading, onProdUpdate }: { product: ProductSchema, qty: number, toggleLoading: Function, onProdUpdate: Function }) {
    const [prodQuantity, setProdQuantity] = useState<number>(qty);
    const submitProdQty = async () => {
        toggleLoading(true);
        let res: AxiosResponse<any,any>
        if (prodQuantity === 0) {
            res = await update_a_product({ ...product, productQuantity: prodQuantity, available: false });

        } else {
            res = await update_a_product({ ...product, productQuantity: prodQuantity, available: true });
        }
        if (res?.status === 200) {
            toast.success("Quantity updated")
            onProdUpdate(res.data);
            toggleLoading(false);
        } else {
            toast.error(res?.statusText)
        }
    }

    return (
        <div>
            <input type="number" id="qty" name="qty" value={prodQuantity} onChange={(e) => setProdQuantity(Number(e.target.value || '0'))}></input>
            <button onClick={() => submitProdQty()} className='py-2 mx-2 text-xs'>☑️</button>
        </div>
    )
}
