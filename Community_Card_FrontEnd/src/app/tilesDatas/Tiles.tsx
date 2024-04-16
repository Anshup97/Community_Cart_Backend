"use client"
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import StatsTiles from "@/components/StatsTiles";

interface tile {
  icon: string, color: string, title: string, count: number
}

export default function GettingDatasLength() {

  const [data, setData] = useState<tile[]>([]);

  const seller = useSelector((state: RootState) => state.Seller)

  const catData = useSelector((state: RootState) => state.Seller.allCategories);

  const prodData = useSelector((state: RootState) => state.Seller.product);

  const orderData = useSelector((state: RootState) => state.Seller.Order);
  let noOfCompletedOrders = orderData.filter(order => order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'cancelled').length

  const getFigures = () => {
    return [
      {
        icon: "GiAbstract010",
        color: "text-blue-600",
        title: "Total Products",
        count: Object.keys(prodData).length || 0
      },
      {
        icon: "CgMenuGridR",
        color: "text-purple-600",
        title: "Total Categories",
        count: Object.keys(catData).length || 0
      },
      {
        icon: "AiOutlineClockCircle",
        color: "text-yellow-600",
        title: "Pending Orders",
        count: orderData.length - noOfCompletedOrders || 0,
      },
      {
        icon: "GrCompliance",
        color: "text-orange-600",
        title: "Completed Orders",
        count: noOfCompletedOrders,
      }
    ]
  }

  useEffect(() => {
    setData(getFigures())
  }, [seller])

  return (
    <>
      {
        data?.map((tile: tile, index: number) => {
          return (
            <StatsTiles key={index}
              Icon={tile.icon}
              color={tile.color}
              title={tile.title}
              count={tile.count} />
          )
        })
      }
    </>
  )
}