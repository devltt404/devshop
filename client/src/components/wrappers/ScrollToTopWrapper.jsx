import { Fragment, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTopWrapper = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <Fragment>{children}</Fragment>;
};

export default ScrollToTopWrapper;
