import { useUser } from "@clerk/nextjs";

const CreatePostWizard = () => {
  const { user } = useUser();

  console.log(user);

  if (!user) {
    return null;
  }

  return (
    <div className="flex w-full gap-4">
      <img
        src={user.profileImageUrl}
        alt="Profile"
        className="h-14 w-14 rounded-full"
      />
      <input
        placeholder="Type some emojis"
        className="grow bg-transparent outline-none"
      />
    </div>
  );
};

export default CreatePostWizard;
