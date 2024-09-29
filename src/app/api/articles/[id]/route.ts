import { NextResponse } from "next/server";
import { getArticleById } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 假設這是從數據庫獲取文章的函數
  const article = await getArticleFromDatabase(params.id);

  // 處理圖片URL
  if (article.image) {
    article.image = article.image.replace(
      /^https:\/\/cms\.owen0924\.co\/_next\/image\?url=(.+)&w=\d+&q=\d+$/,
      decodeURIComponent("$1")
    );
  }

  return NextResponse.json(article);
}
