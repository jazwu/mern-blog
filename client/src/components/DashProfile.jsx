import { Button, Label, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-2">
        <div className="w-32 h-32 cursor-pointer mx-auto">
          <img
            src={currentUser.profilePicture}
            alt="user"
            className="rounded-full shadow-lg w-full h-full object-cover border-8 border-[lightgray]"
          />
        </div>
        <div>
          <Label htmlFor="username">Username:</Label>
          <TextInput
            type="text"
            id="username"
            name="username"
            value={currentUser.username}
          />
        </div>
        <div>
          <Label htmlFor="email">Email:</Label>
          <TextInput
            type="email"
            id="email"
            name="email"
            value={currentUser.email}
          />
        </div>
        <div>
          <Label htmlFor="password">Password:</Label>
          <TextInput
            type="password"
            id="password"
            name="password"
            value={currentUser.password}
          />
        </div>

        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline className="mt-5">
          Update
        </Button>

        <div className="text-red-500 self-center mt-2">
            <span className="cursor-pointer">Delete Account</span>
        </div>
      </form>
    </div>
  );
}
