// types/gallery/gallery.ts
export interface GalleryImage {
  id: number;
  src: string | null;
  title: string;
  tags: string[];
  prompt: string | null;
  testId: number | null;
  testTitle: string;
  testThumbnailUrl: string | null;
  category: string;
}

export interface Category {
  id: number;
  name: string;
}
