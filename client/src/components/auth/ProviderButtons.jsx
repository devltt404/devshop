import { Facebook } from "lucide-react";
import GoogleIcon from "../icons/GoogleIcon.jsx";
import { Button } from "../ui/button.jsx";

const ProviderButtons = () => (
  <div className="grid grid-cols-2 gap-8">
    <Button type="button" className="w-full shadow-sm" variant="outline">
      <GoogleIcon className="mr-2 h-4 w-4" />
      Google
    </Button>

    <Button type="button" className="w-full shadow-sm" variant="outline">
      <Facebook className="mr-2 h-4 w-4" />
      Facebook
    </Button>
  </div>
);

export default ProviderButtons;
