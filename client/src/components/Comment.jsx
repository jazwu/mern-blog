import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Comment({ comment, onLike }) {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchUser();
  }, [comment]);

  return (
    <div className="flex p-4 border-b dark:text-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "deleted user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 mb-2">{comment.content}</p>
        <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
          <button
            type="button"
            className={`text-gray-400 ${
              currentUser && comment.likes.includes(currentUser._id) && "!text-blue-500"
            }`}
            onClick={() => onLike(comment._id)}
          >
            <FaThumbsUp className="text-sm" />
          </button>
          <p className="text-gray-400">
            {comment.numberOfLikes > 0
              ? comment.numberOfLikes +
                " " +
                (comment.numberOfLikes === 1 ? "like" : "likes")
              : null}
          </p>
        </div>
      </div>
    </div>
  );
}
