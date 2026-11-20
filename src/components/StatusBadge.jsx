import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function StatusBadge({ status, className = '' }) {
  const map = {
    approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    submitted: 'bg-amber-100 text-amber-800 border-amber-200',
    pending: 'bg-gray-100 text-gray-700 border-gray-200',
    overdue: 'bg-red-100 text-red-800 border-red-300 font-bold',
    action_required: 'bg-red-50 text-red-700 border-red-300 font-extrabold ring-1 ring-red-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    active: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const labelMap = {
    action_required: 'Action Required',
    submitted: 'Proof Submitted',
  };

  const label = labelMap[status] || status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        map[status] || 'bg-gray-100 text-gray-600 border-gray-200'
      } ${className}`}
    >
      {(status === 'action_required' || status === 'overdue') && (
        <AlertCircle className="w-3 h-3 text-red-600 shrink-0" />
      )}
      {label}
    </span>
  );
}
