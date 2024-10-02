"use client";

import { useState, useEffect } from "react";
import { Article } from "@/types";
import Image from "next/image";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingArticleId, setRejectingArticleId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AdminPage mounted, fetching articles...");
    fetchArticles();
  }, []);

  async function fetchArticles() {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching articles...");
      const response = await fetch("/api/admin/articles");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched articles:", data);
      if (Array.isArray(data.articles)) {
        setArticles(data.articles);
      } else {
        throw new Error("Received data is not an array");
      }
    } catch (err) {
      console.error("Client: Error fetching articles:", err);
      setError(
        `Failed to fetch articles. Error: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleApprove(id: string) {
    try {
      console.log(`Approving article with id: ${id}`);
      const response = await fetch(`/api/admin/articles/${id}/approve`, {
        method: "POST",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to approve article");
      }
      console.log(
        "Article approved successfully, fetching updated articles..."
      );
      await fetchArticles();
    } catch (err) {
      console.error("Error approving article:", err);
      setError(
        err instanceof Error ? err.message : "Failed to approve article"
      );
    }
  }

  async function handleReject(id: string, reason: string) {
    try {
      console.log(`Rejecting article with id: ${id}, reason: ${reason}`);
      const response = await fetch(`/api/admin/articles/${id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) throw new Error("Failed to reject article");
      console.log(
        "Article rejected successfully, fetching updated articles..."
      );
      await fetchArticles();
    } catch (err) {
      console.error("Error rejecting article:", err);
      setError("Failed to reject article");
    }
  }

  const openRejectDialogHandler = (id: string) => {
    setRejectingArticleId(id);
    setOpenRejectDialog(true);
  };

  const closeRejectDialog = () => {
    setOpenRejectDialog(false);
    setRejectReason("");
    setRejectingArticleId(null);
  };

  const submitReject = async () => {
    if (rejectingArticleId) {
      await handleReject(rejectingArticleId, rejectReason);
      closeRejectDialog();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">管理員頁面</h1>
      <button
        onClick={fetchArticles}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        刷新文章列表
      </button>
      {articles.length === 0 ? (
        <p>目前沒有文章。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article: Article) => (
            <div
              key={article.id}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              {article.imageUrl ? (
                <div className="relative h-48">
                  <Image
                    src={article.imageUrl}
                    alt="Article image"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              <div className="p-4">
                <p className="text-white mb-2">
                  {article.content.substring(0, 100)}...
                </p>
                <p className={`text-sm mb-2 ${getStatusColor(article.status)}`}>
                  狀態: {article.status}
                </p>
                <div className="flex justify-between">
                  {article.status !== "rejected" && (
                    <button
                      onClick={() => openRejectDialogHandler(article.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      拒絕
                    </button>
                  )}
                  {article.status === "pending" && (
                    <button
                      onClick={() => handleApprove(article.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      通過
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ThemeProvider theme={darkTheme}>
        <Dialog open={openRejectDialog} onClose={closeRejectDialog}>
          <DialogTitle>拒絕文章</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="reason"
              label="拒絕原因"
              type="text"
              fullWidth
              variant="outlined"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeRejectDialog}>取消</Button>
            <Button onClick={submitReject} color="primary">
              確認拒絕
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </div>
  );
}
