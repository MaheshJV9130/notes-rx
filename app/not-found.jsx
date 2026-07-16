"use client"
import Button from '@/components/Button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
const NotFound = () => {
    const router = useRouter()
  return (
    <div className='text-center mx-auto'>
        <Image className='mx-auto my-10 rounded-4xl' src={"/notfound.gif"} alt="not-found" width={500} height={500}/>
        <div className=''>
            <p className='text-2xl font-bold '>Page you looking for not found</p>
            <Button onclick={()=>{
                router.push("/")
            }} varient='primary'>Go back to Home</Button>
        </div>
    </div>
  )
}

export default NotFound