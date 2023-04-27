import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { api } from "~/utils/api";
import { LoadingSpinner } from "./Loading";

const CreatePostWizard = () => {
  const { user } = useUser();

  const [content, setContent] = useState<string>("");

  const ctx = api.useContext();

  const { mutate, isLoading } = api.posts.create.useMutation({
    onSuccess: () => {
      setContent("");
      void ctx.posts.getAll.invalidate();
      toast.success("Post created !!!");
    },
    onError: (e) => {
      const errorMessages = e.data?.zodError?.fieldErrors.content;
      if (errorMessages && errorMessages[0]) {
        toast.error(errorMessages[0]);
      } else {
        toast.error("Failed to create post. Try again later!!!");
      }
    },
  });

  const submitHandler = () => {
    mutate({ content });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex w-full gap-4">
      <Image
        src={user.profileImageUrl}
        alt="Profile"
        className="rounded-full"
        width={56}
        height={56}
      />
      <input
        placeholder="Type some emojis"
        className="grow bg-transparent outline-none"
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (content != "") {
              submitHandler();
            }
          }
        }}
      />
      {isLoading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      ) : (
        <button onClick={submitHandler} disabled={isLoading}>
          Submit
        </button>
      )}
    </div>
  );
};

export default CreatePostWizard;
