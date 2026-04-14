"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product, Order } from "@/types";
import { fetchStoreProducts, addProduct, deleteProductRecord } from "@/lib/firebase/products";
import { fetchStoreOrders, updateOrderStatus, OrderWithItems } from "@/lib/firebase/orders";
import { formatPrice } from "@/lib/utils";
import { Package, Plus, Trash2, Loader2, Image as ImageIcon, ClipboardList, TrendingUp } from "lucide-react";

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
      fetchStoreOrders(storeId).then(setOrders)
    ]).finally(() => setLoading(false));
  }, [storeId]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    setSaving(true);
    try {
      const newProduct = await addProduct(
        storeId, 
        { name, price: parseFloat(price), description: desc, slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-") },
        file
      );
      setProducts([newProduct, ...products]);
      setName(""); setPrice(""); setDesc(""); setFile(null);
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
      setProducts(products.filter(p => p.id !== productId));
    } catch(err) {
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

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-white h-8 w-8" /></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 text-white">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-extrabold">Store Dashboard</h1>
           <p className="text-gray-400 mt-1">Manage your catalog and fulfill orders securely.</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-gray-900 rounded-lg p-1 border border-white/10 w-fit">
           <button 
             onClick={() => setTab("products")}
             className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${tab === 'products' ? 'bg-white/10 text-white shadow' : 'text-gray-500 hover:text-white'}`}
           >
             <Package className="w-4 h-4" /> Products
           </button>
           <button 
             onClick={() => setTab("orders")}
             className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${tab === 'orders' ? 'bg-white/10 text-white shadow' : 'text-gray-500 hover:text-white'}`}
           >
             <ClipboardList className="w-4 h-4" /> Orders
           </button>
        </div>
      </div>
      
      {/* Analytics HUD */}
      <div className="grid sm:grid-cols-3 gap-6 mb-8">
         <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl">
           <div className="text-emerald-500 mb-2"><TrendingUp className="w-6 h-6" /></div>
           <div className="text-sm text-gray-400 font-medium tracking-wide uppercase">Revenue Generated</div>
           <div className="text-3xl font-extrabold text-white mt-1">{formatPrice(totalRevenue)}</div>
         </div>
         <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl">
           <div className="text-indigo-400 mb-2"><ClipboardList className="w-6 h-6" /></div>
           <div className="text-sm text-gray-400 font-medium tracking-wide uppercase">Total Orders</div>
           <div className="text-3xl font-extrabold text-white mt-1">{orders.length}</div>
         </div>
         <div className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-2xl">
           <div className="text-purple-400 mb-2"><Package className="w-6 h-6" /></div>
           <div className="text-sm text-gray-400 font-medium tracking-wide uppercase">Total Products</div>
           <div className="text-3xl font-extrabold text-white mt-1">{products.length}</div>
         </div>
      </div>

      {/* Products Tab */}
      {tab === "products" && (
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5"/> Add Product</h2>
            <form onSubmit={handleCreateProduct} className="flex flex-col gap-4">
              <input required value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Product Name" className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 outline-none focus:border-indigo-500 transition-all" />
              <input required value={price} onChange={e => setPrice(e.target.value)} type="number" step="0.01" placeholder="Price ($)" className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 outline-none focus:border-indigo-500 transition-all" />
              <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" rows={3} className="w-full bg-black/50 border border-gray-800 rounded-lg p-3 outline-none focus:border-indigo-500 transition-all"></textarea>
              
              <div className="border border-dashed border-gray-700 bg-black/20 rounded-lg p-4 text-center hover:bg-black/40 transition-colors relative cursor-pointer group">
                <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                <div className="flex flex-col items-center gap-1 group-hover:text-indigo-400 transition-colors">
                  <ImageIcon className="text-gray-500 w-6 h-6 group-hover:text-indigo-400 transition-colors" />
                  <span className="text-sm text-gray-400 group-hover:text-indigo-300">{file ? file.name : "Upload Image"}</span>
                </div>
              </div>

              <button disabled={saving} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg flex items-center justify-center disabled:opacity-50 mt-2 transition-all shadow-lg shadow-indigo-600/20">
                {saving ? <Loader2 className="animate-spin h-5 w-5" /> : "Save to Store"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><Package className="w-5 h-5"/> Your Catalog ({products.length})</h2>
            {products.length === 0 ? (
               <div className="p-10 border border-dashed border-white/10 rounded-2xl text-center text-gray-500">No products found.</div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p.id} className="flex flex-col bg-gray-900 border border-white/5 rounded-2xl overflow-hidden group">
                    {p.images?.[0] ? (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        width={600}
                        height={400}
                        className="h-48 w-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="h-48 bg-gray-800 flex items-center justify-center">No Image</div>
                    )}
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="font-bold text-lg leading-tight">{p.name}</h3>
                      <p className="text-indigo-400 font-bold mt-1">${p.price.toFixed(2)}</p>
                      <div className="mt-auto pt-4 flex justify-end">
                        <button onClick={() => handleDeleteProduct(p.id, p.images?.[0])} className="text-red-500 hover:text-red-400 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors">
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
        <div className="space-y-6">


          <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 border-dashed flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">Order History</h2>
            </div>
            
            {orders.length === 0 ? (
               <div className="p-20 text-center text-gray-500">No orders have been placed yet.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {orders.map(order => (
                  <div key={order.id} className="p-6 hover:bg-white/[0.02] transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                       <div>
                          <div className="text-xs text-gray-500 mb-1">Order ID: {order.id}</div>
                          <div className="flex items-center gap-3">
                             <span className="text-xl font-extrabold text-white">{formatPrice(order.total_amount || order.totalAmount || 0)}</span>
                             <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">{order.payment_method?.toUpperCase()}</span>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-400">Status</span>
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value as string)}
                            className={`bg-black border rounded-lg px-3 py-1.5 text-sm font-semibold outline-none cursor-pointer focus:border-indigo-500 transition-colors
                              ${order.status === 'pending' ? 'text-amber-400 border-amber-400/20' : ''}
                              ${order.status === 'paid' ? 'text-indigo-400 border-indigo-400/20' : ''}
                              ${order.status === 'shipped' ? 'text-blue-400 border-blue-400/20' : ''}
                              ${order.status === 'delivered' ? 'text-emerald-400 border-emerald-400/20' : ''}
                            `}
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                       </div>
                    </div>
                    
                    <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                       <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Items Purchased</h4>
                       <div className="space-y-2">
                         {order.items.map(item => {
                           const realProduct = products.find(p => p.id === item.product_id);
                           return (
                             <div key={item.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3 text-gray-300">
                                   <span className="text-gray-500">{item.quantity}x</span>
                                   <span className="font-medium text-white">{realProduct?.name || "Unknown Product"}</span>
                                </div>
                                <span className="text-gray-400">{formatPrice(item.price)}</span>
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
