import { type GetStaticPropsContext, type InferGetStaticPropsType } from "next";
import Head from "next/head";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { prisma } from "~/server/db";
import Image from "next/image";

import { api } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { helpers } from "~/server/helpers/ssg";

const PostPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data } = api.posts.getPost.useQuery({ postId: props.id });

  if (!data) {
    return <p>Something went wrong!!!!</p>;
  }

  return (
    <>
      <Head>
        <title>{data.content}</title>
      </Head>
      <main className="flex h-screen justify-center">Post page</main>
    </>
  );
};

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const id = context.params?.id as string;

  await helpers.posts.getPost.prefetch({ postId: id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
    revalidate: 1,
  };
};

export const getStaticPaths = async () => {
  const posts = await prisma.post.findMany();

  return {
    paths: posts.map((post) => ({
      params: {
        id: post.id,
      },
    })),
    fallback: "blocking",
  };
};

export default PostPage;
