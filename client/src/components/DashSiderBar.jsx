import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiLogout,
  HiDocumentText,
  HiUserGroup,
  HiAnnotation,
  HiChartPie,
} from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import {
  signoutStart,
  signoutSuccess,
  signoutFailure,
} from "../redux/user/userSlice";

export default function DashSiderBar({ tab }) {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSignout = async () => {
    dispatch(signoutStart());

    try {
      const response = await fetch("/api/user/signout", {
        method: "POST",
      });
      if (response.ok) {
        dispatch(signoutSuccess());
      } else {
        dispatch(signoutFailure("Failed to sign out"));
      }
    } catch (error) {
      dispatch(signoutFailure(error.message));
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser.isAdmin && (
            <Sidebar.Item
              active={tab === "dash" || !tab}
              icon={HiChartPie}
              href="/dashboard?tab=dash"
            >
              Dashboard
            </Sidebar.Item>
          )}

          <Sidebar.Item
            active={tab === "profile"}
            icon={HiUser}
            label={currentUser.isAdmin ? "Admin" : "User"}
            labelColor="dark"
            href="/dashboard?tab=profile"
          >
            Profile
          </Sidebar.Item>

          {currentUser.isAdmin && (
            <Sidebar.Item
              active={tab === "posts"}
              icon={HiDocumentText}
              href="/dashboard?tab=posts"
            >
              Posts
            </Sidebar.Item>
          )}

          {currentUser.isAdmin && (
            <Sidebar.Item
              active={tab === "users"}
              icon={HiUserGroup}
              href="/dashboard?tab=users"
            >
              Users
            </Sidebar.Item>
          )}

          {currentUser.isAdmin && (
            <Sidebar.Item
              active={tab === "comments"}
              icon={HiAnnotation}
              href="/dashboard?tab=comments"
            >
              Comments
            </Sidebar.Item>
          )}

          <Sidebar.Item icon={HiLogout} onClick={handleSignout}>
            Log out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
