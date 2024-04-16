"use client"

import React, { useEffect, useState, FormEvent } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { login_me } from '@/Services/auth';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import jwt_decode from "jwt-decode";
import { setUserData } from '@/utils/resolvers/UserDataSlice';
import { useRouter } from 'next/navigation';
import { TailSpin } from 'react-loader-spinner';
import { GrClose } from 'react-icons/gr';
import { UserSessionSchema } from '@/model/User';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function Login() {
    const dispatch = useDispatch()
    const Router = useRouter()

    const [formData, setFormData] = useState({ email: "", credential: "", password:"", sso: false, submitted: false });
    const [error, setError] = useState({ email: "", credential: "", password:"", sso: "" });
    const [loading, setLoding] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("");
    
    const loginUser = async () => {
        try {
        const res = await login_me(formData);
        let data = res.data;
        if (res.status == 200 && data) {
            setLoding(false);
            Cookies.set('token', data);
            const tokenData: UserSessionSchema = jwt_decode(data);
            localStorage.setItem('user', JSON.stringify(tokenData));
            dispatch(setUserData(tokenData));

            if (tokenData?.role === 'SELLER') {
                Router.push('/Dashboard')
            }
            else {
                Router.push('/')
            }
        }
        else if (!data) {
            const params = new URLSearchParams({
                email: formData.email,
                name: name,
                profilePhoto: profilePhotoUrl
            });

            Router.push(`/auth/register?${params.toString()}`)
        }
    } catch {
        toast.error("Unable to login. It might be due to wrong credentials. If problem persist, server may be down.");
    }
    }

    useEffect(() => {
        const login = async () => {
            setLoding(true);
            await loginUser();
        }
        if (formData.submitted) login();
    }, [formData.submitted, loginUser])


    const handleSso = async (credential: string) => {
        const tokenData: any = jwt_decode(credential);
        setName(tokenData.name);
        let profilePhotoUrl = encodeURIComponent(tokenData.picture);
        setProfilePhotoUrl(profilePhotoUrl);
        setFormData({ email: tokenData.email, credential, password:"", sso: true, submitted: true })
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        if (!formData.email) {
            setError({ ...error, email: "Email Field is Required" })
            return;
        }
        if (!formData.password) {
            setError({ ...error, credential: "Password Field is required" })
            return;
        }
        setFormData({ ...formData, sso: false, submitted: true });

    }

    useEffect(() => {
        if (Cookies.get('token')) {
            Router.push('/');
        }
    }, [Router])

    return (
        <>
            {/* <Navbar /> */}
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH || ""}>
                <div className='relative w-full h-screen bg-gray-50 text-black'>
                    <Link href={'/'}><GrClose className="absolute top-5 right-5 w-10 h-10 stroke-current" /></Link>
                    <div className="flex flex-col items-center  text-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
                        <div className="w-full bg-white text-black rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 ">
                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                                    Sign in to your account
                                </h1>
                                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
                                    <div className='text-left'>
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
                                        <input onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" name="email" id="email" className="bg-gray-50  border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5 " placeholder="name@company.com" />
                                        {
                                            error.email && <p className="text-sm text-red-500">{error.email}</p>
                                        }
                                    </div>
                                    <div className='text-left'>
                                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                                        <input onChange={(e) => setFormData({ ...formData, password: e.target.value })} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5" />
                                        {
                                            error.password && <p className="text-sm text-red-500">{error.password}</p>
                                        }
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input id="remember" aria-describedby="remember" type="checkbox" defaultChecked className="w-4 h-4 bg-white  border border-gray-300 rounded focus:ring-3 focus:ring-orange-300  " />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="remember" className="text-gray-500  ">Remember me</label>
                                            </div>
                                        </div>
                                        <Link href="/auth/reset" className="text-sm font-medium text-orange-600 hover:underline ">Forgot password?</Link>
                                    </div>
                                    {
                                        loading ? <button type="button" className="w-full flex items-center justify-center text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800">
                                            <TailSpin
                                                height="20"
                                                width="20"
                                                color="white"
                                                ariaLabel="tail-spin-loading"
                                                radius="1"
                                                wrapperStyle={{}}
                                                wrapperClass=""
                                                visible={true}
                                            />
                                        </button> : <button type="submit" className="w-full text-white bg-orange-600 da hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800">Sign in</button>
                                    }
                                    <center>
                                        <GoogleLogin
                                            onSuccess={credentialResponse => {
                                                if (credentialResponse.credential) handleSso(credentialResponse.credential)
                                            }}
                                            onError={() => {
                                                console.log('Login Failed');
                                            }}
                                        />
                                    </center>
                                    <p className="text-sm text-black ">
                                        Don&apos;t have an account yet? <Link href={"/auth/register"} className="font-medium text-orange-600 hover:underline ">Sign up</Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            </GoogleOAuthProvider>
        </>
    )
}
