import LoadingArea from "@/components/loading/LoadingArea.jsx";
import LoadingOverlay from "@/components/loading/LoadingOverlay.jsx";
import { PageDescription, PageTitle } from "@/components/ui/PageTitle.jsx";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator.jsx";
import { toast } from "@/components/ui/use-toast.js";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/redux/api/user.api.js";
import { setValidationErrors } from "@/utils/helper.util.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(3).max(50),
  picture: z.string().url(),
  email: z.string().email(),
});

const ProfilePage = () => {
  const { data, isLoading } = useGetUserProfileQuery();
  const [updateProfile] = useUpdateUserProfileMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const profile = useMemo(() => {
    if (!data?.metadata?.profile) return null;

    const returnProfile = data.metadata.profile;

    // Reset form with default values
    form.reset(returnProfile);
    return returnProfile;
  }, [data]);

  const onSubmit = async (values) => {
    // Filter changed fields
    const updateData = Object.keys(form.formState.dirtyFields).reduce(
      (acc, key) => {
        acc[key] = values[key];
        return acc;
      },
      {},
    );

    try {
      const {
        metadata: { profile },
      } = await updateProfile(updateData).unwrap();
      form.reset(profile);

      toast({
        title: "Update user profile success",
        description: data.message,
      });
    } catch (error) {
      setValidationErrors({ errors: error.errors, form });
    }
  };

  //---------------------------------------------------------------------------------

  if (isLoading) {
    return <LoadingArea />;
  }

  if (!profile) {
    toast({
      title: "Get user profile failed",
      description: "Please try again later",
    });

    return <Navigate to="/" />;
  }

  return (
    <div className="container-area">
      <PageTitle>Profile</PageTitle>
      <PageDescription className="mb-6">You can update your basic info here</PageDescription>

      <LoadingOverlay isLoading={false}>
        <Form {...form}>
          <form
            className="flex justify-between"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col items-center">
              <img
                className="h-32 w-32 rounded-full"
                src={profile.picture}
                alt="avatar"
              />

              <Button type="button" className="mt-4" variant="secondary">
                Change Avatar
              </Button>
            </div>

            <Separator
              orientation="vertical"
              className="mx-12 h-auto w-[1px] self-stretch"
            />

            <div className="flex-1 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input error={form.formState.errors.name} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input error={form.formState.errors.email} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={!form.formState.isDirty} type="submit">
                Update
              </Button>
            </div>
          </form>
        </Form>
      </LoadingOverlay>
    </div>
  );
};

export default ProfilePage;
