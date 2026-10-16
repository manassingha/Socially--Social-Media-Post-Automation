import { useEffect, useState } from "react";
import { dummyPostsData } from "../assets/assets";

const Scheduler = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setPosts(dummyPostsData);
  };

  useEffect(() => {
    (async () => await fetchPosts())();
    const interval = setInterval(async () => {
      await fetchPosts();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const scheduled = posts.filter((p) => p.status === "scheduled");
  const published = posts.filter((p) => p.status === "published");
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* compose pannel */}
      <div className="w-full lg:w-[460px] shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg text-slate-700">Compose Post</h2>
          </div>

          <form className="space-y-5">
            {/* platforms */}

            {/* content */}

            {/* media uplaod  */}

            {/* date and time */}

            {/* submit button */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
