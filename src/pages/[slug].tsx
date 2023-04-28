import {
  type NextPage,
  type GetStaticPropsContext,
  type InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { prisma } from "~/server/db";

import { api, type RouterOutputs } from "~/utils/api";
import { appRouter } from "~/server/api/root";

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
      <main className="flex h-screen justify-center">Profile View</main>
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

  console.log(username.slice(1));

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
