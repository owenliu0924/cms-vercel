import { NextResponse } from "next/server";
import { rejectArticle } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { reason } = await request.json();
    console.log(
      `API: Rejecting article with id: ${params.id}, reason: ${reason}`
    );
    await rejectArticle(params.id, reason);
    console.log("API: Article rejected successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API: Error rejecting article:", error);
    return NextResponse.json(
      { error: "Failed to reject article" },
      { status: 500 }
    );
  }
}
