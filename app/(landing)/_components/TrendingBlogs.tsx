"use client";

import useSWR from "swr";
import { Label } from "@/components/ui/label";
import CustomSwiper from "@/components/CustomSwiper";
import { SwiperSlide } from "swiper/react";
import BlogCard from "./blog-card";
import { fetcher } from "@/lib/fetcher";

export default function TrendingBlogs() {
  const { data, isLoading } = useSWR(
    "/api/blogs/featured",
    fetcher
  );

  const blogs = data?.data || [];

  return (
    <div className="flex w-full justify-between gap-4">
      <div className="w-full space-y-3">
        <Label className="text-2xl font-semibold text-muted-foreground">
          Trending Blogs
        </Label>

        <CustomSwiper
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          className="w-full max-w-full"
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1 },
            600: { slidesPerView: 2 },
            800: { slidesPerView: 3 },
          }}
        >
          {isLoading ? (
            Array.from({ length: 1 }).map((_, i) => (
              <div key={i}>
                <div className="h-[400px] animate-pulse rounded-2xl bg-muted" />
              </div>
            ))
          ) : blogs?.length > 0 ? (
            blogs.map((blog: any) => (
              <SwiperSlide key={blog.id}>
                <BlogCard
                  id={blog.id}
                  title={blog.title}
                  excerpt={blog.excerpt}
                  image={blog.image}
                  category={blog.category?.name}
                  author={blog.author?.name}
                  authorImage={blog.author?.image}
                  slug={blog.slug}
                  date={new Date(blog.createdAt).toLocaleDateString()}
                />
              </SwiperSlide>
            ))
          ) : (
            <div className="col-span-full flex h-[300px] w-full items-center justify-center rounded-2xl border border-dashed bg-muted/20">
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  No blogs found
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Featured blogs are not available right now.
                </p>
              </div>
            </div>
          )}
        </CustomSwiper>
      </div>
    </div>
  );
}