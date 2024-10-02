import { NextResponse } from "next/server";
import { approveArticle } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`API: Approving article with id: ${params.id}`);
    await approveArticle(params.id);
    console.log("API: Article approved successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API: Error approving article:", error);
    return NextResponse.json(
      { error: "Failed to approve article" },
      { status: 500 }
    );
  }
}
