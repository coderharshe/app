import Link from "next/link";

interface Props {
  params: Promise<{ storeSlug: string }>;
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({ params, searchParams }: Props) {
  const { storeSlug } = await params;
  const { order } = await searchParams;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Payment Successful</h1>
      <p className="text-gray-300">Order ID: {order ?? "N/A"}</p>
      <Link className="rounded bg-indigo-600 px-4 py-2 text-white" href={`/store/${storeSlug}`}>
        Continue Shopping
      </Link>
    </div>
  );
}
