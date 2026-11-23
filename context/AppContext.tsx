'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialClusters,
  initialProducts,
  initialCatalogPrices,
  initialOrders,
  Cluster,
  Product,
  DailyCatalogPrice,
  Account,
  initialAccounts,
  Order
} from '@/lib/mock-data';

export interface CartItem {
  product: Product;
  price: DailyCatalogPrice;
  qty: number;
}

interface AppContextType {
  // Cluster & Geofencing
  selectedCluster: Cluster;
  setSelectedCluster: (cluster: Cluster) => void;
  clusters: Cluster[];
  selectClusterBySlug: (slug: string) => boolean;
  addCluster: (cluster: Omit<Cluster, 'id'>) => void;
  updateCluster: (clusterId: string, updates: Partial<Cluster>) => void;
  deleteCluster: (clusterId: string) => void;
  activateWaitlistCluster: (clusterId: string) => void;

  // Products Master & Catalog
  products: Product[];
  addProduct: (newProd: Omit<Product, 'id'>, initialSellPrice: number, modalPrice?: number) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  // Catalog Prices
  catalogPrices: DailyCatalogPrice[];
  updateCatalogPrice: (productId: string, newSellPrice: number, newModalPrice?: number) => void;

  // Orders Management
  orders: Order[];
  addNewOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, deliveryStatus: Order['delivery_status'], paymentStatus?: Order['payment_status']) => void;

  // Cart & Group-Buy
  cart: CartItem[];
  addToCart: (product: Product, price: DailyCatalogPrice, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  isGroupBuyEligible: boolean;
  projectedCashback: number;
  groupBuySlotsFilled: number;
  groupBuyTargetSlots: number;

  // Active User / Role simulation
  currentUser: Account;
  setCurrentUser: (account: Account) => void;
  switchRole: (role: Account['role']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [clusters, setClusters] = useState<Cluster[]>(initialClusters);
  const [selectedCluster, setSelectedClusterState] = useState<Cluster>(initialClusters[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<Account>(initialAccounts[4]); // Default to Ibu Ani (CUSTOMER)

  // Products & Prices Master State
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [catalogPrices, setCatalogPrices] = useState<DailyCatalogPrice[]>(initialCatalogPrices);

  // Orders State (Customer transactions)
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  // Simulated group-buy community slots for current cluster
  const [groupBuySlotsFilled, setGroupBuySlotsFilled] = useState(7);
  const groupBuyTargetSlots = 10;

  // Load saved cluster, user role, & custom products on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSlug = localStorage.getItem('agri_selected_cluster_slug');
      if (savedSlug) {
        const found = clusters.find((c) => c.qr_slug === savedSlug);
        if (found) setSelectedClusterState(found);
      }
      const savedClusters = localStorage.getItem('agri_clusters_master');
      if (savedClusters) {
        try {
          const parsed = JSON.parse(savedClusters);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setClusters(parsed);
          }
        } catch (e) {
          console.error('Failed to parse saved clusters', e);
        }
      }
      const savedRole = localStorage.getItem('agri_user_role');
      if (savedRole) {
        const matched = initialAccounts.find((a) => a.role === savedRole);
        if (matched) setCurrentUser(matched);
      }
      const savedProducts = localStorage.getItem('agri_custom_products');
      if (savedProducts) {
        try {
          const parsed = JSON.parse(savedProducts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          }
        } catch (e) {
          console.error('Failed to parse saved products', e);
        }
      }
      const savedOrders = localStorage.getItem('agri_orders_list');
      if (savedOrders) {
        try {
          const parsedOrders = JSON.parse(savedOrders);
          if (Array.isArray(parsedOrders) && parsedOrders.length > 0) {
            setOrders(parsedOrders);
          }
        } catch (e) {
          console.error('Failed to parse saved orders', e);
        }
      }
      const savedPrices = localStorage.getItem('agri_catalog_prices');
      if (savedPrices) {
        try {
          const parsedPrices = JSON.parse(savedPrices);
          if (Array.isArray(parsedPrices) && parsedPrices.length > 0) {
            setCatalogPrices(parsedPrices);
          }
        } catch (e) {
          console.error('Failed to parse saved prices', e);
        }
      }
    }
  }, [clusters]);

  // Cluster CRUD
  const addCluster = (newClusterData: Omit<Cluster, 'id'>) => {
    const newId = `c${Date.now()}`;
    const newCluster: Cluster = {
      ...newClusterData,
      id: newId,
    };
    setClusters((prev) => {
      const updated = [...prev, newCluster];
      if (typeof window !== 'undefined') {
        localStorage.setItem('agri_clusters_master', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateCluster = (clusterId: string, updates: Partial<Cluster>) => {
    setClusters((prev) => {
      const updated = prev.map((c) => (c.id === clusterId ? { ...c, ...updates } : c));
      if (typeof window !== 'undefined') {
        localStorage.setItem('agri_clusters_master', JSON.stringify(updated));
      }
      return updated;
    });
    if (selectedCluster.id === clusterId) {
      setSelectedClusterState((prev) => ({ ...prev, ...updates }));
    }
  };

  const deleteCluster = (clusterId: string) => {
    setClusters((prev) => {
      const updated = prev.filter((c) => c.id !== clusterId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('agri_clusters_master', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const activateWaitlistCluster = (clusterId: string) => {
    updateCluster(clusterId, {
      status: 'ACTIVE',
      delivery_mode: 'MOBILE_DROP_POINT',
      waitlist_count: 5,
    });
  };

  // Product CRUD
  const addProduct = (newProdData: Omit<Product, 'id'>, initialSellPrice: number, modalPrice?: number) => {
    const newId = `p${Date.now()}`;
    const newProduct: Product = {
      ...newProdData,
      id: newId,
    };

    const newPriceEntry: DailyCatalogPrice = {
      id: `cp-${newId}`,
      cycle_id: 'd1',
      product_id: newId,
      sell_price_idr: initialSellPrice,
      min_safe_price_idr: modalPrice ? Math.round(modalPrice * 1.1) : Math.round(initialSellPrice * 0.8),
      is_failover_3p: !newProduct.is_1p,
      signal_type: 'STABLE',
      farmer_split_idr: modalPrice || Math.round(initialSellPrice * 0.7),
      ops_split_idr: initialSellPrice - (modalPrice || Math.round(initialSellPrice * 0.7)),
    };

    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('agri_custom_products', JSON.stringify(updated));
      }
      return updated;
    });

    setCatalogPrices((prev) => [newPriceEntry, ...prev]);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === productId ? { ...p, ...updates } : p));
      if (typeof window !== 'undefined') {
        localStorage.setItem('agri_custom_products', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('agri_custom_products', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateCatalogPrice = (productId: string, newSellPrice: number, newModalPrice?: number) => {
    setCatalogPrices((prev) => {
      const updated = prev.map((cp) => {
        if (cp.product_id === productId) {
          const farmerSplit = newModalPrice !== undefined ? newModalPrice : cp.farmer_split_idr;
          return {
            ...cp,
            sell_price_idr: newSellPrice,
            farmer_split_idr: farmerSplit,
            ops_split_idr: newSellPrice - farmerSplit,
          };
        }
        return cp;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('agri_catalog_prices', JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Order Management
  const addNewOrder = (newOrder: Order) => {
    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('agri_orders_list', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateOrderStatus = (
    orderId: string,
    deliveryStatus: Order['delivery_status'],
    paymentStatus?: Order['payment_status']
  ) => {
    setOrders((prev) => {
      const updated = prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            delivery_status: deliveryStatus,
            ...(paymentStatus ? { payment_status: paymentStatus } : {}),
          };
        }
        return o;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('agri_orders_list', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const switchRole = (role: Account['role']) => {
    const matched = initialAccounts.find((a) => a.role === role);
    if (matched) {
      setCurrentUser(matched);
      if (typeof window !== 'undefined') {
        localStorage.setItem('agri_user_role', role);
        document.cookie = `user_role=${role}; path=/; max-age=86400`;
      }
    }
  };

  const setSelectedCluster = (cluster: Cluster) => {
    setSelectedClusterState(cluster);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agri_selected_cluster_slug', cluster.qr_slug);
      document.cookie = `home_cluster_id=${cluster.id}; path=/; max-age=2592000`;
      document.cookie = `home_cluster_slug=${cluster.qr_slug}; path=/; max-age=2592000`;
    }
  };

  const selectClusterBySlug = (slug: string): boolean => {
    const found = clusters.find((c) => c.qr_slug === slug);
    if (found) {
      setSelectedCluster(found);
      return true;
    }
    return false;
  };

  // Cart operations
  const addToCart = (product: Product, price: DailyCatalogPrice, qty: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { product, price, qty }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, qty } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price.sell_price_idr * item.qty,
    0
  );

  // Group-buy qualification: Rp40.000 minimum
  const isGroupBuyEligible = cartTotal >= 40000;
  const projectedCashback = isGroupBuyEligible ? Math.round(cartTotal * 0.10) : 0;


  return (
    <AppContext.Provider
      value={{
        selectedCluster,
        setSelectedCluster,
        clusters,
        selectClusterBySlug,
        addCluster,
        updateCluster,
        deleteCluster,
        activateWaitlistCluster,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        catalogPrices,
        updateCatalogPrice,
        orders,
        addNewOrder,
        updateOrderStatus,
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartTotal,
        isGroupBuyEligible,
        projectedCashback,
        groupBuySlotsFilled,
        groupBuyTargetSlots,
        currentUser,
        setCurrentUser,
        switchRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
