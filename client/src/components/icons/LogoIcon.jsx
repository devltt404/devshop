import SimpleLogoIcon from "./SimpleLogoIcon.jsx";

const LogoIcon = () => {
  return (
    <div className="flex items-center gap-2">
      <SimpleLogoIcon className="w-7" />
      <span className="text-3xl font-bold text-primary">DevShop</span>
    </div>
  );
};

export default LogoIcon;
