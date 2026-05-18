import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/config";
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Trending Blogs", href: "#trending" },
    { name: "Achievements", href: "#achievements" },
    { name: "Why Blognest", href: "#whyus" },
  ];
export default function Footer() {
  return (
    <footer className="relative mt-5 border-t border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-14">
        {/* Top Section */}
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">{SITE_NAME}</h3>
            <p className="text-sm text-white/70">
              Discover stories worth sharing. A community-driven blogging
              platform for creators worldwide.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase text-white/80">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
            {
              navLinks.map(({name,href},index)=>{    
                return <li key={index}><Link href={href}>{name}</Link></li>
              })
            }
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase text-white/80">
              {SITE_NAME}
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Contact</Link></li>
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Terms of Service</Link></li>
            </ul>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase text-white/80">
              Start Writing
            </h4>
            <p className="text-sm text-white/60">
              Share your ideas, stories, and knowledge with the world.
            </p>
            <Link href={"/signup"}>
            <Button className="w-full">
              Get Started
            </Button>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px w-full bg-white/10" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} BlogHub. All rights reserved.
          </p>

          <div className="flex gap-4 text-white/60">
            <Link href="#" className="hover:text-white">Twitter</Link>
            <Link href="#" className="hover:text-white">GitHub</Link>
            <Link href="#" className="hover:text-white">LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
