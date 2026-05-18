import React from "react";

import Image from "next/image";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ImagePlus, Loader2 } from "lucide-react";

interface Props {
  image?: string;
  uploading: boolean;
  uploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BlogImage({
  image,
  uploading,
  uploadImage,
}: Props) {
  return (
    <Card className="rounded-3xl border p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Blog Thumbnail</h2>
      </div>

      <div className="space-y-5">
        {/* Preview */}
        <div className="relative flex h-[350px] items-center justify-center overflow-hidden rounded-2xl border bg-muted">
          {image ? (
            <Image
              src={image}
              alt="Blog thumbnail"
              fill
              className="object-fit"
            />
          ) : (
            <div className="flex flex-col items-center text-muted-foreground">
              <ImagePlus className="mb-2 h-10 w-10" />
              <p className="text-sm">No image selected</p>
            </div>
          )}
        </div>

        {/* Upload */}
        <div>
          <input
            type="file"
            id="image-upload"
            hidden
            accept="image/*"
            onChange={uploadImage}
          />

          <Button
            type="button"
            variant="outline"
            className="w-full rounded-xl"
            asChild
          >
            <label htmlFor="image-upload">
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <ImagePlus className="mr-2 h-4 w-4" />
                  {image ? "Change Thumbnail" : "Upload Thumbnail"}
                </>
              )}
            </label>
          </Button>
        </div>
      </div>
    </Card>
  );
}