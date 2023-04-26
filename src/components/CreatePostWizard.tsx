import { useUser } from "@clerk/nextjs";
import Image from "next/image";

const CreatePostWizard = () => {
  const { user } = useUser();

  console.log(user);

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
      />
    </div>
  );
};

export default CreatePostWizard;
