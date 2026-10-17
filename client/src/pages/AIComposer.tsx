import { useEffect, useState } from "react";
import { dummyGenerationData, PLATFORMS } from "../assets/assets";
import {
  CalendarIcon,
  ClockIcon,
  CopyIcon,
  HistoryIcon,
  Loader2Icon,
  SparklesIcon,
  TimerIcon,
  XIcon,
} from "lucide-react";

const AIComposer = () => {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Professional");
  const [generateImage, setGenerateImage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generations, setGenerations] = useState<any[]>([]);

  // scheduling state
  const [activeScheduler, setActiveScheduler] = useState<any>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduledTime, setScheduleTime] = useState("");
  const [scheduling, setScheduling] = useState(false);

  const fetchGenerations = async () => {
    setGenerations(dummyGenerationData);
  };
  useEffect(() => {
    fetchGenerations();
  }, []);

  const tones = ["Professional", "Creative", "Funny", "Minimalist", "Excited"];

  const getRelativeDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split("T")[0];
  };

  const DATE_PRESETS = [
    { label: "Today", value: getRelativeDate(0) },
    { label: "Tomorrow", value: getRelativeDate(1) },
    { label: "In 2 Days", value: getRelativeDate(2) },
    { label: "In 1 Wk", value: getRelativeDate(7) },
  ];

  const TIME_PRESETS = [
    { label: "09:00 AM", value: "09:00", tag: "Morning" },
    { label: "01:00 PM", value: "13:00", tag: "Lunch" },
    { label: "05:30 PM", value: "17:30", tag: "Evening" },
    { label: "08:00 PM", value: "20:00", tag: "Night" },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGenerations((prev) => [
        {
          _id: "gen_" + Date.now(),
          prompt,
          content: `${prompt}\n\nTone: ${tone}\n\n#SocialMedia #Automation #Growth`,
          tone,
          mediaUrl: generateImage ? dummyGenerationData[0]?.mediaUrl : "",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }, 2000);
  };

  const handleSchedule = async () => {
    setScheduling(true);
    setTimeout(() => {
      setScheduling(false);
      setActiveScheduler(null);
    }, 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      ``
      {/* Header */}
      <div>
        <h2 className="text-xl text-slate-800 font-semibold">AI Composer</h2>
        <p className="text-slate-500 text-sm mt-0.5">
          Generate social media posts and visuals using AI
        </p>
      </div>
      {/* Composer Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        {/* Topic / Prompt */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">
            Topic / Prompt
          </label>
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What would you like to post about?"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 outline-none focus:bg-white focus:border-red-300 transition-all resize-none"
          />
        </div>

        {/* Tone Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">
            Tone
          </label>
          <div className="flex flex-wrap gap-2">
            {tones.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                  tone === t
                    ? "bg-red-500 text-white border-red-500 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/*  Image Toggle & Submit Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={generateImage}
              onClick={() => setGenerateImage(!generateImage)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                generateImage ? "bg-red-500" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  generateImage ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span
              onClick={() => setGenerateImage(!generateImage)}
              className="text-sm text-slate-700 font-medium cursor-pointer select-none"
            >
              Generate image with post
            </span>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleGenerate}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium text-sm transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2Icon className="size-6 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="size-5" />
                Generate Post
              </>
            )}
          </button>
        </div>
      </div>
      {/* Recent Generations List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center justify-center gap-2 text-lg text-slate-800 font-semibold">
            <HistoryIcon className="size-4 text-slate-900" />
            Recent Generations
          </h3>
          <span className="text-sm text-slate-800">
            {generations.length} posts
          </span>
        </div>

        {generations.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-400">
            <SparklesIcon className="size-8 mx-auto mb-2 opacity-50 text-slate-500" />
            <p className="text-slate-600 font-medium">No generations yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Enter a prompt above and click generate to create your first post.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {generations.map((gen, index) => (
              <div
                key={gen._id || index}
                className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all text-xs"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                      {gen.tone || "Professional"}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(gen.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="font-semibold text-slate-800 text-xs line-clamp-1">
                    {gen.prompt}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {gen.content}
                  </p>

                  {gen.mediaUrl && (
                    <div className="rounded-lg overflow-hidden border border-slate-100 h-32">
                      <img
                        src={gen.mediaUrl}
                        alt="Visual"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(gen.content);
                      alert("Copied post content!");
                    }}
                    className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <CopyIcon className="size-3" />
                    Copy
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveScheduler(gen);
                      setSelectedPlatforms([]);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-md text-[11px] font-medium transition-all"
                  >
                    <CalendarIcon className="size-3" />
                    Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Schedule Modal */}
      {activeScheduler && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">
                Schedule Post
              </h3>
              <button
                onClick={() => setActiveScheduler(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 max-h-24 overflow-y-auto leading-relaxed">
                {activeScheduler.content}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">
                  Select Platforms
                </label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => {
                    const active = selectedPlatforms.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() =>
                          setSelectedPlatforms((prev) =>
                            prev.includes(p.id)
                              ? prev.filter((id) => id !== p.id)
                              : [...prev, p.id],
                          )
                        }
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                          active
                            ? "bg-red-50 border-red-300 text-red-600"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <p.icon className="size-3.5" />
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-600 uppercase">
                    Publish Date
                  </label>
                  {scheduleDate && (
                    <span className="text-[11px] text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded-full">
                      {new Date(scheduleDate + "T00:00:00").toLocaleDateString(
                        undefined,
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </span>
                  )}
                </div>

                {/* Quick Date Pills */}
                <div className="grid grid-cols-4 gap-1.5">
                  {DATE_PRESETS.map((dp) => (
                    <button
                      key={dp.label}
                      type="button"
                      onClick={() => setScheduleDate(dp.value)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                        scheduleDate === dp.value
                          ? "bg-red-500 text-white border-red-500 shadow-xs"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {dp.label}
                    </button>
                  ))}
                </div>

                {/* Custom Date Input */}
                <div className="relative">
                  <CalendarIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-red-300 cursor-pointer font-medium"
                  />
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-600 uppercase">
                    Publish Time
                  </label>
                  {scheduledTime && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      Slot: {scheduledTime}
                    </span>
                  )}
                </div>

                {/* Best Times Preset Grid */}
                <div className="grid grid-cols-4 gap-1.5">
                  {TIME_PRESETS.map((tp) => (
                    <button
                      key={tp.value}
                      type="button"
                      onClick={() => setScheduleTime(tp.value)}
                      className={`py-1.5 px-1.5 rounded-lg border text-center transition-all flex flex-col items-center justify-center ${
                        scheduledTime === tp.value
                          ? "bg-red-500 text-white border-red-500 shadow-xs"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      <span className="font-semibold text-[11px] leading-tight">
                        {tp.label}
                      </span>
                      <span
                        className={`text-[9px] ${
                          scheduledTime === tp.value
                            ? "text-white/80"
                            : "text-slate-400"
                        }`}
                      >
                        {tp.tag}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Custom Time Input */}
                <div className="relative">
                  <ClockIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="time"
                    required
                    value={scheduledTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-red-300 cursor-pointer font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveScheduler(null)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={
                    scheduling ||
                    !scheduleDate ||
                    !scheduledTime ||
                    selectedPlatforms.length === 0
                  }
                  onClick={handleSchedule}
                  className="flex items-center gap-2 px-5 py-2 bg-red-400 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-all shadow-xs disabled:opacity-50"
                >
                  {scheduling ? (
                    <Loader2Icon className="size-5 animate-spin" />
                  ) : (
                    <TimerIcon className="size-4  text-white " />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIComposer;
