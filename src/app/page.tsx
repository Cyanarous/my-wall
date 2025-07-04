"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Post {
  id: number;
  author: string;
  content: string;
  timestamp: number;
}

const CHAR_LIMIT = 280;
const AUTHOR_NAME = "Gabriel Carlos";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [charsRemaining, setCharsRemaining] = useState(CHAR_LIMIT);

  // Load posts from localStorage on initial render
  useEffect(() => {
    const savedPosts = localStorage.getItem("wall-posts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("wall-posts", JSON.stringify(posts));
  }, [posts]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= CHAR_LIMIT) {
      setNewMessage(text);
      setCharsRemaining(CHAR_LIMIT - text.length);
    }
  };

  const handleShare = () => {
    if (newMessage.trim() && newMessage.length <= CHAR_LIMIT) {
      const newPost: Post = {
        id: Date.now(),
        author: AUTHOR_NAME,
        content: newMessage.trim(),
        timestamp: Date.now(),
      };
      setPosts([newPost, ...posts]); // Add new post at the beginning
      setNewMessage("");
      setCharsRemaining(CHAR_LIMIT);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    // Less than a minute
    if (diff < 60000) {
      return "just now";
    }
    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }
    // Less than a day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
    // Otherwise show date
    return new Date(timestamp).toLocaleDateString();
  };

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
              <h2 className="text-2xl font-bold text-[#1C2B4B]">{AUTHOR_NAME}</h2>
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
                  value={newMessage}
                  onChange={handleMessageChange}
                  className="w-full min-h-[120px] p-3 text-[15px] text-gray-700 placeholder-gray-500 bg-[#F0F2F5] border-0 rounded-lg resize-none focus:outline-none focus:ring-0"
                />
                <div className="flex justify-between items-center mt-3 text-sm">
                  <span className="text-[#65676B]">{charsRemaining} characters remaining</span>
                  <button 
                    onClick={handleShare}
                    disabled={!newMessage.trim() || newMessage.length > CHAR_LIMIT}
                    className="px-8 py-2 bg-[#4267B2] text-white font-medium rounded hover:bg-[#365899] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
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
                          <p className="text-[13px] text-[#65676B]">{formatTimestamp(post.timestamp)}</p>
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
