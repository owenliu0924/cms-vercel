"use server";
import { PrismaClient } from "@prisma/client";
import { Article, Comment } from "@/types";
import path from "path";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  if (!global.prisma) {
    global.prisma = prisma;
  }
}

export async function getApprovedArticles(): Promise<Article[]> {
  const articles = await prisma.article.findMany({
    where: { status: "approved" },
  });
  return articles.map((article) => ({
    ...article,
    createdAt: article.createdAt.toISOString(),
  }));
}

export async function submitArticle(
  content: string,
  imageUrl: string
): Promise<string> {
  const article = await prisma.article.create({
    data: {
      content,
      imageUrl: imageUrl || null,
      status: "pending",
    },
  });
  return article.id;
}

export async function getPendingArticles(): Promise<Article[]> {
  const articles = await prisma.article.findMany({
    where: { status: "pending" },
  });
  return articles.map((article) => ({
    ...article,
    createdAt: article.createdAt.toISOString(),
  }));
}

export async function approveArticle(id: string): Promise<void> {
  try {
    await prisma.article.update({
      where: { id },
      data: { status: "approved" },
    });
    console.log(`Article ${id} approved successfully`);
  } catch (error) {
    console.error(`Error approving article ${id}:`, error);
    throw error;
  }
}

export async function rejectArticle(id: string, reason: string): Promise<void> {
  try {
    await prisma.article.update({
      where: { id },
      data: {
        status: "rejected",
        rejectionReason: reason,
      },
    });
    console.log(`Article ${id} rejected successfully`);
  } catch (error) {
    console.error(`Error rejecting article ${id}:`, error);
    throw error;
  }
}

export async function getAllArticles(): Promise<Article[]> {
  const articles = await prisma.article.findMany();
  return articles.map((article) => ({
    ...article,
    createdAt: article.createdAt.toISOString(),
  }));
}

export async function deleteArticle(id: string): Promise<void> {
  try {
    await prisma.article.delete({
      where: { id },
    });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      console.log(
        `Article with id ${id} not found, it may have been already deleted.`
      );
    } else {
      throw error;
    }
  }
}

export async function addArticle(
  article: Omit<Article, "id" | "createdAt">
): Promise<Article> {
  const newArticle = await prisma.article.create({
    data: article,
  });
  return {
    ...newArticle,
    createdAt: newArticle.createdAt.toISOString(),
  };
}

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      console.log(`Article with id ${id} not found`);
      return null;
    }

    return {
      ...article,
      createdAt: article.createdAt.toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching article with id ${id}:`, error);
    throw error;
  }
}

export async function getCommentsByArticleId(
  articleId: string
): Promise<Comment[]> {
  return prisma.comment.findMany({
    where: { articleId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createComment(
  articleId: string,
  content: string,
  authorName: string
): Promise<Comment> {
  return prisma.comment.create({
    data: {
      articleId,
      content,
      authorName,
    },
  });
}

export async function hideArticle(id: string): Promise<void> {
  await prisma.article.update({
    where: { id },
    data: { status: "rejected" },
  });
}

export async function getAllArticlesForAdmin(): Promise<Article[]> {
  try {
    const articles = await prisma.article.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(`Found ${articles.length} articles in the database`);
    return articles.map((article) => ({
      ...article,
      createdAt: article.createdAt.toISOString(),
      imageUrl: article.imageUrl || "",
      status: article.status as "rejected" | "pending" | "approved",
      rejectionReason: article.rejectionReason || undefined,
    }));
  } catch (error) {
    console.error("Error in getAllArticlesForAdmin:", error);
    throw error;
  }
}

export async function deleteComment(commentId: string): Promise<void> {
  await prisma.comment.delete({
    where: { id: commentId },
  });
}
