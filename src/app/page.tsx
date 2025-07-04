import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

const posts = [
  {
    id: 1,
    author: "Anna",
    content: "Hey Gab, did you debug your coffee maker yet? Last cup tasted like JavaScript errors.",
  },
  {
    id: 2,
    author: "Adelaida",
    content: "Gab, saw your last coding session—pretty sure you broke Stack Overflow again! 🚨",
  },
  {
    id: 3,
    author: "Juho",
    content: "Gab, are you still coding in pajamas, or have you upgraded to full-time sweatpants mode?",
  },
  {
    id: 4,
    author: "Maija",
    content: "Gab, rumor has it your computer has more stickers than code running on it. Confirm?",
  },
  {
    id: 5,
    author: "Alex",
    content: "Yo Gab, just pulled an all-nighter on the assignment. Turns out sleep deprivation doesn't improve coding skills. Weird!",
  },
  {
    id: 6,
    author: "Sheryl",
    content: "Gab, when are we gonna deploy your latest dance moves to production? #AgileDancer",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F0F2F5]">
      <header className="bg-[#4267B2] text-white fixed top-0 left-0 right-0 z-10 shadow-md h-14">
        <div className="w-full h-full px-4 flex items-center">
          <h1 className="text-2xl font-semibold text-white">wall</h1>
        </div>
      </header>

      <main className="flex-1 w-full pt-14">
        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-[280px] bg-white border-r min-h-screen">
            <div className="p-4">
              <Image 
                src="/assets/placeholder-profile.jpg" 
                alt="Gabriel Carlos" 
                width={192}
                height={192}
                className="w-48 h-48 aspect-square object-cover mb-4 mx-auto rounded-lg"
              />
              <h2 className="text-2xl font-bold text-[#1C2B4B]">Gabriel Carlos</h2>
              <p className="text-[#65676B] mb-8">wall</p>

              <div className="space-y-6">
                <button className="text-[#1C2B4B] hover:underline font-medium">
                  Information
                </button>

                <div>
                  <h3 className="text-[13px] font-medium text-[#65676B] uppercase tracking-wider mb-2">
                    NETWORKS
                  </h3>
                  <p className="text-[#1C2B4B]">Upang Alum</p>
                </div>

                <div>
                  <h3 className="text-[13px] font-medium text-[#65676B] uppercase tracking-wider mb-2">
                    CURRENT CITY
                  </h3>
                  <p className="text-[#1C2B4B]">Santa Barbara, Pangasinan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-4">
            {/* Post Creation */}
            <div className="bg-white rounded-lg shadow mb-4">
              <div className="p-4">
                <textarea 
                  placeholder="What's on your mind?"
                  className="w-full min-h-[120px] p-3 text-[15px] text-gray-700 placeholder-gray-500 bg-[#F0F2F5] border-0 rounded-lg resize-none focus:outline-none focus:ring-0"
                />
                <div className="flex justify-between items-center mt-3 text-sm">
                  <span className="text-[#65676B]">280 characters remaining</span>
                  <button className="px-8 py-2 bg-[#4267B2] text-white font-medium rounded hover:bg-[#365899] transition-colors">
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-[#4267B2] text-white">
                            {post.author.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <p className="font-semibold text-[#1C2B4B]">{post.author}</p>
                          <p className="text-[13px] text-[#65676B]">now</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-[15px] text-[#1C2B4B]">{post.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
