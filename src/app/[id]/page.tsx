import { getArticleById } from "@/lib/db";
import Image from "next/image";

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
        <h1>{article.content.substring(0, 50)}...</h1>
        <p>{article.content}</p>
        {article.imageUrl && (
          <Image
            src={article.imageUrl}
            alt="Article image"
            width={640}
            height={480}
            unoptimized
          />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching article:", error);
    return <div>加載文章時出錯</div>;
  }
}
