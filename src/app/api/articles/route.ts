import { NextResponse } from "next/server";
import { getApprovedArticles, submitArticle } from "@/lib/db";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

export async function GET() {
  try {
    const articles = await getApprovedArticles();
    return NextResponse.json({ articles });
  } catch (error) {
    console.error("API: Error fetching approved articles:", error);
    return NextResponse.json(
      {
        error: `Failed to fetch approved articles: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const content = formData.get("content") as string;
    const file = formData.get("file") as File | null;

    let imageUrl = null;
    if (file) {
      const filename = `${nanoid()}-${file.name}`;
      const { url } = await put(filename, file, { access: "public" });
      imageUrl = url;
    }

    const articleId = await submitArticle(content, imageUrl || "");

    return NextResponse.json({ success: true, articleId });
  } catch (error) {
    console.error("API: Error submitting article:", error);
    return NextResponse.json(
      {
        error: `Failed to submit article: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
