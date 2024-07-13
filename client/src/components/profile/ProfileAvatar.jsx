import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils.js";
import { useUpdateUserPictureMutation } from "@/redux/api/user.api.js";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button.jsx";
import { toast } from "../ui/use-toast.js";

const ProfileAvatar = ({ profilePicutre, setProfilePicture }) => {
  const [updatePicture, { isLoading: isUpdating }] =
    useUpdateUserPictureMutation();

  const [pictureFile, setPictureFile] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);

  const [isDragEnter, setIsDragEnter] = useState(false);
  const [isInputHover, setIsInputHover] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFileChange = (e) => {
    setIsDragEnter(false);

    const newFile = e.target.files?.[0];

    if (newFile) {
      if (!["image/png", "image/jpeg"].includes(newFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload PNG, JPG, JPEG file",
          variant: "destructive",
        });
      } else if (newFile.size > 1024 * 1024) {
        toast({
          title: "File size too large",
          description: "Please upload file size less than 1MB",
          variant: "destructive",
        });
      } else {
        setPictureFile(newFile);
      }
    }
  };

  const handleClick = async () => {
    if (pictureFile) {
      const formData = new FormData();
      formData.append("picture", pictureFile);

      try {
        const data = await updatePicture(formData).unwrap();
        setProfilePicture(data.metadata?.picture);
        setIsDialogOpen(false);

        toast({
          title: "Update user picture success",
          description: "Your profile picture has been updated",
        });

        // Reset picture file and preview
        setPictureFile(null);
        setPicturePreview(null);
      } catch (error) {
        toast({
          title: "Update user picture failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      setIsDialogOpen(false);
    }
  };

  useEffect(() => {
    if (pictureFile) {
      if (picturePreview) {
        // Revoke to free memory when picturePreview changes
        URL.revokeObjectURL(picturePreview);
      }

      setPicturePreview(URL.createObjectURL(pictureFile));
    }

    // Revoke to free memory when component unmount
    return () => {
      URL.revokeObjectURL(picturePreview);
    };
  }, [pictureFile]);

  return (
    <div className="flex flex-col items-center">
      <img
        className="h-32 w-32 rounded-full"
        src={profilePicutre}
        alt="avatar"
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mt-4" variant="outline">
            Change Avatar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Change Avatar
            </DialogTitle>
          </DialogHeader>

          <div
            onDragEnter={() => setIsDragEnter(true)}
            onDragLeave={() => setIsDragEnter(false)}
            onDrop={() => setIsDragEnter(false)}
            className="relative"
          >
            <div
              className={cn(
                "h-32",
                (isInputHover || isDragEnter) && "border-black",
              )}
            >
              <div className="relative mx-auto h-full w-32 overflow-hidden rounded-full border-2 border-dashed">
                <img
                  src={picturePreview || profilePicutre}
                  className={cn(
                    "h-full w-full object-cover",
                    (isInputHover || isDragEnter) && "border-primary",
                  )}
                />

                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center bg-gray-600 bg-opacity-30 transition",
                    isInputHover || isDragEnter ? "opacity-100" : "opacity-0",
                  )}
                >
                  <Upload className="h-12 w-12 stroke-[1.2px] text-primary" />
                </div>
              </div>

              <input
                id="picture"
                accept=".png, .jpg, .jpeg"
                type="file"
                className="absolute inset-0 z-50 cursor-pointer opacity-0"
                onMouseEnter={() => setIsInputHover(true)}
                onMouseLeave={() => setIsInputHover(false)}
                onChange={handleFileChange}
              />
            </div>

            <DialogDescription className="mt-4 text-center">
              <span className="font-semibold">Click or drag</span> to upload new
              avatar
              <br />
              <span className="text-sm text-muted-foreground">
                PNG, JPG, JPEG up to 1MB
              </span>
            </DialogDescription>
          </div>

          <DialogFooter className="mx-auto">
            <Button onClick={handleClick} disabled={isUpdating}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileAvatar;
