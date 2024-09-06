import { useEffect, useState } from "react";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getStorage } from "firebase/storage";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [uploadImageProgress, setUploadImageProgress] = useState(null);
  const [uploadImageError, setUploadImageError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const getDefaultFormData = async () => {
      try {
        const response = await fetch(`/api/post/getposts?postId=${postId}`);
        if (response.ok) {
          const data = await response.json();
          setPublishError(null);
          setFormData(data.posts[0]);
        } else {
          console.error(data.message);
          setPublishError(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getDefaultFormData();
  }, [postId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setUploadImageError("Please select an image");
        return;
      }

      setUploadImageError(null);
      const storage = getStorage(app);
      const filename = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, filename);

      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadImageProgress(progress.toFixed(0));
        },
        (error) => {
          setUploadImageError("Failed to upload image");
          setUploadImageProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploadImageError(null);
            setUploadImageProgress(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setUploadImageError("Failed to upload image");
      setUploadImageProgress(null);
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setPublishError(data.message);
      } else {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Failed to publish post");
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl min-h-screen p-3 mx-auto">
      <h1 className="text-3xl text-center my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 justify-between sm:flex-row">
          <TextInput
            type="text"
            placeholder="Title"
            className="flex-1"
            required
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="web-dev">Web Development</option>
            <option value="mental-health">Mental Health</option>
            <option value="life-kit">Life Kit</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-gray-500 border-dotted p-4">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            gradientDuoTone="purpleToPink"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={uploadImageProgress ? true : false}
          >
            {uploadImageProgress ? (
              <div className="w-8 h-8">
                <CircularProgressbar
                  value={uploadImageProgress}
                  text={`${uploadImageProgress}%`}
                />
              </div>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
        {uploadImageError && <Alert color="failure">{uploadImageError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="Uploaded"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          className="mt-5 h-72 mb-12"
          theme="snow"
          placeholder="Write something..."
          required
          onChange={(content) => setFormData({ ...formData, content })}
          value={formData.content}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update
        </Button>
        {publishError && (
          <Alert color="failure" className="mt-5">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
