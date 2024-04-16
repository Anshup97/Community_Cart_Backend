"use client"

import { get_all_categories } from '@/Services/Admin/category';
import { get_all_orders } from '@/Services/Admin/order';
import { get_all_products } from '@/Services/Admin/product';
import { get_seller } from '@/Services/Admin/seller';
import { get_customer } from '@/Services/auth/customer';
import { get_all_bookmark_items } from '@/Services/common/bookmark';
import { get_all_cart_Items } from '@/Services/common/cart';
import { get_customer_orders } from '@/Services/common/order';
import { RootState } from '@/Store/store';
import { UserSessionSchema } from '@/model/User';
import { get_elevation } from '@/utils/maps';
import { setBookmark, setFeaturedProducts, setNearbySellers } from '@/utils/resolvers/CustomerDataSlice';
import { setCart } from '@/utils/resolvers/CustomerDataSlice';
import { setCategoriesForCustomer, setCustomerData } from '@/utils/resolvers/CustomerDataSlice';
import { setOrder } from '@/utils/resolvers/CustomerDataSlice';
import { setAllCategories, setCatUpdate, setCategoriesForSeller, setOrderData, setOrderUpdate, setProdUpdate, setProductData, setSellerData } from '@/utils/resolvers/SellerSlice';
import { setUserData, setUserLocation } from '@/utils/resolvers/UserDataSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import Loading from './loading';

export default function GetData({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const Router = useRouter();

    const customer = useSelector((state: RootState) => state.Customer)
    const seller = useSelector((state: RootState) => state.Seller)
    const userLoc = useSelector((state: RootState) => state.User.location)
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchSellerData = async (sellerId: number) => {
        try {
            setIsLoading(true)
            if (seller.seller === null) {
                const sellerRes = await get_seller({ sellerId })
                if (sellerRes.status === 200) dispatch(setSellerData(sellerRes.data[0]))
            }

            if (seller.catUpdate || Object.keys(seller.allCategories).length === 0) {
                const allCatRes = await get_all_categories()
                if (allCatRes.status === 200) {
                    dispatch(setAllCategories(allCatRes.data))
                    dispatch(setCatUpdate(false))
                }
            }

            if (seller.catUpdate || seller.categories.length === 0) {
                const catRes = await get_all_categories(sellerId)
                if (catRes.status === 200) {
                    dispatch(setCategoriesForSeller(catRes.data))
                    dispatch(setCatUpdate(false))
                }
            }

            if (seller.prodUpdate || Object.keys(seller.product).length === 0) {
                const prdRes = await get_all_products({ sellerId })
                if (prdRes.status === 200) {
                    dispatch(setProductData(prdRes.data))
                    dispatch(setProdUpdate(false))
                }
            }

            if (seller.orderUpdate || seller.Order.length === 0) {
                const ordRes = await get_all_orders(sellerId)
                if (ordRes && ordRes.status === 200) {
                    dispatch(setOrderData(ordRes.data))
                    dispatch(setOrderUpdate(false))
                }
            }

            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.error('Error in fetching (service) =>' + error)
        }
    }

    const fetchCustomerData = async (custId: number) => {
        try {
            setIsLoading(true)

            if (!customer.CustomerData || customer.CustomerData.customerId !== custId) {
                const custRes = await get_customer(custId)
                if (custRes.status === 200) dispatch(setCustomerData(custRes.data))
            }


            if (customer.bookmarkUpdate || customer.bookmark === null) {
                const bookmarkRes = await get_all_bookmark_items(custId)
                if (bookmarkRes?.status === 200) dispatch(setBookmark(bookmarkRes.data))
            }

            if (customer.cartUpdate || customer.cart === null) {
                const cartRes = await get_all_cart_Items(custId)
                if (cartRes.status === 200) dispatch(setCart(cartRes.data))
            }

            const ordRes = await get_customer_orders(custId)
            if (ordRes?.status === 200) dispatch(setOrder(ordRes.data))
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.error('Error in fetching (service) =>' + error)
        }
    }

    const fetchCommonData = async () => {
        setIsLoading(true)
        let isCustomer = false;
        try {
            if (userLoc) {
                // User specific details
                const userData = localStorage.getItem('user');
                const userObj: UserSessionSchema | null = userData ? JSON.parse(userData) : null;
                if (!userObj) {
                    isCustomer = true;
                } else {
                    dispatch(setUserData(userObj));
                    try {
                        if (userObj.role === "SELLER") {
                            if (userObj.sellerId) await fetchSellerData(userObj.sellerId)
                        } else if (userObj.customerId) {
                            isCustomer = true;
                            await fetchCustomerData(userObj.customerId)
                        } else {
                            console.error("No customer ID available to get data.")
                            return;
                        }
                    } catch {
                        toast.error("Unable to reach server..");
                    }
                }


                if (isCustomer) {
                    if (Object.keys(customer.nearbySellers).length === 0) {
                        const shopRes = await get_seller({
                            sourceLatitude: userLoc.lat,
                            sourceLongitude: userLoc.lng,
                            elevation: userLoc.elevation
                        });
                        if (shopRes?.status !== 200) {
                            toast.error(shopRes?.statusText)
                        } else if (shopRes?.data) {
                            dispatch(setNearbySellers(shopRes.data))
                        }
                    }

                    if (customer.featuredProducts.length === 0) {
                        const productRes = await get_all_products();
                        if (productRes?.status !== 200) toast.error(productRes?.statusText)
                        if (productRes?.data) dispatch(setFeaturedProducts(productRes.data));
                    }

                    if (customer.categories.length === 0) {
                        const allCatRes = await get_all_categories()
                        if (allCatRes.status === 200) dispatch(setCategoriesForCustomer(allCatRes.data))
                    }
                }
            }
        } catch (error) {
            setIsLoading(false)
            console.error('Error in fetching (service) =>' + error)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (userLoc) return;

        setIsLoading(true)
        setTimeout(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    let elevation = await get_elevation(position.coords.latitude, position.coords.longitude)
                    if (elevation) {
                        dispatch(setUserLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            elevation
                        }))
                        setIsLoading(false)
                    } else {
                        console.error("Unable to get elevation!")
                        return Router.push('/no-location')
                    }
                },
                    (error) => {
                        if (error.code === 1) {
                            console.error("Please allow location to view nearby shops!")
                            return Router.push('/no-location')
                        }
                    });
            } else {
                console.error("Geolocation is not supported by this browser.");
                return Router.push('/no-location')
            }
        }, 500);
    }, []);

    useEffect(() => {
        fetchCommonData();
    }, [userLoc])

    if (!isLoading)
        return (
            <>
                {children}
            </>
        );
    else return <Loading />
}
