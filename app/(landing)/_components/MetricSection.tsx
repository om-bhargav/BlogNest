import { Card, CardContent } from "@/components/ui/card"
import { PenLine, Users, BookOpen, TrendingUp } from "lucide-react"

const metrics = [
  {
    label: "Articles Published",
    value: "1,200+",
    icon: BookOpen,
  },
  {
    label: "Monthly Readers",
    value: "250K+",
    icon: Users,
  },
  {
    label: "Expert Authors",
    value: "40+",
    icon: PenLine,
  },
  {
    label: "Topics Covered",
    value: "120+",
    icon: TrendingUp,
  },
]

export function MetricsSection() {
  return (
    <section className="w-full scroll-mt-20" id="achievements">
      <div className="mx-auto max-md:px-6 md:pr-6">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Trusted by Readers Worldwide
          </h2>
          <p className="mt-3 text-muted-foreground">
            Numbers that reflect our growing knowledge community
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {metrics.map((metric) => (
            <Card
              key={metric.label}
              className="group border-muted transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="flex items-center gap-4 p-6">
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <metric.icon className="h-6 w-6" />
                </div>

                {/* Text */}
                <div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">
                    {metric.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
