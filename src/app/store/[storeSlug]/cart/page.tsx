import StoreCartClient from "./cart-client";

interface Props {
  params: Promise<{ storeSlug: string }>;
}

export default async function StoreCartPage({ params }: Props) {
  const { storeSlug } = await params;
  return <StoreCartClient tenantSlug={storeSlug} />;
}
