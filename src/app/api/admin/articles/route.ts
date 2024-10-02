import { NextResponse } from "next/server";
import { getAllArticlesForAdmin } from "@/lib/db";

export async function GET() {
  try {
    console.log("API: Fetching all articles for admin");
    const articles = await getAllArticlesForAdmin();
    console.log(`API: Fetched ${articles.length} articles`);

    const articleIds = articles.map((article) => article.id);
    console.log("Article IDs:", articleIds);

    // 添加 no-cache 和 no-store 頭部
    const response = NextResponse.json({ articles, articleIds });
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("API: Error fetching all articles for admin:", error);
    return NextResponse.json(
      {
        error: `Failed to fetch articles: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
