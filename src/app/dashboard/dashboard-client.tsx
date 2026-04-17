"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product, Order } from "@/types";
import { fetchStoreProducts, addProduct, deleteProductRecord } from "@/lib/firebase/products";
import { fetchStoreOrders, updateOrderStatus, OrderWithItems } from "@/lib/firebase/orders";
import { formatPriceFromRupees } from "@/lib/utils";
import {
  Package,
  Plus,
  Trash2,
  Loader2,
  Image as ImageIcon,
  ClipboardList,
  TrendingUp,
  IndianRupee,
} from "lucide-react";

type OrderStatus = Order["status"];
type OrderWithLegacyFields = OrderWithItems & {
  total_amount?: number;
  payment_method?: string;
};

export default function DashboardClient({ storeId }: { storeId: string }) {
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderWithLegacyFields[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchStoreProducts(storeId).then(setProducts),
      fetchStoreOrders(storeId).then(setOrders),
    ]).finally(() => setLoading(false));
  }, [storeId]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    setSaving(true);
    try {
      const newProduct = await addProduct(
        storeId,
        {
          name,
          price: parseFloat(price),
          description: desc,
          slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        },
        file
      );
      setProducts([newProduct, ...products]);
      setName("");
      setPrice("");
      setDesc("");
      setFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string, imageUrl?: string) => {
    if (!confirm("Delete product?")) return;
    try {
      await deleteProductRecord(productId, imageUrl);
      setProducts(products.filter((p) => p.id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const totalRevenue = orders.reduce((acc, order) => {
    if (order.status !== "pending") return acc + (order.totalAmount || order.total_amount || 0);
    return acc;
  }, 0);

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-[var(--primary)] h-8 w-8" />
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-[var(--on-surface)]">
            Store Dashboard
          </h1>
          <p className="text-[var(--on-surface-variant)] mt-1 text-sm">
            Manage your catalog and fulfill orders
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex rounded-xl bg-[var(--surface-container-lowest)] p-1 w-fit">
          <button
            onClick={() => setTab("products")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === "products"
                ? "gradient-primary text-white shadow"
                : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"
            }`}
          >
            <Package className="w-4 h-4" /> Products
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === "orders"
                ? "gradient-primary text-white shadow"
                : "text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]"
            }`}
          >
            <ClipboardList className="w-4 h-4" /> Orders
          </button>
        </div>
      </div>

      {/* Analytics HUD */}
      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        <div className="rounded-2xl bg-emerald-500/10 p-6 ghost-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
              <IndianRupee className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--on-surface-variant)]">
              Revenue
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[var(--on-surface)]">
            {formatPriceFromRupees(totalRevenue)}
          </div>
        </div>
        <div className="rounded-2xl bg-indigo-500/10 p-6 ghost-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
              <ClipboardList className="h-5 w-5 text-indigo-400" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--on-surface-variant)]">
              Total Orders
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[var(--on-surface)]">{orders.length}</div>
        </div>
        <div className="rounded-2xl bg-purple-500/10 p-6 ghost-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
              <Package className="h-5 w-5 text-purple-400" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--on-surface-variant)]">
              Products
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[var(--on-surface)]">{products.length}</div>
        </div>
      </div>

      {/* Products Tab */}
      {tab === "products" && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Product Form */}
          <div className="rounded-2xl bg-[var(--surface-container)] p-6 ghost-border h-fit">
            <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--on-surface)] mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" /> Add Product
            </h2>
            <form onSubmit={handleCreateProduct} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--on-surface-variant)]">Product Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Enter product name"
                  className="w-full rounded-xl bg-[var(--surface-container-lowest)] px-4 py-2.5 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none ghost-border focus:ring-2 focus:ring-[var(--primary-container)] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--on-surface-variant)]">Price (₹)</label>
                <input
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  step="1"
                  min="1"
                  placeholder="e.g., 599"
                  className="w-full rounded-xl bg-[var(--surface-container-lowest)] px-4 py-2.5 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none ghost-border focus:ring-2 focus:ring-[var(--primary-container)] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--on-surface-variant)]">Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Product description"
                  rows={3}
                  className="w-full rounded-xl bg-[var(--surface-container-lowest)] px-4 py-2.5 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none ghost-border focus:ring-2 focus:ring-[var(--primary-container)] transition-all resize-none"
                />
              </div>

              <div className="btn-secondary w-full py-6 flex-col gap-2 relative cursor-pointer group hover:bg-[var(--surface-container-low)]">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                />
                <div className="flex flex-col items-center gap-1.5">
                  <ImageIcon className="text-[var(--outline)] w-6 h-6 group-hover:text-[var(--primary)] transition-colors" />
                  <span className="text-xs text-[var(--on-surface-variant)] group-hover:text-[var(--primary)] font-medium">
                    {file ? file.name : "Choose Product Image"}
                  </span>
                </div>
              </div>

              <button
                disabled={saving}
                className="btn-primary w-full mt-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Save to Store
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Product Catalog */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--on-surface)] flex items-center gap-2">
              <Package className="w-5 h-5" /> Your Catalog ({products.length})
            </h2>
            {products.length === 0 ? (
              <div className="flex flex-col items-center py-16 rounded-2xl bg-[var(--surface-container)] ghost-border text-center">
                <Package className="h-10 w-10 text-[var(--outline)]" />
                <p className="mt-3 text-sm text-[var(--on-surface-variant)]">No products found</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-col rounded-2xl bg-[var(--surface-container)] overflow-hidden ghost-border group"
                  >
                    {p.images?.[0] ? (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        width={600}
                        height={400}
                        className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-48 bg-[var(--surface-container-low)] flex items-center justify-center">
                        <Package className="h-8 w-8 text-[var(--outline)]" />
                      </div>
                    )}
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="font-bold text-sm text-[var(--on-surface)]">{p.name}</h3>
                      <p className="text-[var(--primary)] font-bold mt-1 text-sm">
                        {formatPriceFromRupees(p.price)}
                      </p>
                      <div className="mt-auto pt-4 flex justify-end">
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.images?.[0])}
                          className="btn-secondary p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/20"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === "orders" && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[var(--surface-container)] overflow-hidden ghost-border">
            <div className="p-6 flex justify-between items-center">
              <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--on-surface)] flex items-center gap-2">
                Order History
              </h2>
            </div>

            {orders.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <ClipboardList className="h-10 w-10 text-[var(--outline)]" />
                <p className="mt-3 text-sm text-[var(--on-surface-variant)]">No orders yet</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--outline-variant)]/10">
                {orders.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-[var(--surface-container-high)]/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="text-xs text-[var(--outline)] font-mono mb-1">
                          #{order.id.slice(0, 12)}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-extrabold text-[var(--on-surface)]">
                            {formatPriceFromRupees(order.total_amount || order.totalAmount || 0)}
                          </span>
                          {order.payment_method && (
                            <span className="rounded-full bg-[var(--surface-container-high)] px-2.5 py-0.5 text-xs text-[var(--on-surface-variant)]">
                              {order.payment_method.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-[var(--on-surface-variant)]">Status</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value as string)}
                          className={`bg-[var(--surface-container-lowest)] rounded-xl px-3 py-2 text-sm font-semibold outline-none ghost-border focus:ring-2 focus:ring-[var(--primary-container)] cursor-pointer transition-all
                            ${order.status === "pending" ? "text-amber-400" : ""}
                            ${order.status === "paid" ? "text-indigo-400" : ""}
                            ${order.status === "shipped" ? "text-blue-400" : ""}
                            ${order.status === "delivered" ? "text-emerald-400" : ""}
                          `}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                    <div className="rounded-xl bg-[var(--surface-container-lowest)] p-4 ghost-border">
                      <h4 className="text-xs font-bold text-[var(--outline)] uppercase tracking-widest mb-3">
                        Items Purchased
                      </h4>
                      <div className="space-y-2">
                        {order.items.map((item) => {
                          const realProduct = products.find((p) => p.id === item.product_id);
                          return (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-3 text-[var(--on-surface-variant)]">
                                <span className="text-[var(--outline)]">{item.quantity}x</span>
                                <span className="font-medium text-[var(--on-surface)]">
                                  {realProduct?.name || "Unknown Product"}
                                </span>
                              </div>
                              <span className="text-[var(--on-surface-variant)]">
                                {formatPriceFromRupees(item.price)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
