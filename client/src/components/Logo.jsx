import { cn } from "@/lib/utils.js";
import { Link } from "react-router-dom";

export default function Logo({ color = "black", className }) {
  const logoSrc = {
    black: "/logo.svg",
    white: "/logo-white.svg",
  };

  return (
    <Link to="/" className="inline-block">
      <img src={logoSrc[color]} alt="Logo" className={cn("w-48", className)} />
    </Link>
  );
}
