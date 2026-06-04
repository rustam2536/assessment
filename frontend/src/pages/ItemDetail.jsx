import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/items/' + id)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(setItem)
      .catch(() => navigate('/'));
  }, [id, navigate]);

  if (!item) return <p style={{ maxWidth: 600, margin: '24px auto', fontFamily: 'sans-serif' }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 600, margin: '24px auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: "#17477a", textDecoration: "none", fontWeight: 500, fontSize: 18 }}>{item.name}</h2>
      <p><strong style={{ color: "#17477a", textDecoration: "none", fontWeight: 500, fontSize: 18 }}>Category:</strong> {item.category}</p>
      <p><strong style={{ color: "#17477a", textDecoration: "none", fontWeight: 500, fontSize: 18 }}>Price:</strong> ${item.price}</p>
    </div>
  );
}

export default ItemDetail;