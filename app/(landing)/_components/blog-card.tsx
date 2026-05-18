"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type BlogCardProps = {
  id: string;
  title: string;
  excerpt?: string;
  image?: string;
  category?: string;
  author?: string;
  authorImage?: string;
  date?: string;
  slug: string;
};

export default function BlogCard({
  id,
  title,
  excerpt,
  image,
  category,
  author,
  authorImage,
  date,
  slug,
}: BlogCardProps) {
  const router = useRouter();

  return (
    <Card className="overflow-hidden py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={image || "/hero.png"}
          alt={title}
          className="h-full w-full object-cover"
        />

        {category && (
          <Badge className="absolute left-4 top-4 bg-primary/90 backdrop-blur">
            {category}
          </Badge>
        )}
      </div>

      {/* Content */}
      <CardContent className="space-y-3 py-3">
        <h3 className="line-clamp-2 text-lg font-semibold">
          {title}
        </h3>

        <p className="line-clamp-3 text-sm text-muted-foreground">
          {excerpt || ""}
        </p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex items-center justify-between pb-7 pt-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={authorImage || ""} />
            <AvatarFallback>
              {author?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>

          <div className="text-xs">
            <p className="font-medium">{author}</p>
            <p className="text-muted-foreground">{date}</p>
          </div>
        </div>

        <Button onClick={() => router.push(`/blog/${id}`)}>
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
}