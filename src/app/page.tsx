import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const posts = [
  {
    id: 1,
    author: "Anna",
    content: "Hey Greg, did you debug your coffee maker yet? Last cup tasted like JavaScript errors.",
  },
  {
    id: 2,
    author: "Adelaida",
    content: "Greg, saw your last coding session—pretty sure you broke Stack Overflow again! 🚨",
  },
  {
    id: 3,
    author: "Juho",
    content: "Greg, are you still coding in pajamas, or have you upgraded to full-time sweatpants mode?",
  },
  {
    id: 4,
    author: "Maija",
    content: "Greg, rumor has it your computer has more stickers than code running on it. Confirm?",
  },
  {
    id: 5,
    author: "Alex",
    content: "Yo Greg, just pulled an all-nighter on the assignment. Turns out sleep deprivation doesn't improve coding skills. Weird!",
  },
  {
    id: 6,
    author: "Sheryl",
    content: "Greg, when are we gonna deploy your latest dance moves to production? #AgileDancer",
  },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between bg-[#2B87FF] text-white p-4 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-white">My Wall</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b bg-primary/5">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20 border-4 border-primary">
                  <AvatarImage src="/greg.jpg" alt="Greg Wientjes" />
                  <AvatarFallback className="bg-primary text-white">GW</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-primary">Greg Wientjes</h2>
                  <p className="text-primary/60">Wall</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="space-y-4 pt-4">
                <div>
                  <h3 className="font-medium text-primary/60 mb-1">Networks</h3>
                  <p className="text-primary/80">Stanford Alum</p>
                </div>
                <div>
                  <h3 className="font-medium text-primary/60 mb-1">Current City</h3>
                  <p className="text-primary/80">Palo Alto, CA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <div className="space-y-4">
            <div className="flex justify-end gap-3 items-center">
              <input 
                type="text" 
                placeholder="What's on your mind?"
                className="flex-1 px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2B87FF] focus:border-transparent"
              />
              <Button variant="secondary" className="bg-[#2B87FF] text-white hover:bg-[#2377e2] w-32 text-sm">Share</Button>
            </div>
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="border-b pb-4 last:border-0">
                      <p className="font-medium mb-2 text-primary">{post.author}</p>
                      <p className="text-primary/70">{post.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
