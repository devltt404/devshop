import { Fragment, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTopWrapper = ({ children }) => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname, search]);

  return <Fragment>{children}</Fragment>;
};

export default ScrollToTopWrapper;
