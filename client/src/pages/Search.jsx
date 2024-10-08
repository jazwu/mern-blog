import { TextInput, Select, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

export default function Search() {
  const location = useLocation();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "Uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("searchTerm");
    const sort = urlParams.get("sort");
    const category = urlParams.get("category");
    if (searchTerm || sort || category) {
      setSidebarData({ ...sidebarData, searchTerm, sort, category });
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const response = await fetch(`/api/post/getposts?${searchQuery}`);
        if (!response.ok) {
          setLoading(false);
          return;
        }
        const data = await response.json();
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData({ ...sidebarData, [id]: value });
    if (id === "sort" && !value) {
      setSidebarData({ ...sidebarData, [id]: "desc" });
    }
    if (id === "category" && !value) {
      setSidebarData({ ...sidebarData, [id]: "Uncategorized" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchQuery = new URLSearchParams(location.search);
    searchQuery.set("searchTerm", sidebarData.searchTerm);
    searchQuery.set("sort", sidebarData.sort);
    searchQuery.set("category", sidebarData.category);
    const searchQueryString = searchQuery.toString();
    navigate(`/search?${searchQueryString}`);
  };

  const handleShowMore = async () => {
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.toString();
    try {
      setLoading(true);
      const numberOfPosts = posts.length;
      const startIndex = numberOfPosts - 1;
      const response = await fetch(`/api/post/getposts?${searchQuery}&startIndex=${startIndex}`);
      if (!response.ok) {
        setLoading(false);
        return;
      }
      const data = await response.json();
      setPosts([...posts, ...data.posts]);
      setLoading(false);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label
              htmlFor="searchTerm"
              className="whitespace-nowrap font-semibold"
            >
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              type="text"
              id="searchTerm"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="font-semibold">
              Sort:
            </label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="category" className="font-semibold">
              Category:
            </label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="Uncategorized">Uncategorized</option>
              <option value="web-dev">Web Developement</option>
              <option value="life-kit">Life Kit</option>
              <option value="mental-health">Mental Health</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Search Results
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts.length > 0 &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <Button
              className="text-teal-500 text-lg hover:underline p-7 w-full"
              onClick={handleShowMore}
            >
              Load More
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
