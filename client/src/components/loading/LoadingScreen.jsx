import { useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import SimpleLogoIcon from "../icons/SimpleLogoIcon.jsx";

const LoadingScreen = ({ size = "lg" }) => {
  const sizes = {
    sm: "w-24",
    md: "w-32",
    lg: "w-36",
  };
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(100);
  }, []);

  return (
    <>
      <LoadingBar color="#f11946" progress={progress} waitingTime={200} />
      <div className="fixed inset-0 flex items-center justify-center">
        <SimpleLogoIcon className={"animate-pulse-and-rotate " + sizes[size]} />
      </div>
    </>
  );
};

export default LoadingScreen;
