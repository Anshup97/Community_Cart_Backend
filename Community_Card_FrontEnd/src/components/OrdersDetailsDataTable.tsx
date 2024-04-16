"use Client"

import React, { useEffect, useState } from 'react'

import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/Store/store';
import { useRouter } from 'next/navigation';
import { OrderSchema } from '@/model/Order';
import { cancel_order } from '@/Services/Admin/order';
import { setCustomerOrderUpdate } from '@/utils/resolvers/CustomerDataSlice';
import { toast } from 'react-toastify';
import Loading from './loading';

export default function OrdersDetailsDataTable() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [orderData, setOrderData] = useState<OrderSchema[]>([]);
  const data = useSelector((state: RootState) => state.Customer.order) as OrderSchema[];
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<OrderSchema[]>([]);


  useEffect(() => {
    setOrderData(data)
  }, [])

  useEffect(() => {
    setFilteredData(orderData);
  }, [orderData])

  const updateTableData = async (updatedOrder: OrderSchema) => {
    dispatch(setCustomerOrderUpdate(true))
    const newOrders = data.map((obj) => {
      if (obj.orderId === updatedOrder.orderId) {
        return updatedOrder;
      }
      return obj;
    });

    setOrderData(newOrders);
  }

  const handleCancel = async (orderId: number) => {
    setIsLoading(true)
    const res = await cancel_order(orderId);
    if (res?.status === 200) {
      toast.success("Order updated")
      updateTableData(res.data);
    } else {
      toast.error(res?.statusText)
    }
    setIsLoading(false)
  }



  const columns = [
    {
      name: 'OrderSchema Id',
      selector: (row: OrderSchema) => row?.orderId,
      sortable: true,
    },
    {
      name: 'Total Price',
      selector: (row: OrderSchema) => row?.totalPrice,
      sortable: true,
    },
    {
      name: 'Delivered',
      selector: (row: OrderSchema) => row?.status,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row: OrderSchema) => (
        <div>
          {
            row.status.toLowerCase() !== 'delivered' && row.status.toLowerCase() !== 'cancelled' ?
              <button onClick={() => handleCancel(row.orderId)} className=' w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700'>Cancel</button>
              : ""
          }
          <button onClick={() => router.push(`/order/view-orders-details/${row?.orderId}`)} className=' w-20 py-2 mx-2 text-xs text-green-600 hover:text-white my-2 hover:bg-green-600 border border-green-600 rounded transition-all duration-700'>Details</button>
        </div>

      )
    },

  ];






  useEffect(() => {
    if (search === '') {
      setFilteredData(orderData);
    } else {
      setFilteredData(orderData?.filter((item) => {
        const itemData = String(item?.orderId).toUpperCase();
        const textData = search.toUpperCase();
        return itemData.indexOf(textData) > -1;
      }))
    }
  }, [search, orderData])



  return (
    <div className='w-full h-full'>
      {
        isLoading ? <Loading /> :
        <DataTable
          columns={columns}
          data={filteredData || []}
          key={'ThisOrdersData'}
          pagination
          keyField="id"
          title={`Orders list`}
          fixedHeader
          fixedHeaderScrollHeight='700px'
          selectableRows
          selectableRowsHighlight
          persistTableHead
          subHeader
          subHeaderComponent={
            <input className='w-60 dark:bg-transparent py-2 px-2  outline-none  border-b-2 border-orange-600' type={"search"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={"Orders Id"} />
          }
          className="bg-white px-4 h-5/6 "
        />
      }
    </div>
  )
}

