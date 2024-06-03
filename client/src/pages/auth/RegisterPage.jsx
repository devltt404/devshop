import ProviderButtons from "@/components/auth/ProviderButtons.jsx";
import { Button } from "@/components/ui/button";
import {
  Card,
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
import useValidateForm from "@/hooks/useValidateForm.jsx";
import { setUserInfo } from "@/redux/slices/user.slice.js";
import { useRegisterMutation } from "@/services/auth.service.js";
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
        dispatch(setUserInfo(metadata.user));
      });
  };

  useValidateForm({ error, form });

  return (
    <Card className="mx-auto my-12 max-w-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Register</CardTitle>
            <CardDescription>
              Already have an account?{" "}
              <Link to="/login" className="font-medium hover:underline">
                Login
              </Link>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ProviderButtons />

            <div className="my-5 flex items-center gap-2 text-xs text-muted-foreground">
              <Separator className="flex-1" />
              <span>OR CONTINUE WITH</span>
              <Separator className="flex-1" />
            </div>

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
                        error={form.formState.errors.email}
                        placeholder="name@example.com"
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

          <CardFooter>
            <Button disabled={isLoading} type="submit" className="w-full">
              Register
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default RegisterPage;
