
"use Client"

import React, { useEffect, useMemo, useState } from 'react'

import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import Loading from '@/components/loading';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/Store/store';
import { useRouter } from 'next/navigation';
import { update_order_status } from '@/Services/Admin/order';
import { OrderSchema, StatusEnum } from '@/model/Order';
import DatePicker from './DatePicker';
import { AxiosResponse } from 'axios';
import { setOrderUpdate } from '@/utils/resolvers/SellerSlice';
import GetData from './GetData';

export default function PendingOrdersDataTable() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [sellerOrders, setSellerOrders] = useState<OrderSchema[]>([]);
  const data = useSelector((state: RootState) => state.Seller.Order) as OrderSchema[] | [];
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState<OrderSchema[]>([]);
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    const filterPendingOrder = data?.filter((item) => item?.status.toLowerCase() !== 'delivered' && item?.status.toLowerCase() !== 'cancelled')
    setSellerOrders(filterPendingOrder)
  }, [data])

  useEffect(() => {
    setFilteredData(sellerOrders);
  }, [sellerOrders])

  const updateOrderData = async (updatedOrder: OrderSchema) => {
    dispatch(setOrderUpdate(true))
    const newOrders = data.map((obj) => {
      if (obj.orderId === updatedOrder.orderId) {
        return updatedOrder;
      }
      return obj;
    });

    setSellerOrders(newOrders.filter((item) => item?.status.toLowerCase() !== 'delivered' && item?.status.toLowerCase() !== 'cancelled'));
  }

  const getNextStatus = (currentStatus: StatusEnum) => {
    let updatedStatus = currentStatus;
    switch (currentStatus.toLowerCase()) {
      case 'placed': {
        updatedStatus = 'packed'
        break;
      }
      case 'packed': {
        updatedStatus = 'shipped'
        break;
      }
      case 'shipped': {
        updatedStatus = 'delivered'
        break;
      }
    }

    return updatedStatus;
  }

  const updateOrderStatus = async (orderId: number, status: StatusEnum) => {
    if (status == 'delivered') {
      return
    }

    let updatedStatus = getNextStatus(status);
    let res: AxiosResponse<any, any> | undefined
    setLoading(true);
    if (updatedStatus === 'delivered') {
      const today = new Date();
      res = await update_order_status({ orderId, deliveredAt: today.toISOString() });
    } else {
      res = await update_order_status({ orderId, status: updatedStatus });
    }
    if (res?.status === 200) {
      toast.success("Order updated")
      updateOrderData(res.data);
    } else {
      toast.error(res?.statusText)
    }
    setLoading(false);
  }

  const updatePaymentStatus = async (orderId: number) => {
    setLoading(true);
    const res = await update_order_status({ orderId, paid: true });
    if (res?.status === 200) {
      toast.success("Order updated")
      updateOrderData(res.data);
    } else {
      toast.error(res?.statusText)
    }
    setLoading(false);
  }

  const columns = useMemo(() => [
    {
      name: 'Order Id',
      selector: (row: OrderSchema) => row?.orderId,
      sortable: true,
    },
    {
      name: 'Total Price',
      selector: (row: OrderSchema) => row?.totalPrice,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row: OrderSchema) => row?.status,
      sortable: true,
    },
    {
      name: 'Payment Type',
      selector: (row: OrderSchema) => row?.paymentMethod,
      sortable: true,
    },
    {
      name: 'Delivery Date',
      cell: (row: OrderSchema) => {

        return (
          <DatePicker key={row.orderId} orderId={row.orderId} deliveryDate={row.deliveryDate}
            toggleLoading={(isLoading: boolean) => setLoading(isLoading)}
            onOrderUpdate={(updatedOrder: OrderSchema) => updateOrderData(updatedOrder)}
          />
        )
      }
    },
    {
      name: 'Payment Status',
      cell: (row: OrderSchema) => {
        if (row.paymentMethod === 'ONLINE' || row.paid === true) {
          return "PAID"
        }
        return (
          <button onClick={() => updatePaymentStatus(row?.orderId)} className='w-20 py-2 text-xs text-green-600 hover:text-white my-2 hover:bg-green-600 border border-green-600 rounded transition-all duration-700'>PAID</button>
        )
      }
    },
    {
      name: 'Details',
      cell: (row: OrderSchema) => {
        let btnText = getNextStatus(row?.status)
        if (row.deliveryDate && row.deliveryDate != "")
          return (
            <button onClick={() => router.push(`/order/view-orders-details/${row?.orderId}`)} className=' w-20 py-2 mx-2 text-xs text-blue-600 hover:text-white my-2 hover:bg-blue-600 border border-blue-600 rounded transition-all duration-700'>Details</button>
          )
        else return ""
      }
    },
    {
      name: 'Action',
      cell: (row: OrderSchema) => {
        let btnText = getNextStatus(row?.status)
        if (row.deliveryDate && row.deliveryDate != "")
          return (
            <button onClick={() => updateOrderStatus(row?.orderId, row?.status)} className=' w-20 py-2 mx-2 text-xs text-green-600 hover:text-white my-2 hover:bg-green-600 border border-green-600 rounded transition-all duration-700'>{btnText}</button>
          )
        else return ""
      }
    },

  ], [loading]);

  useEffect(() => {
    if (search === '') {
      setFilteredData(sellerOrders);
    } else {
      setFilteredData(sellerOrders?.filter((item) => {
        const itemData = String(item?.orderId).toUpperCase();
        const textData = search.toUpperCase();
        return itemData.indexOf(textData) > -1;
      }))
    }
  }, [search, sellerOrders])

  const [isFetched, setIsFetched] = useState<boolean>(false)

  if (!loading)
    return (
      <GetData>
        <div className='w-full h-full'>
          <DataTable
            columns={columns}
            data={filteredData}
            key={'ThisOrdersData'}
            pagination
            keyField="id"
            title={`Orders list`}
            progressPending={loading}
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
        </div>
      </GetData>
    )
  else return <Loading />
}

