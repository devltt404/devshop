import ProviderButtons from "@/components/auth/ProviderButtons.jsx";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Form } from "@/components/ui/form.jsx";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator.jsx";
import { toast } from "@/components/ui/use-toast.js";
import useValidateForm from "@/hooks/useValidateForm.jsx";
import { useLoginMutation } from "@/redux/api/auth.api.js";
import { setUser } from "@/redux/slices/auth.slice.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const LoginPage = () => {
  const dispatch = useDispatch();

  const [loginUser, { isLoading, error }] = useLoginMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = ({ email, password }) => {
    loginUser({
      email,
      password,
    })
      .unwrap()
      .then(({ metadata }) => {
        dispatch(setUser(metadata.user));
        toast({
          title: "Login successfully",
          description: `Welcome back, ${metadata.user.name}!`,
        });
      });
  };

  useValidateForm({ error, form });

  return (
    <Form {...form}>
      <form className="px-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader className="text-center">
          <CardTitle className="mb-3 text-3xl">Login</CardTitle>

          <CardDescription className="text-base">
            Not a member yet?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:underline"
            >
              Register
            </Link>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      error={form.formState.errors.email}
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      error={form.formState.errors.password}
                      type="password"
                      autoComplete="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>

        <CardFooter className="mt-3 flex-col items-stretch">
          <Button disabled={isLoading} type="submit" className="w-full">
            Login
          </Button>

          <div className="my-6 flex items-center gap-2 self-stretch text-sm text-muted-foreground">
            <Separator className="flex-1" />
            <span className="mx-20">or</span>
            <Separator className="flex-1" />
          </div>

          <ProviderButtons />
        </CardFooter>
      </form>
    </Form>
  );
};

export default LoginPage;
