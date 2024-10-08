import ProviderButtons from "@/components/auth/ProviderButtons.jsx";
import LogoIcon from "@/components/icons/LogoIcon.jsx";
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
import { useRegisterMutation } from "@/redux/api/auth.api.js";
import { setUser } from "@/redux/slices/auth.slice.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { z } from "zod";

const formSchema = z
  .object({
    email: z.string().email(),
    name: z.string().min(3),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

const RegisterPage = () => {
  const dispatch = useDispatch();

  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = ({ email, name, password }) => {
    registerUser({
      email,
      name,
      password,
    })
      .unwrap()
      .then(({ metadata }) => {
        dispatch(setUser(metadata.user));
        toast({
          title: "Register successfully",
          description: `Welcome, ${metadata.user.name}!`,
        });
      });
  };

  useValidateForm({ error, form });

  return (
    <Form {...form}>
      <form className="px-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader className="text-center">
          <CardTitle className="mb-3 text-3xl">Register</CardTitle>
          <CardDescription className="text-base">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Login
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
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="email"
                      error={form.formState.errors.email}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="name"
                      error={form.formState.errors.name}
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
                      type="password"
                      autoComplete="new-password"
                      error={form.formState.errors.password}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      error={form.formState.errors.confirmPassword}
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
            Register
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

export default RegisterPage;
