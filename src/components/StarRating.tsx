import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const feedbackTexts = ["Terrible", "Bad", "Okay", "Good", "Great"];

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
}

export default function StarRating({ value, onChange }: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const displayRating = hoveredRating ?? value;
  const feedback = feedbackTexts[Math.round(displayRating) - 1] || "Rate this";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex">
        {[...Array(feedbackTexts.length)].map((_, index) => {
          const starValue = index + 1;

          return (
            <button
              key={index}
              className="group relative"
              type="button"
              onClick={() => onChange(starValue)}
              onMouseEnter={() => setHoveredRating(starValue)}
              onMouseLeave={() => setHoveredRating(null)}
            >
              <Star
                className={cn(
                  "h-11 w-11 transition-colors",
                  starValue <= displayRating
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-gray-400"
                )}
              />
            </button>
          );
        })}
      </div>
      <p className="text-sm font-medium">{feedback}</p>
    </div>
  );
}
