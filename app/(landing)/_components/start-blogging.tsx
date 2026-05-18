import { Button } from "@/components/ui/button";
import Link from "next/link";

export function StartBlogging() {
  return (
    <section className="rounded-2xl bg-primary p-8 text-center text-white">
      <h2 className="text-2xl font-bold mb-2">Start Blogging Today</h2>
      <p className="text-white/80 mb-6">
        Join our community and share your voice with the world!
      </p>
      <Link href={"/signup"}>
      <Button size="lg" variant="secondary">
        Get Started
      </Button>
      </Link>
    </section>
  );
}
