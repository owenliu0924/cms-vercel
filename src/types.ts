export interface Article {
  id: string;
  content: string;
  imageUrl: string | null; // 修改這裡
  status: string;
  createdAt: Date;
  rejectionReason: string | null;
}
