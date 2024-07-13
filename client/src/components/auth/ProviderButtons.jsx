import { useAuthGoogleMutation } from "@/redux/api/auth.api.js";
import { setUser } from "@/redux/slices/auth.slice.js";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import FacebookIcon from "../icons/FacebookIcon.jsx";
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
    <div>
      <Button
        onClick={googleLogin}
        type="button"
        className="mb-4 w-full shadow-sm"
        variant="outline"
      >
        <GoogleIcon className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>

      <Button type="button" className="w-full shadow-sm" variant="outline">
        <FacebookIcon className="mr-2 h-5 w-5" />
        Continue with Facebook
      </Button>
    </div>
  );
};

export default ProviderButtons;
