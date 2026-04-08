import type { Metadata } from "next";

// Static metadata
export const metadata: Metadata = {
  title: "Products",
  description: "Browse all products",
  openGraph: { title: "Products", type: "website" },
};

// Dynamic metadata
export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const product = await getProduct(params.id);
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      images: [product.imageUrl],
    },
  };
}