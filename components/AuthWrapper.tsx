"use client";
import React, { useEffect } from 'react'
import {useSession} from "next-auth/react";
import { UserContext } from '@/context/UserContext';
export default function AuthWrapper({children}:React.PropsWithChildren) {
  const {status} = useSession();
  const {login,logout} = UserContext();
  useEffect(()=>{
        const track = async () => {
      try {
        await fetch("/api/log-traffic", {
          method: "POST",
        });
      } catch (error) {
        console.error("Tracking failed");
      }
    };

    const fetchData = async () => {
    if(status==="authenticated"){
        try{
          const request = await fetch("/api/user/me");
          const response = await request.json();
          // console.log(response)
          if(response.success){
              login(response.data);
          }
        }catch(error: any){
          console.log("Error Occured!"); 
        }
      }else if(status==="unauthenticated"){
        logout();
      }
      await track();
    }
      fetchData();
      
  },[]);
  return (
    <>
      {children}
    </>
  )
}
