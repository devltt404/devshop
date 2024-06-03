import GoogleIcon from "@/components/icons/GoogleIcon.jsx";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Facebook } from "lucide-react";
import { useForm } from "react-hook-form";
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

const EmailMethodFields = ({ control }) => (
  <div className="grid gap-4">
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" placeholder="name@example.com" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input type="text" placeholder="name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input type="password" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="confirmPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Confirm Password</FormLabel>
          <FormControl>
            <Input type="password" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

const RegisterPage = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values) => {
    console.log(values);
  };

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

            <EmailMethodFields control={form.control} />
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default RegisterPage;
