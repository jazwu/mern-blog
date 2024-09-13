import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import DOMPurify from 'dompurify';
import CommentSection from "../components/CommentSection";

export default function PostPage() {
  const { postSlug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setPost(null);
        setError(null);
        const response = await fetch(`/api/post/getposts?slug=${postSlug}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data.posts[0]);
        } else {
          setError("Failed to fetch post");
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  return (
    <div className="container mx-auto">
      {loading && (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="xl" />
        </div>
      )}
      {error && <p>{error}</p>}
      {post && (
        <main className="p-3 flex flex-col min-h-screen items-center mx-auto max-w-6xl">
          <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
            {post.title}
          </h1>
          <Link
            to={`/search?category=${post.category}`}
            className="self-center mt-5"
          >
            <Button color="gray" pill size="xs">
              {post.category}
            </Button>
          </Link>
          <img
            src={post.image}
            alt={post.title}
            className="mt-10 p-3 max-h-[600px] w-full object-cover"
          />
          <div className="flex justify-between p-3 border-b mx-auto w-full max-w-2xl">
            <span className="font-serif">{new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="font-serif italic">
              {(post.content.length / 1000).toFixed(0)} mins read
            </span>
          </div>
          <div
            className="p-3 max-w-2xl w-full mx-auto post-content"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          ></div>
          <div className="max-w-4xl mx-auto">
            <CallToAction />
          </div>
          <CommentSection postId={post._id} />
        </main>
      )}
    </div>
  );
}
