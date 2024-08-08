import { Sidebar } from "flowbite-react";
import { HiUser, HiLogout } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function DashSiderBar({ tab }) {
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={"User"}
              labelColor="dark"
            >
              Profile
            </Sidebar.Item>
          </Link>

          <Sidebar.Item href="#" icon={HiLogout}>
            Log out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
