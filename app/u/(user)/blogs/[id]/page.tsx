"use client";

import { useParams } from "next/navigation";
import LoadingScreen from "@/components/panel/loading-screen";
import BlogHero from "./_components/BlogHero";
import BlogInfo from "./_components/BlogInfo";
import BlogImage from "./_components/BlogImage";
import BlogSideBar from "./_components/BlogSideBar";
import { useBlogEditor } from "@/hooks/useBlogEditor";

export default function BlogEditorPage() {
  const params = useParams();
  const id = params.id as string;

  const { form, state, handlers } = useBlogEditor(id);
  const { register, handleSubmit, setValue, watch, control, formState: { errors, isSubmitting, isValid } } = form;

  if (state.isEditing && state.isLoading) {
    return <LoadingScreen title={"Fetching Blog Data..."} />;
  }

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6">
      <BlogHero isEditing={state.isEditing} />

      <form
        onSubmit={handleSubmit(handlers.onSubmit)}
        className="flex max-md:flex-col gap-6 items-start"
      >
        {/* LEFT */}
        <div className="grid flex-4 gap-6 lg:col-span-8">
          <BlogInfo
            control={control}
            errors={errors}
            register={register}
            setValue={setValue}
          />

          <BlogImage
            uploadImage={handlers.uploadImage}
            uploading={state.uploading}
            image={watch("image")}
          />
        </div>

        {/* RIGHT */}
        <BlogSideBar
          errors={errors}
          setValue={setValue}
          form={form}
          watch={watch}
          control={control}
          categories={state.categories}
          isSubmitting={isSubmitting}
          uploading={state.uploading}
          isValid={isValid}
          isEditing={state.isEditing}
        />
      </form>
    </main>
  );
}