import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ShopContext = createContext(null);

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:2223';

const DEFAULT_SHOP = {
  name: 'Shop Handle',
  city: '',
  shortName: 'SH',
};

export function ShopProvider({ children }) {
  const [shop, setShop] = useState(DEFAULT_SHOP);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/shop`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Failed to load shop details');
        return response.json();
      })
      .then((data) => {
        setShop({
          name: data.name || DEFAULT_SHOP.name,
          city: data.city || '',
          shortName: data.shortName || DEFAULT_SHOP.shortName,
        });
      })
      .catch(() => {
        setShop(DEFAULT_SHOP);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({ shop, loading }), [shop, loading]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export default function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within ShopProvider');
  }
  return context;
}
