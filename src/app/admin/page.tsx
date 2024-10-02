"use client";

import { useState, useEffect } from "react";
import {
  getAllArticlesForAdmin,
  approveArticle,
  rejectArticle,
} from "@/lib/db";
import { Article } from "@/types";

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  const fetchArticles = async () => {
    const fetchedArticles = await getAllArticlesForAdmin();
    setArticles(fetchedArticles);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleApprove = async (id: string) => {
    await approveArticle(id);
    await fetchArticles();
  };

  const handleReject = async (id: string) => {
    await rejectArticle(id, "Rejected by admin");
    await fetchArticles();
  };

  return (
    <div>
      <h1>管理員頁面</h1>
      {articles.map((article) => (
        <div key={article.id}>
          <p>{article.content.substring(0, 100)}...</p>
          <p>狀態: {article.status}</p>
          {article.status === "pending" && (
            <>
              <button onClick={() => handleApprove(article.id)}>通過</button>
              <button onClick={() => handleReject(article.id)}>拒絕</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
