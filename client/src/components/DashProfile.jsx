import { Alert, Button, Label, Modal, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice";
import "react-circular-progressbar/dist/styles.css";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProfile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageIsUploading, setImageIsUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(null);
  const [userUpdateError, setUserUpdateError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const imageRef = useRef(null);
  const dispatch = useDispatch();

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
    setImageIsUploading(true);
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
        setImageIsUploading(false);
        setImageFile(null);
        setImageURL(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageURL(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageIsUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(updateUserStart());

    if (imageIsUploading) {
      setUserUpdateSuccess(null);
      return setUserUpdateError("Please wait until the image is uploaded");
    }

    if (Object.keys(formData).length === 0) {
      setUserUpdateSuccess(null);
      return setUserUpdateError("Please update at least one field");
    }

    setUserUpdateError(null);

    try {
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        dispatch(updateUserFailure(data.message));
        setUserUpdateSuccess(null);
      } else {
        dispatch(updateUserSuccess(data));
        setUserUpdateSuccess("Profile updated successfully");
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setUserUpdateSuccess(null);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess());
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

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
            defaultValue={currentUser.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="email">Email:</Label>
          <TextInput
            type="email"
            id="email"
            name="email"
            defaultValue={currentUser.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="password">Password:</Label>
          <TextInput
            type="current-password"
            id="password"
            name="password"
            defaultValue={currentUser.password}
            onChange={handleChange}
          />
        </div>
        <Button
          type="submit"
          gradientDuoTone={"purpleToBlue"}
          outline
          className="mt-5"
          onClick={handleSubmit}
        >
          Update
        </Button>
      </form>
      <div className="text-red-500 mt-5 text-center">
        <span
          onClick={() => {
            setShowModal(true);
          }}
          className="cursor-pointer"
        >
          Delete Account
        </span>
      </div>
      <Modal
        show={showModal}
        size="md"
        popup
        onClose={() => setShowModal(false)}
      >
        <Modal.Header />
        <Modal.Body className="text-center">
          <div>
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {userUpdateSuccess && (
        <Alert color="success" className="mt-5">
          {userUpdateSuccess}
        </Alert>
      )}
      {userUpdateError && (
        <Alert color="failure" className="mt-5">
          {userUpdateError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
    </div>
  );
}
