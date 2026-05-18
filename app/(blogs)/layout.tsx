import Footer from '@/components/Footer'
import React from 'react'
import { Navbar } from '@/components/Navbar'

export default function layout({children}:React.PropsWithChildren) {
  return (
    <>
    <Navbar/>
    {children}
    <Footer/>
    </>
  )
}
