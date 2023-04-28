import { type NextPage } from "next";
import { SignInButton, useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";
import CreatePostWizard from "~/components/CreatePostWizard";
import Loading from "~/components/Loading";
import Layout from "~/components/Layout";
import PostsView from "~/components/PostView";

const Feed = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <Loading />;

  if (!data) return <div>Something went wrong...</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostsView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();

  // start fetching asap
  api.posts.getAll.useQuery();

  return (
    <Layout>
      <div className="flex border-b border-slate-400 p-4">
        {!user.isSignedIn && (
          <div className="flex justify-center">
            <SignInButton />
          </div>
        )}
        {user.isSignedIn && <CreatePostWizard />}
      </div>
      <Feed />
    </Layout>
  );
};

export default Home;
