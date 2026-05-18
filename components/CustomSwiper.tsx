"use client";
import React from "react";
import { Swiper } from "swiper/react";
import { Pagination,Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
function CustomSwiper({
  children,
  ...props
}: React.ComponentProps<typeof Swiper>) {
  return (
    <Swiper
      modules={[Pagination,Autoplay]}
      spaceBetween={50}
      slidesPerView={1}
      navigation // Enables built-in navigation arrows
      pagination={{ clickable: true }} // Enables clickable pagination
      loop={true} // Enables loop mode
      {...props}
    >
      {children}
    </Swiper>
  );
}

export default CustomSwiper;
