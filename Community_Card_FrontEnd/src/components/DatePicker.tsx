"use client"

import { update_order_status } from '@/Services/Admin/order';
import { ProductSchema } from '@/model/Product'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'


export default function DatePicker({ orderId, deliveryDate, toggleLoading, onOrderUpdate }: { orderId: number, deliveryDate?: string | null, toggleLoading: Function, onOrderUpdate: Function }) {
    const [dateForDelivery, setDateForDelivery] = useState<string | undefined | null>(deliveryDate ? new Date(deliveryDate).toISOString() : null);
    const [yetToUpdate, setYetToUpdate] = useState<boolean>(true);
    useEffect(() => {
        setYetToUpdate(!Boolean(deliveryDate));
    }, [])
    const submitDeilveryDate = async () => {
        if (!dateForDelivery) return;

        toggleLoading(true);
        const res = await update_order_status({ orderId, deliveryDate: dateForDelivery });
        if (res?.status === 200) {
            toast.success("Delivery date updated")
            setYetToUpdate(false);
            onOrderUpdate(res.data);
            toggleLoading(false);
        } else {
            toast.error(res?.statusText)
        }
    }

    return (
        <div>
            {!yetToUpdate && dateForDelivery ? dateForDelivery.split('T')[0] :
                <div>
                    <input type="date" id="deliveryDate" name="deliveryDate" onChange={(e) => setDateForDelivery(new Date(e.target.value).toISOString())}></input>
                    <button onClick={() => submitDeilveryDate()} className='py-2 mx-2 text-xs'>☑️</button>
                </div>
            }
        </div>
    )
}
