import { type NextPage } from "next";
import { SignInButton, useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";

import { type RouterOutputs, api } from "~/utils/api";
import CreatePostWizard from "~/components/CreatePostWizard";
import Loading from "~/components/Loading";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostsView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <Link href={`/posts/${post.id}`}>
      <div className="flex gap-3 border-b border-slate-400 p-4">
        <Link href={`/@${author.username}`}>
          <Image
            src={author.profilePicture}
            alt={author.username}
            className="rounded-full"
            width={56}
            height={56}
          />
        </Link>
        <div className="flex flex-col ">
          <div className="flex gap-1 text-slate-300">
            <Link href={`/@${author.username}`}>
              <span>{`@${author.username}`}</span>{" "}
            </Link>
            <Link href={`/posts/${post.id}`}>
              {" "}
              <span className="font-thin">
                . {dayjs(post.createdAt).fromNow()}
              </span>
            </Link>
          </div>
          <span className="text-2xl">{post.content}</span>
        </div>
      </div>
    </Link>
  );
};

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
    <>
      <main className="flex h-screen justify-center">
        <div className="w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {!user.isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {user.isSignedIn && <CreatePostWizard />}
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;
