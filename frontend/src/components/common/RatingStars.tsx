import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: number;
  reviewCount?: number;
  showCount?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = 14,
  reviewCount,
  showCount = false,
  interactive = false,
  onRatingChange,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {Array.from({ length: maxStars }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = displayRating >= starValue;
          const isHalf = !isFilled && displayRating >= starValue - 0.5;

          return (
            <button
              key={index}
              type={interactive ? 'button' : undefined}
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={`${interactive ? 'cursor-pointer transition-transform hover:scale-110 p-0.5' : 'cursor-default'}`}
            >
              <Star
                size={size}
                className={`${
                  isFilled
                    ? 'text-amber-500 fill-amber-500'
                    : isHalf
                    ? 'text-amber-500 fill-amber-500/50'
                    : 'text-gray-300'
                }`}
              />
            </button>
          );
        })}
      </div>

      {showCount && (
        <span className="text-xs text-cocoa-500 font-medium">
          ({reviewCount !== undefined ? reviewCount : Number(rating).toFixed(1)})
        </span>
      )}
    </div>
  );
};
