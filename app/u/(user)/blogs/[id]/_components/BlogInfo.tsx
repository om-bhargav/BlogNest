import SimpleEditor from '@/components/SimpleEditor';
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea';
import React from 'react'
import { Controller } from 'react-hook-form';
interface Props {
    register: any;
    errors: any;
    control: any;
    setValue: any;
}
export default function BlogInfo({ control, errors, register, setValue }: Props) {
    return (
        <Card className="rounded-3xl border p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Basic Information</h2>

                <p className="text-sm text-muted-foreground">
                    Main blog details.
                </p>
            </div>

            <div className="grid gap-5">
                {/* TITLE */}
                <div className="space-y-2"> 
                    <Label>Blog Title</Label>

                    <Input
                        {...register("title")}
                        placeholder="Enter blog title"
                        className="h-12 rounded-xl"
                    />

                    {errors.title && (
                        <p className="text-sm text-red-500">{errors.title.message}</p>
                    )}
                </div>

                {/* SLUG */}
                <div className="space-y-2">
                    <Label>Slug</Label>

                    <Input {...register("slug")} className="h-12 rounded-xl" />

                    {errors.slug && (
                        <p className="text-sm text-red-500">{errors.slug.message}</p>
                    )}
                </div>

                {/* EXCERPT */}
                <div className="space-y-2">
                    <Label>Excerpt</Label>

                    <Textarea
                        {...register("excerpt")}
                        placeholder="Short blog description..."
                        className="min-h-[120px] rounded-2xl"
                    />

                    {errors.excerpt && (
                        <p className="text-sm text-red-500">
                            {errors.excerpt.message}
                        </p>
                    )}
                </div>

                {/* CONTENT */}
                <div className="space-y-2">
                    <Label>Content</Label>
                    <Controller
                        control={control}
                        name="content"
                        render={({ field }) => (
                            <SimpleEditor
                                content={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    {errors.content && (
                        <p className="text-sm text-red-500">
                            {errors.content.message}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    )
}
