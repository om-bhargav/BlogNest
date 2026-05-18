import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const authors = [
  { name: "Emily Johnson", role: "Travel Blogger & Photographer" },
  { name: "Mark Stevens", role: "Tech Enthusiast & Writer" },
  { name: "Sarah Thompson", role: "Food & Lifestyle Blogger" },
  { name: "Patrick Bateman", role: "Serial Killer" },
];

export function FeaturedAuthors() {
  return (
    <div className="space-y-4 max-md:px-5 mt-4 md:max-w-xs w-full">
      <h3 className="text-xl font-semibold text-foreground">Featured Authors</h3>

      {authors.map((a: any) => (
        <div
          key={a.name}
          className="flex items-center justify-between rounded-xl bg-black/40 p-3 border border-white/10"
        >
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={a?.image || "/user.png"} />
              <AvatarFallback>{a.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-foreground text-sm font-medium">{a.name}</p>
              <p className="text-xs text-foreground/60">{a.role}</p>
            </div>
          </div>
          <Button size="sm">Follow</Button>
        </div>
      ))}
    </div>
  );
}
