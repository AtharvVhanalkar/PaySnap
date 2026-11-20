import { Star } from 'lucide-react';

export default function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i <= Math.round(rating)
                ? 'text-amber-400 fill-amber-400'
                : 'text-gray-200 fill-gray-100'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-500 ml-1">
        {rating}
        {count !== undefined && ` (${count})`}
      </span>
    </div>
  );
}
