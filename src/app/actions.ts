"use server";

import { submitArticle } from "@/lib/db";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

export async function handleSubmit(formData: FormData) {
  const content = formData.get("content") as string;
  const image = formData.get("image") as File | null;

  if (!content) {
    console.error("Missing content");
    return { error: "Missing content" };
  }

  try {
    console.log(
      "Attempting to submit article with content:",
      content.substring(0, 50) + "..."
    );

    let imageUrl = "";
    if (image) {
      console.log("Image file:", image.name, image.type, image.size);

      const uploadFormData = new FormData();
      uploadFormData.append("file", image);

      const uploadUrl = process.env.NEXT_PUBLIC_API_URL + "/api/upload";
      console.log("Uploading to:", uploadUrl);

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("Upload response:", errorText);
        throw new Error(`Failed to upload image: ${errorText}`);
      }

      const responseData = await uploadResponse.json();
      console.log("Upload response data:", responseData);

      if (!responseData.url) {
        throw new Error("No URL returned from upload");
      }
      imageUrl = responseData.url;
    }

    const articleId = await submitArticle(content, imageUrl);
    console.log("Article submitted successfully");
    return { success: true, articleId };
  } catch (error) {
    console.error("Error submitting article:", error);
    return {
      error:
        "Failed to submit article: " +
        (error instanceof Error ? error.message : String(error)),
    };
  }
}

export async function uploadImage(image: File) {
  const filename = `${nanoid()}.${image.name.split(".").pop()}`;

  const { url } = await put(filename, image, {
    access: "public",
  });

  return url;
}
