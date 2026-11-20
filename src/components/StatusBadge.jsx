export default function StatusBadge({ status }) {
  const map = {
    approved: 'bg-green-100 text-green-700',
    paid: 'bg-green-100 text-green-700',
    completed: 'bg-green-100 text-green-700',
    submitted: 'bg-amber-100 text-amber-700',
    pending: 'bg-gray-100 text-gray-600',
    overdue: 'bg-red-100 text-red-700',
    cancelled: 'bg-red-100 text-red-700',
    rejected: 'bg-red-100 text-red-700',
    active: 'bg-blue-100 text-blue-700',
  };
  const label = status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {label}
    </span>
  );
}
