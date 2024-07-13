import LoadingArea from "@/components/loading/LoadingArea.jsx";
import LoadingOverlay from "@/components/loading/LoadingOverlay.jsx";
import ProfileAvatar from "@/components/profile/ProfileAvatar.jsx";
import ProfileForm from "@/components/profile/ProfileForm.jsx";
import { PageDescription, PageTitle } from "@/components/ui/PageTitle.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { toast } from "@/components/ui/use-toast.js";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/redux/api/user.api.js";
import { setValidationErrors } from "@/utils/helper.util.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
});

const ProfilePage = () => {
  const { data, isLoading } = useGetUserProfileQuery();
  const [updateProfile] = useUpdateUserProfileMutation();

  const [profilePicture, setProfilePicture] = useState(null);

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

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const profile = useMemo(() => {
    if (!data?.metadata?.profile) return null;

    const returnProfile = data.metadata.profile;

    // Reset form with fetched default values
    form.reset(returnProfile);
    setProfilePicture(returnProfile.picture);
    
    return returnProfile;
  }, [data]);

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
      <PageDescription className="mb-6">
        You can update your basic info here
      </PageDescription>

      <LoadingOverlay isLoading={form.formState.isSubmitting}>
        <div className="flex justify-between">
          <ProfileAvatar
            profilePicutre={profilePicture}
            setProfilePicture={setProfilePicture}
          />

          <Separator
            orientation="vertical"
            className="mx-12 h-auto w-[1px] self-stretch"
          />

          <ProfileForm form={form} onSubmit={onSubmit} />
        </div>
      </LoadingOverlay>
    </div>
  );
};

export default ProfilePage;
