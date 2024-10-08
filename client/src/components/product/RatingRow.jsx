import {
  EmptyStarIcon,
  FilledStarIcon,
  HalfStarIcon,
} from "../icons/StarIcon.jsx";

const RatingRow = ({ rating }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star, index) => {
        if (rating >= star) {
          return (
            <FilledStarIcon
              key={index}
              className="h-4 w-4 fill-[#ffa41c] text-[#ffa41c]"
            />
          );
        } else if (rating >= star - 0.5) {
          return (
            <HalfStarIcon key={index} className="h-4 w-4 fill-[#ffa41c]" />
          );
        } else {
          return (
            <EmptyStarIcon key={index} className="h-4 w-4 fill-[#ffa41c]" />
          );
        }
      })}
    </div>
  );
};

export default RatingRow;
