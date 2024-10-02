import { NextResponse } from "next/server";
import { getAllArticlesForAdmin } from "@/lib/db";

export async function GET() {
  try {
    console.log("API: Fetching all articles for admin");
    const articles = await getAllArticlesForAdmin();
    console.log(`API: Fetched ${articles.length} articles`);
    return NextResponse.json({ articles });
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
