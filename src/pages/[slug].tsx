import { type NextPage } from "next";
import Head from "next/head";

import LoadingPage from "~/components/Loading";
import { api } from "~/utils/api";

const ProfilePage: NextPage = () => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username: "tichif",
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!data) {
    return <div>Something went wrong....</div>;
  }

  console.log(data);

  return (
    <>
      <Head>
        <title>Profile Page</title>
      </Head>
      <main className="flex h-screen justify-center">Profile View</main>
    </>
  );
};

export default ProfilePage;
