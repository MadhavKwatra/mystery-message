"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getOptimizedAvatarImageUrl } from "@/lib/utils";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { profileSchema } from "@/schemas/profileSchema";
import { Loader2, UserRound } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useDebounceCallback } from "usehooks-ts";

const ProfileSettingsPage = () => {
  const pictureInputRef = useRef<HTMLInputElement>(null); // Ref for file input
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [username, setUserName] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const debounced = useDebounceCallback(setUserName, 500);
  const [userData, setUserData] = useState<z.infer<
    typeof profileSchema
  > | null>(null);
  const { data: session, update: updateSession } = useSession();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: ""
    }
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!session || !session.user) return;
        const { _id } = session.user;

        const response = await axios.get<ApiResponse>(
          `/api/user-profile/${_id}`
        );
        const { details } = response.data;
        const fetchedUserData = {
          username: details?.username || "",
          email: details?.email || ""
        };
        const avatar_url = details?.avatar_url || null;
        setUserData(fetchedUserData);
        form.reset(fetchedUserData); // Reset the form with fetched data
        setInitialDataLoaded(true);
        if (avatar_url) {
          if (avatar_url.includes("https://res.cloudinary.com")) {
            const optimizedAvatarUrl = getOptimizedAvatarImageUrl(avatar_url);
            setPreviewURL(optimizedAvatarUrl);
          } else {
            setPreviewURL(avatar_url);
          }
        }
      } catch (error) {
        console.error("Error in fetching user details", error);

        const axiosError = error as AxiosError<ApiResponse>;
        const errorMessage = axiosError.response?.data.message;
        toast({
          title: "Error",
          description: errorMessage || "Failed to fetch user details",
          variant: "destructive"
        });
      }
    };

    fetchUserData();
  }, [session, toast, form]);

  // CHeck username unique asynchronously
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          // Next js prepends url automatically
          const isUserNameUniqueResponse = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          console.log(isUserNameUniqueResponse);

          setUsernameMessage(isUserNameUniqueResponse.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    setIsSaving(true);

    // TODO: Handle form submission here (e.g., send data to API)
    console.log(data, "data for sending to edit api"); // Log form data
    try {
      const response = await axios.put<ApiResponse>(`/api/user-profile`, data);
      console.log(response.data, "update profile response");
      await updateSession({
        user: { username: response?.data?.username }
      });
      toast({
        title: response.data.message,
        variant: "default"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Error",
        description:
          errorMessage || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePictureUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!profilePicture) {
      toast({
        title: "Please select a image to upload",
        variant: "destructive"
      });
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", profilePicture);

    try {
      const response = await axios.post<ApiResponse>(
        "/api/profile-img-upload",
        formData
      );

      setProfilePicture(null);
      const optimizedUrl = getOptimizedAvatarImageUrl(
        response?.data?.avatar_url || ""
      );
      setPreviewURL(optimizedUrl);
      await updateSession({
        user: { avatar_url: response?.data?.avatar_url }
      });
      toast({
        title: response.data.message
      });
    } catch (error) {
      console.log(error);
      toast({ title: "Failed to upload image", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };
  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/jpg"
      ];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Only JPEG, JPG, PNG, and GIF are allowed.",
          variant: "destructive"
        });
        return;
      }

      if (file.size > maxSize) {
        alert({
          title: "File Size Exceeds Limit",
          description: `File size exceeds the limit of ${maxSize / (1024 * 1024)}MB.`,
          variant: "destructive"
        });
        return;
      }
      setProfilePicture(file);
      setPreviewURL(URL.createObjectURL(file));
    } else {
      setProfilePicture(null);
      setPreviewURL(null);
    }
  };

  const handlePictureRemove = async () => {
    try {
      setIsRemoving(true);

      // Only send the delete request if no file selected
      if (!profilePicture) {
        const response = await axios.delete("/api/profile-img-upload", {
          method: "DELETE"
        });
        setPreviewURL(null);
        // Update the session to remove the avatar URL locally
        await updateSession({
          user: { avatar_url: null }
        });
        toast({ title: response.data.message });
      } else {
        // Just clear the preview and file input.
        setPreviewURL(null);
        setProfilePicture(null);
      }
    } catch (error) {
      console.log("Failed to remove image", error);
      toast({
        title: "Failed to remove profile photo",
        variant: "destructive"
      });
    } finally {
      setIsRemoving(false);
    }
  };

  if (!session || !session.user) {
    return (
      <div className="text-center text-lg font-medium mt-10">Please login</div>
    );
  }
  if (!initialDataLoaded) {
    return <div>Loading...</div>;
    // TODO: Add a Skeleton Loading
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-4">Edit Profile</h1>
      {/* Profile Picture */}
      <form onSubmit={handlePictureUpload}>
        <Label htmlFor="picture">Profile Picture</Label>
        <div className="flex items-center mt-2">
          <Avatar className="w-32 h-32 border border-gray-300 dark:border-gray-700">
            {previewURL ? (
              <>
                <AvatarImage
                  className="object-cover"
                  src={previewURL}
                  alt="Profile Picture"
                />
                <AvatarFallback>
                  {userData?.username?.charAt(0) || "U"}
                </AvatarFallback>
              </>
            ) : (
              <>
                <UserRound className="w-full h-full" />
              </>
            )}
          </Avatar>
          <div className="ml-4 flex items-center flex-wrap gap-5">
            {/* TODO: Add a crop/edit image functionality */}
            <Input
              id="picture"
              type="file"
              accept="image/*"
              aria-label="Upload Profile Picture"
              onChange={handlePictureChange}
              className="hidden"
              ref={pictureInputRef}
            />
            <Button
              variant="outline"
              onClick={() => pictureInputRef.current?.click()}
              className="font-semibold"
              type="button"
            >
              {previewURL || profilePicture
                ? "Change Picture"
                : "Upload Picture"}
            </Button>
            {previewURL && (
              <Button
                variant="destructive"
                onClick={handlePictureRemove}
                className="font-semibold"
                disabled={isUploading || isRemoving}
              >
                {isRemoving ? "Removing..." : "Remove"}
              </Button>
            )}
            <Button
              className="font-semibold"
              type="submit"
              disabled={isUploading}
            >
              {/* Save button */}
              {isUploading ? "Uploading..." : "Save"}
            </Button>
          </div>
        </div>
      </form>
      {/* Other Details */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Username"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                </FormControl>
                {isCheckingUsername && <Loader2 className="animate-spin" />}
                {!isCheckingUsername && usernameMessage && (
                  <p
                    className={`text-sm ${
                      usernameMessage === "Username is unique"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {usernameMessage}
                  </p>
                )}
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
                  <Input placeholder="Email" {...field} disabled />
                </FormControl>
                <FormMessage />
                <p className="text-sm text-muted-foreground ">
                  The Email cannot be changed
                </p>
              </FormItem>
            )}
          />

          <Button
            className="font-semibold w-full"
            type="submit"
            disabled={isSaving || isCheckingUsername}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProfileSettingsPage;
