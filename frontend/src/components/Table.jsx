import React, { useState } from 'react';

export default function Table({ columns, data, onSort }) {
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('ASC');

  const handleSort = (field) => {
    const nextOrder = sortField === field && sortOrder === 'ASC' ? 'DESC' : 'ASC';
    setSortField(field);
    setSortOrder(nextOrder);
    if (onSort) onSort(field, nextOrder);
  };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
      <thead>
        <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
          {columns.map((col) => (
            <th 
              key={col.key} 
              onClick={() => col.sortable && handleSort(col.key)} 
              style={{ padding: '0.75rem', textAlign: 'left', cursor: col.sortable ? 'pointer' : 'default' }}
            >
              {col.label} {col.sortable && sortField === col.key ? (sortOrder === 'ASC' ? '▲' : '▼') : ''}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={{ padding: '1rem', textAlign: 'center' }}>No records found</td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr key={row.id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
              {columns.map((col) => (
                <td key={col.key} style={{ padding: '0.75rem' }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}