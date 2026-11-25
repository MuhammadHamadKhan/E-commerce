// ORDER CONFIRMATION PAGE: /order/[code]
// Server shell: exports SEO metadata (noIndex) and streams the client order
// confirmation. The interactive logic lives in OrderContent.jsx ("use client").
import { Suspense } from "react";
import OrderContent from "./OrderContent";

export const generateMetadata = async ({ params }) => {
  const { code } = await params;
  return {
    title: `Order ${code} - Last Bite`,
    noIndex: true,
  };
};

export default async function OrderPage({ params }) {
  const { code } = await params;
  return (
    <Suspense fallback={<div className="py-xl">Loading your order…</div>}>
      <OrderContent code={code} />
    </Suspense>
  );
}
