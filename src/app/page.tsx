import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
      <header className="bg-[#3B5998] text-white fixed top-0 left-0 right-0 z-10 shadow-md h-14">
        <div className="w-full h-full px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">My Wall</h1>
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8 border-2 border-white">
              <AvatarImage src="/assets/placeholder-profile.jpg" alt="Gabriel Carlos" />
              <AvatarFallback className="bg-white text-[#3B5998]">GC</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Gabriel Carlos</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full pt-14">
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-screen">
          {/* Left Sidebar */}
          <div className="md:col-span-4 lg:col-span-3 bg-[#F0F2F5] p-4">
            <div className="sticky top-20 w-full max-w-[360px] mx-auto md:ml-auto md:mr-0">
              <Card className="border-none shadow-md bg-white w-full">
                <CardContent className="p-6">
                  <div className="space-y-8">
                    <div className="text-center">
                      <div className="w-full aspect-square relative mb-6">
                        <Avatar className="absolute inset-0 w-full h-full border-4 border-[#3B5998]">
                          <AvatarImage src="/assets/placeholder-profile.jpg" alt="Gabriel Carlos" className="object-cover" />
                          <AvatarFallback className="bg-[#3B5998] text-white">GC</AvatarFallback>
                        </Avatar>
                      </div>
                      <h2 className="text-2xl font-bold text-[#1C2B4B]">Gabriel Carlos</h2>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-[#3B5998] mb-3">Networks</h3>
                        <p className="text-gray-700">Upang Alum</p>
                      </div>
                      <div className="border-t pt-6">
                        <h3 className="font-semibold text-[#3B5998] mb-3">Current City</h3>
                        <p className="text-gray-700">Santa Barbara, Pangasinan</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-8 lg:col-span-9 bg-[#F0F2F5] p-4">
            <div className="space-y-4 max-w-2xl mx-auto">
              <Card className="border-none shadow-md bg-white overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-3 items-start">
                    <Avatar className="h-10 w-10 border border-gray-200">
                      <AvatarImage src="/assets/placeholder-profile.jpg" alt="Gabriel Carlos" />
                      <AvatarFallback className="bg-[#3B5998] text-white">GC</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <input 
                        type="text" 
                        placeholder="What's on your mind?"
                        className="w-full px-4 py-2.5 rounded-full border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3B5998] focus:border-transparent text-gray-700"
                      />
                      <div className="mt-3 flex justify-end">
                        <Button className="bg-[#3B5998] text-white hover:bg-[#2D4373] px-8">Share</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id} className="border-none shadow-md bg-white overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="h-10 w-10 border border-gray-200">
                          <AvatarFallback className="bg-[#3B5998] text-white">
                            {post.author.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-[#1C2B4B]">{post.author}</p>
                          <p className="text-xs text-gray-500">Just now</p>
                        </div>
                      </div>
                      <p className="text-gray-700 text-[15px]">{post.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
