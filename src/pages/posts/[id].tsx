import { type GetStaticPropsContext, type InferGetStaticPropsType } from "next";
import Head from "next/head";
import { prisma } from "~/server/db";
import Image from "next/image";

import { api } from "~/utils/api";
import { helpers } from "~/server/helpers/ssg";
import Layout from "~/components/Layout";
import PostsView from "~/components/PostView";

const PostPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data } = api.posts.getPost.useQuery({ postId: props.id });

  if (!data) {
    return <p>Something went wrong!!!!</p>;
  }

  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <Layout>
        <PostsView {...data} />
      </Layout>
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
