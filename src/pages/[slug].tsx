import { type GetStaticPropsContext, type InferGetStaticPropsType } from "next";
import Head from "next/head";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { prisma } from "~/server/db";
import Image from "next/image";

import { api } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import Layout from "~/components/Layout";
import LoadingPage from "~/components/Loading";
import PostsView from "~/components/PostView";

const Feed = ({
  userId,
  author,
}: {
  userId: string;
  author: {
    username: string;
    id: string;
    profilePicture: string;
  };
}) => {
  const { data, isLoading } = api.posts.getUserPosts.useQuery({ userId });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!data || data.length === 0) {
    return <p>SNo posts for this user</p>;
  }

  return (
    <div className="flex flex-col">
      {data.map((post) => (
        <PostsView key={post.id} author={author} post={post} />
      ))}
    </div>
  );
};

const ProfilePage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { username } = props;

  const { data } = api.profile.getUserByUsername.useQuery({
    username: username.slice(1),
  });

  if (!data) {
    return <div>Something wrent wrong</div>;
  }

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <Layout>
        <div className="relative h-36 bg-slate-600">
          <Image
            src={data.profilePicture}
            alt={`Profile of ${data.username as string}`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">@{data.username}</div>
        <div className="w-full border-b border-slate-400"></div>
        <Feed
          userId={data.id}
          author={{ ...data, username: data.username ?? "" }}
        />
      </Layout>
    </>
  );
};

export const getStaticProps = async (
  context: GetStaticPropsContext<{ slug: string }>
) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const username = context.params?.slug as string;

  await helpers.profile.getUserByUsername.prefetch({
    username: username.slice(1),
  });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      username,
    },
    revalidate: 1,
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
