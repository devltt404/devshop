import { useAuthGoogleMutation } from "@/redux/api/auth.api.js";
import { setUser } from "@/redux/slices/auth.slice.js";
import { useGoogleLogin } from "@react-oauth/google";
import { Facebook } from "lucide-react";
import { useDispatch } from "react-redux";
import GoogleIcon from "../icons/GoogleIcon.jsx";
import { Button } from "../ui/button.jsx";
import { toast } from "../ui/use-toast.js";

const ProviderButtons = () => {
  const dispatch = useDispatch();
  const [authGoogle, { isLoading }] = useAuthGoogleMutation();

  const handleGoogleLoginSuccess = async (response) => {
    try {
      console.log(response);
      const data = await authGoogle({
        accessToken: response.access_token,
      }).unwrap();
      dispatch(setUser(data.metadata?.user));

      toast({
        title: "Login successfully",
        description: `Welcome back, ${data.metadata?.user?.name}!`,
      });
    } catch (error) {
      toast({
        title: "Login with Google failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGoogleLoginError = (error) => {
    toast({
      title: "Login with Google failed",
      description: error.message,
      variant: "destructive",
    });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginError,
  });

  return (
    <div className="grid grid-cols-2 gap-8">
      <Button
        onClick={googleLogin}
        type="button"
        className="w-full shadow-sm"
        variant="outline"
      >
        <GoogleIcon className="mr-2 h-4 w-4" />
        Google
      </Button>

      <Button type="button" className="w-full shadow-sm" variant="outline">
        <Facebook className="mr-2 h-4 w-4" />
        Facebook
      </Button>
    </div>
  );
};

export default ProviderButtons;
