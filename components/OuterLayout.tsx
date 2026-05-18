"use client";
import React, { Suspense, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Footer from './Footer';
import { Navbar } from './Navbar';
interface Props extends React.PropsWithChildren{};

export default function OuterLayout({children}: Props) {
  const {setTheme} = useTheme();
  useEffect(()=>{
    setTheme("dark");
  },[]);
  return (
    <div className='flex flex-col w-full'>
      <Suspense>
      <Navbar/>
      </Suspense>
      <div className='flex-1 h-full w-full'>
        {children}
      </div>
      <Footer/>
    </div>
  )
}
