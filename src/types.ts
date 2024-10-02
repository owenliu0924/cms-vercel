export interface Article {
  id: string;
  content: string;
  imageUrl: string | null;
  status: string;
  createdAt: Date;
  rejectionReason: string | null;
}
