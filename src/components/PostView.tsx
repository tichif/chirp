import { type RouterOutputs } from "~/utils/api";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostsView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
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
        <Link href={`/posts/${post.id}`}>
          <span className="text-2xl">{post.content}</span>
        </Link>
      </div>
    </div>
  );
};

export default PostsView;
