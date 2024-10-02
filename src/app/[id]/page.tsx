import { getArticleById } from "@/lib/db";

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const article = await getArticleById(params.id);

    if (!article) {
      return <div>文章未找到</div>;
    }

    return (
      <div>
        <h1>{article.title}</h1>
        <p>{article.content}</p>
        {article.imageUrl && <img src={article.imageUrl} alt="Article image" />}
      </div>
    );
  } catch (error) {
    console.error("Error fetching article:", error);
    return <div>加載文章時出錯</div>;
  }
}
