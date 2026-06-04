import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = useCallback(async ({ page = 1, q = '' } = {}, isActive) => {
    const params = new URLSearchParams({ page, pageSize: 2 });
    if (q) params.set('q', q);
    const res = await fetch(`http://localhost:4001/api/items?${params}`);
    const json = await res.json();
    if (isActive()) {
      setItems(json.items);
      setTotal(json.total);
      setTotalPages(json.totalPages);
    }
  }, []);

  return (
    <DataContext.Provider value={{ items, total, totalPages, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
