import React, { useEffect, useState } from 'react';
import { List } from 'react-window';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';

const ROW_HEIGHT = 40;
const LIST_HEIGHT = 400;

function ItemRow({ index, style, items }) {
  const item = items[index];
  return (
    <div
      role="listitem"
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #eee',
        padding: '0 12px',
      }}
    >
      <Link to={'/items/' + item.id} style={{ color: "#17477a", textDecoration: "none", fontWeight: 500, fontSize: 14 }}>{item.name}</Link>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 32 }}>
      <div style={{
        width: 28,
        height: 28,
        border: '3px solid #e0e0e0',
        borderTopColor: '#17477a',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
    </div>
  );
}

function Items() {
  const { items, total, totalPages, fetchItems } = useData();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 300);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchItems({ page, q: debouncedQuery }, () => active)
      .catch(console.error)
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [fetchItems, page, debouncedQuery]);

  const listHeight = Math.min(LIST_HEIGHT, items.length * ROW_HEIGHT);

  return (
    <div style={{ maxWidth: 600, margin: '24px auto', fontFamily: 'sans-serif' }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <label
        htmlFor="item-search"
        style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 16, color: '#17477a' }}
      >
        Search Items
      </label>
      <input
        id="item-search"
        type="search"
        placeholder="Search items…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        aria-label="Search items"
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: 14,
          border: '1px solid #ccc',
          borderRadius: 6,
          boxSizing: 'border-box',
          marginBottom: 10,
        }}
      />

      <p
        aria-live="polite"
        aria-atomic="true"
        style={{ margin: '0 0 10px', color: '#666', fontSize: 13 }}
      >
        {loading ? 'Loading…' : `${total} result${total !== 1 ? 's' : ''}`}
      </p>

      <div
        role="list"
        aria-label="Items list"
        aria-busy={loading}
        style={{ border: '1px solid #ddd', borderRadius: 6, overflow: 'hidden' }}
      >
        {loading ? (
          <LoadingSpinner />
        ) : items.length === 0 ? (
          <p style={{ padding: '16px 12px', color: '#888', margin: 0 }}>No items found.</p>
        ) : (
          <List
            rowComponent={ItemRow}
            rowCount={items.length}
            rowHeight={ROW_HEIGHT}
            rowProps={{ items }}
            style={{
              height: listHeight,
              overflowX: 'hidden',
              overflowY: items.length * ROW_HEIGHT > LIST_HEIGHT ? 'auto' : 'hidden',
            }}
          />
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
        <button
          onClick={() => setPage(p => p - 1)}
          disabled={page <= 1 || loading}
          aria-label="Go to previous page"
          style={{ padding: '6px 14px', cursor: page <= 1 || loading ? 'not-allowed' : 'pointer' }}
        >
          Previous
        </button>
        <span
          aria-live="polite"
          aria-atomic="true"
          style={{ fontSize: 13, color: '#555' }}
        >
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page >= totalPages || loading}
          aria-label="Go to next page"
          style={{ padding: '6px 14px', cursor: page >= totalPages || loading ? 'not-allowed' : 'pointer' }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Items;
