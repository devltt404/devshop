import { cn } from "@/lib/utils.js";
import { useEffect, useState } from "react";

const AnimatePresence = ({ isVisible, children, animate, exit }) => {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    }
  }, [isVisible]);

  const onAnimationEnd = () => {
    if (!isVisible) {
      setShouldRender(false);
    }
  };

  return shouldRender ? (
    <div
      className={cn(isVisible ? animate : exit)}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  ) : null;
};

export default AnimatePresence;
