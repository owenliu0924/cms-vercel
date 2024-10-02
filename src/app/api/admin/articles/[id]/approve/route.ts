import { NextResponse } from "next/server";
import { approveArticle } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log(`Approve route handler called for article id: ${params.id}`); // 新增日誌
  try {
    await approveArticle(params.id);
    console.log(`Article ${params.id} approved successfully`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error approving article:", error);
    return NextResponse.json(
      { error: "Failed to approve article" },
      { status: 500 }
    );
  }
}
