import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";

import { api } from "~/utils/api";

const CreatePostWizard = () => {
  const { user } = useUser();

  const [content, setContent] = useState<string>("");

  const ctx = api.useContext();

  const { mutate, isLoading } = api.posts.create.useMutation({
    onSuccess: () => {
      setContent("");
      void ctx.posts.getAll.invalidate();
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
      />
      <button onClick={submitHandler}>Submit</button>
    </div>
  );
};

export default CreatePostWizard;
