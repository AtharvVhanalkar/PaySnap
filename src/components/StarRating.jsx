export default function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}>★</span>
      ))}
      <span className="text-sm text-gray-500 ml-1">{rating}{count !== undefined && ` (${count})`}</span>
    </div>
  );
}
