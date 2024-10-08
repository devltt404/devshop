import { useEffect, useState } from "react";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    // Immediately check the media query on initial render to prevent flicker
    return typeof window !== "undefined"
      ? window.matchMedia(query).matches
      : false;
  });

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const handleMediaChange = (event) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener("change", handleMediaChange);

    return () => {
      mediaQueryList.removeEventListener("change", handleMediaChange);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;
