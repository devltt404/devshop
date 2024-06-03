import LoadingSpinner from "./LoadingSpinner.jsx";

const LoadingScreen = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner size={100} />
    </div>
  );
};

export default LoadingScreen;
