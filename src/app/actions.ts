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

      try {
        const filename = `${nanoid()}-${image.name}`;
        const { url } = await put(filename, image, { access: "public" });
        if (!url) {
          throw new Error("No URL returned from upload");
        }
        imageUrl = url;
        console.log("Image uploaded successfully:", imageUrl);
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return { error: "Failed to upload image" };
      }
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
