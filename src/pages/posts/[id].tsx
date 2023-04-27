import { type NextPage } from "next";
import Head from "next/head";
import { SignInButton, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";

const PostPage: NextPage = () => {
  const user = useUser();

  return (
    <>
      <Head>
        <title>Post page</title>
      </Head>
      <main className="flex h-screen justify-center">Post page</main>
    </>
  );
};

export default PostPage;
