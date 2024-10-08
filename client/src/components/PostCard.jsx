import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="group relative w-full h-[380px] overflow-hidden rounded-lg sm:w-[calc(33.33%-1rem)]
    border border-teal-500 hover:border-2 transition-all">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="post cover"
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
        <span className="italic text-sm">{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className="z-10 absolute bottom-[-200px] right-1 left-1 group-hover:bottom-1  
          border border-teal-500 text-teal-500 
          hover:bg-teal-500 hover:text-white 
          transition-all duration-300 text-center py-2 rounded-md"
        >
          Read article
        </Link>
      </div>
    </div>
  );
}
