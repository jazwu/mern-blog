import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Textarea, Button } from "flowbite-react";

export default function Comment({ comment, onLike, onEdit }) {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

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

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };
  const handleDelete = () => {};

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
        {isEditing ? (
          <>
            <Textarea
              className="w-full p-2 text-gray-700 bg-gray-200 rounded-md resize-none focus:outline-none focus:bg-gray-100"
              rows={3}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex gap-3 justify-end items-center mt-3">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToPink"
                onClick={() => {
                  onEdit(comment._id, editedContent);
                  setIsEditing(false);
                }}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToPink"
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 mb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                className={`text-gray-400 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
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
              {currentUser && currentUser._id === comment.userId && (
                <button
                  type="button"
                  className="text-gray-400 hover:text-blue-500"
                  onClick={handleEdit}
                >
                  Edit
                </button>
              )}
              {currentUser && currentUser._id === comment.userId && (
                <button
                  type="button"
                  className="text-gray-400 hover:text-red-500"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
