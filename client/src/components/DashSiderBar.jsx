import { Sidebar } from "flowbite-react";
import { HiUser, HiLogout } from "react-icons/hi";

export default function DashSiderBar({ tab }) {
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            active={tab === "profile"}
            icon={HiUser}
            label={"User"}
            labelColor="dark"
            href="/dashboard?tab=profile"
          >
            Profile
          </Sidebar.Item>

          <Sidebar.Item href="#" icon={HiLogout}>
            Log out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
