import { Alert, Button, Label, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const imageRef = useRef(null);

  const handleImage = (e) => {
    const image = e.target.files[0];
    if (image) {
      setImageFile(image);
      const generatedURL = URL.createObjectURL(image);
      setImageURL(generatedURL);
    }
  };

  useEffect(() => {
    if (imageFile) {
      setImageUploadError(null);
      uploadImage(imageFile);
    }
  }, [imageFile]);

  const uploadImage = async (image) => {
    const storage = getStorage(app);

    const fileName = new Date().getTime() + "-" + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError("Cannot upload image (Max size: 2MB)");
        setImageUploadProgress(null);
        setImageFile(null);
        setImageURL(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageURL(downloadURL);
        });
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          ref={imageRef}
          hidden
        />
        <div
          className="relative w-32 h-32 cursor-pointer mx-auto"
          onClick={() => imageRef.current.click()}
        >
          {imageUploadProgress && (
            <CircularProgressbar
              value={imageUploadProgress}
              text={`${imageUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(104, 117, 245, ${imageUploadProgress / 100})`,
                },
                text: {
                  fill: "#6875f5",
                },
              }}
            />
          )}
          <img
            src={imageURL || currentUser.profilePicture}
            alt="user"
            className={`rounded-full shadow-lg w-full h-full object-cover border-8 border-[lightgray] ${
              imageUploadProgress && imageUploadProgress < 100 && "opacity-60"
            }`}
          />
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        <div>
          <Label htmlFor="username">Username:</Label>
          <TextInput
            type="text"
            id="username"
            name="username"
            value={currentUser.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="email">Email:</Label>
          <TextInput
            type="email"
            id="email"
            name="email"
            value={currentUser.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="password">Password:</Label>
          <TextInput
            type="current-password"
            id="password"
            name="password"
            value={currentUser.password}
            onChange={handleChange}
          />
        </div>
        <Button
          type="submit"
          gradientDuoTone={"purpleToBlue"}
          outline
          className="mt-5"
        >
          Update
        </Button>

        <div className="text-red-500 self-center mt-2">
          <span className="cursor-pointer">Delete Account</span>
        </div>
      </form>
    </div>
  );
}
