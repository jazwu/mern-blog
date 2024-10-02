import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSiderBar from "../components/DashSiderBar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setTab(searchParams.get("tab"));
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* SiderBar */}
        <DashSiderBar tab={tab} />
      </div>
      {/* Main Content */}
      {tab === "profile" && <DashProfile />}
      {tab === "posts" && <DashPosts />}
      {tab === "users" && <DashUsers />}
      {tab === "comments" && <DashComments />}
    </div>
  );
}
