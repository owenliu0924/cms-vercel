async function getArticle(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`,
      { next: { revalidate: 60 } }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch article:", error);
    throw error;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const article = await getArticle(params.id);

    return (
      <div>
        <h1>{article.title}</h1>
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        )}
        <p>{article.content}</p>
      </div>
    );
  } catch (error) {
    return <div>文章加載失敗：{(error as Error).message}</div>;
  }
}
