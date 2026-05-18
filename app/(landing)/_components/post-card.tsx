import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  title: string;
  image: string;
  author: string;
  date: string;
}

export function PostCard({ title, image, author, date }: Props) {
  return (
    <Card className="overflow-hidden bg-black/40 border-white/10">
      <img src={image} alt={title} className="h-48 w-full object-cover" />

      <div className="p-4 text-white">
        <h3 className="font-semibold mb-3">{title}</h3>

        <div className="flex items-center gap-3 text-sm text-white/70">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatar.png" />
            <AvatarFallback>{author[0]}</AvatarFallback>
          </Avatar>
          <span>{author}</span>
          <span>•</span>
          <span>{date}</span>
        </div>
      </div>
    </Card>
  );
}
