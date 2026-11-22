'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialClusters, initialProducts, initialCatalogPrices, Cluster, Product, DailyCatalogPrice, Account, initialAccounts } from '@/lib/mock-data';

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
  const [clusters] = useState<Cluster[]>(initialClusters);
  const [selectedCluster, setSelectedClusterState] = useState<Cluster>(initialClusters[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<Account>(initialAccounts[4]); // Default to Ibu Ani (CUSTOMER)

  // Simulated group-buy community slots for current cluster
  const [groupBuySlotsFilled, setGroupBuySlotsFilled] = useState(7);
  const groupBuyTargetSlots = 10;

  // Load saved cluster & user role on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSlug = localStorage.getItem('agri_selected_cluster_slug');
      if (savedSlug) {
        const found = clusters.find((c) => c.qr_slug === savedSlug);
        if (found) setSelectedClusterState(found);
      }
      const savedRole = localStorage.getItem('agri_user_role');
      if (savedRole) {
        const matched = initialAccounts.find((a) => a.role === savedRole);
        if (matched) setCurrentUser(matched);
      }
    }
  }, [clusters]);

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
