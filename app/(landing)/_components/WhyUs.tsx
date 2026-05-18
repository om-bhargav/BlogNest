import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ShieldCheck, BookOpen, Zap } from "lucide-react"

const features = [
  {
    title: "Expert-Driven Content",
    description:
      "Every article is written by experienced professionals and reviewed for quality and accuracy.",
    icon: ShieldCheck,
  },
  {
    title: "Actionable Insights",
    description:
      "We focus on practical takeaways you can apply immediately, not just theory.",
    icon: Zap,
  },
  {
    title: "Curated Topics",
    description:
      "From technology to design and startups, our content is thoughtfully curated.",
    icon: BookOpen,
  },
  {
    title: "Fresh Weekly Reads",
    description:
      "New, high-quality articles published every week to keep you ahead.",
    icon: Sparkles,
  },
]

export function WhyUsSection() {
  return (
    <section className="w-full scroll-mt-20 max-md:px-4" id="whyus">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why Readers Choose Us
          </h2>
          <p className="mt-3 text-muted-foreground">
            Built by writers, for curious minds who value clarity and depth.
          </p>
        </div>

        {/* Features */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="space-y-3 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>

                <h3 className="font-semibold text-lg">{feature.title}</h3>

                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
