import { Badge } from '@/components/ui/badge'
import React from 'react'
interface Props {
    isEditing: boolean;
}
export default function BlogHero({ isEditing }: Props) {
    return (
        <section className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

            <div className="relative grid gap-5 lg:grid-cols-2 lg:items-center">
                <div>
                    <Badge className="rounded-xl px-4 py-1">
                        {isEditing ? "UPDATE BLOG" : "CREATE BLOG"}
                    </Badge>

                    <h1 className="mt-4 text-4xl font-bold tracking-tight">
                        {isEditing ? "Edit Blog" : "Write New Blog"}
                    </h1>

                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        Create engaging content for your audience with modern publishing
                        tools.
                    </p>
                </div>
            </div>
        </section>
    )
}
