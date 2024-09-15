import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Alert, Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import Comment from "./Comment";
import { useNavigate } from "react-router-dom";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [postComments, setPostComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchComments() {
      try {
        setErrorMessage(null);
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        const data = await res.json();
        if (res.ok) {
          setPostComments(data);
        } else {
          setErrorMessage(data.message);
        }
      } catch (err) {
        setErrorMessage(err.message);
      }
    }
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage(null);
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setPostComments((prevComments) => [data, ...prevComments]);
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleLike = async (commentId) => {
    if(!currentUser) {
      navigate("/sign-in");
      return;
    }
    try {
      setErrorMessage(null);
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (res.ok) {
        setPostComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === data._id ? data : comment
          )
        );
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to="/dashboard?tab=profile"
            className="text-sm text-blue-500 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="flex gap-1">
          <p className="text-sm my-5">Sign in to comment</p>
          <Link to="/sign-in" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </div>
      )}
      {currentUser && (
        <>
          <form
            className="border border-teal-500 p-3 rounded-md"
            onSubmit={handleSubmit}
          >
            <Textarea
              placeholder="Add a comment..."
              rows="3"
              maxLength={200}
              onChange={(e) => {
                setComment(e.target.value);
              }}
              value={comment}
            />
            <div className="flex gap-3 justify-between items-center mt-5">
              <p className="text-xs text-gray-500">
                {200 - comment.length} characters remaining
              </p>
              <Button outline gradientDuoTone="purpleToPink" type="submit">
                Submit
              </Button>
            </div>
          </form>
          {errorMessage && (
            <Alert color="failure" className="mt-5">
              {errorMessage}
            </Alert>
          )}
        </>
      )}
      {postComments.length > 0 ? (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 px-2 py-1 rounded-sm">
              <p>{postComments.length}</p>
            </div>
          </div>
          {
            postComments.map((comment) => (
              <Comment key={comment._id} comment={comment} onLike={handleLike}/>
            ))
          }
        </>
      ) : (
        <p className="text-sm my-5">No comments yet!</p>
      )}
    </div>
  );
}
