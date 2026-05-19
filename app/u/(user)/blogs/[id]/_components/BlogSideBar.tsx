import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Save } from 'lucide-react';
import React from 'react'
import { Controller } from 'react-hook-form';
interface Props {
    watch: any;
    setValue: any;
    errors: any;
    categories: any;
    isSubmitting: any;
    uploading: any;
    isValid: any;
    isEditing: any;
    form: any;
    control: any;
}
export default function BlogSideBar({form, control, categories, errors, isEditing, isSubmitting, isValid, uploading, watch }: Props) {
    console.log(form.getValues());
    return (
        <div className="grid gap-6 max-md:w-full flex-2 sticky top-0 lg:col-span-4 h-fit">
            <Card className="rounded-3xl border p-6 max-md:w-full shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold">Publishing</h2>
                </div>

                <div className="grid gap-5">
                    {/* STATUS */}
                    <div className="space-y-2">
                        <Label>Status</Label>

                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="h-12 w-full rounded-xl">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="DRAFT">DRAFT</SelectItem>

                                        <SelectItem value="PUBLISHED">
                                            PUBLISHED
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* CATEGORY */}
                    <div className="space-y-2">
                        <Label>Category</Label>

                        <Controller
                            name="categoryId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="h-12 w-full rounded-xl">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {categories.map((category: any) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        {errors.categoryId && (
                            <p className="text-sm text-red-500">
                                {errors.categoryId.message}
                            </p>
                        )}
                    </div>

                    {/* SUBMIT */}
                    <Button
                        type="submit"
                        disabled={isSubmitting || uploading || !isValid}
                        className="h-12 w-full rounded-xl"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                                {isEditing ? "Updating..." : "Publishing..."}
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />

                                {isEditing ? "Update Blog" : "Create Blog"}
                            </>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    )
}
