import { NextResponse } from "next/server";
import { getArticleById } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 使用 getArticleById 函數來獲取文章
    const article = await getArticleById(params.id);

    if (!article) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    // 處理圖片URL
    if (article.image) {
      article.image = article.image.replace(
        /^https:\/\/cms\.owen0924\.co\/_next\/image\?url=(.+)&w=\d+&q=\d+$/,
        decodeURIComponent("$1")
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("獲取文章時出錯:", error);
    return NextResponse.json({ error: "獲取文章失敗" }, { status: 500 });
  }
}
