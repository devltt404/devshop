import { Button } from "@/components/ui/button.jsx";
import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex justify-center text-8xl font-bold">
        4
        <ShieldAlert className="h-24 w-24 text-red-600" />4
      </div>
      <p className="mb-2 mt-8 text-xl font-semibold">Oops! You're lost.</p>
      <p className="mb-8 text-muted-foreground">
        The page you are looking for is not found
      </p>
      <Button asChild className="w-fit" size="lg">
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  );
}
