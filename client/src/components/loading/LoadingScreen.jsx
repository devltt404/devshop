import { useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import SimpleLogoIcon from "../icons/SimpleLogoIcon.jsx";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(100);
  }, []);

  return (
    <>
      <LoadingBar color="#f11946" progress={progress} waitingTime={200} />
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <SimpleLogoIcon className="animate-pulse-and-rotate w-36" />;
      </div>
    </>
  );
};

export default LoadingScreen;
