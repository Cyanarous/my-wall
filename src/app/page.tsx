"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

interface Post {
  id: string;
  user_id: string | null;
  body: string;
  created_at: string;
  image_url: string | null;
}

const CHAR_LIMIT = 280;
const AUTHOR_NAME = "Gabriel Carlos";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [charsRemaining, setCharsRemaining] = useState(CHAR_LIMIT);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initial fetch
    fetchPosts();

    // Set up real-time subscription
    const channel = supabase
      .channel('public:posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
        },
        async (payload) => {
          console.log('Real-time change received:', payload);
          // Fetch all posts again to ensure we have the latest data
          await fetchPosts();
        }
      )
      .subscribe((status) => {
        console.log('Supabase real-time subscription status:', status);
      });

    // Cleanup subscription
    return () => {
      console.log('Cleaning up subscription');
      channel.unsubscribe();
    };
  }, []);

  const fetchPosts = async () => {
    console.log('Fetching posts...');
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Successfully fetched posts:', data);
      setPosts(data || []);
    } catch (error) {
      console.error('Error in fetchPosts:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown name',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const dropZone = e.currentTarget;
    dropZone.classList.add('bg-blue-50', 'border-blue-500');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const dropZone = e.currentTarget;
    dropZone.classList.remove('bg-blue-50', 'border-blue-500');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const dropZone = e.currentTarget;
    dropZone.classList.remove('bg-blue-50', 'border-blue-500');

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert('File size must be less than 5MB');
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      // Validate file size (5MB)
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size must be less than 5MB');
      }

      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      console.log('Attempting to upload file:', {
        name: fileName,
        type: file.type,
        size: file.size
      });

      // Create form data for the file
      const { error: uploadError } = await supabase.storage
        .from('wall-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', {
          message: uploadError.message,
          name: uploadError.name,
          details: uploadError
        });
        throw uploadError;
      }

      console.log('File uploaded successfully, getting public URL');
      
      const { data } = supabase.storage
        .from('wall-images')
        .getPublicUrl(fileName);

      if (!data.publicUrl) {
        throw new Error('Failed to get public URL for uploaded file');
      }

      console.log('Generated public URL:', data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown name'
      });
      throw error;
    }
  };

  const handleShare = async () => {
    if (newMessage.trim() && newMessage.length <= CHAR_LIMIT && !isLoading) {
      setIsLoading(true);
      try {
        let imageUrl = null;
        if (selectedImage) {
          console.log('Starting image upload process for file:', {
            name: selectedImage.name,
            size: selectedImage.size,
            type: selectedImage.type
          });
          imageUrl = await uploadImage(selectedImage);
          console.log('Image uploaded successfully:', imageUrl);
        }

        const newPost = {
          body: newMessage.trim(),
          image_url: imageUrl,
          user_id: null // Since we're not implementing auth yet
        };

        console.log('Attempting to create post:', newPost);

        const { data, error } = await supabase
          .from('posts')
          .insert([newPost])
          .select()
          .single();

        if (error) {
          console.error('Database insert error:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }

        console.log('New post inserted:', data);
        
        // Optimistically update the UI
        if (data) {
          setPosts((currentPosts) => [data, ...currentPosts]);
        }

        // Reset form
        setNewMessage("");
        setCharsRemaining(CHAR_LIMIT);
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error creating post:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : 'No stack trace'
        });
        
        // More descriptive error message
        if (error instanceof Error) {
          alert(`Failed to create post: ${error.message}`);
        } else {
          alert('Failed to create post. Please check the console for more details.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= CHAR_LIMIT) {
      setNewMessage(text);
      setCharsRemaining(CHAR_LIMIT - text.length);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
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
    return date.toLocaleDateString();
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
                
                {/* Image Upload Area */}
                {!imagePreview ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors duration-200 ease-in-out cursor-pointer hover:border-blue-500 hover:bg-blue-50"
                  >
                    <div className="flex flex-col items-center">
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p className="text-sm text-gray-600">Drag and drop an image here, or click to select</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                      className="hidden"
                      ref={fileInputRef}
                    />
                  </div>
                ) : (
                  <div className="relative mt-2 inline-block">
                    <Image 
                      src={imagePreview}
                      alt="Preview" 
                      width={400}
                      height={300}
                      className="max-h-48 rounded-lg object-contain"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}

                <div className="flex justify-between items-center mt-3 text-sm">
                  <span className="text-[#65676B]">{charsRemaining} characters remaining</span>
                  <button 
                    onClick={handleShare}
                    disabled={!newMessage.trim() || newMessage.length > CHAR_LIMIT || isLoading}
                    className="px-8 py-2 bg-[#4267B2] text-white font-medium rounded hover:bg-[#365899] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sharing...' : 'Share'}
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
                            {AUTHOR_NAME.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <p className="font-semibold text-[#1C2B4B]">{AUTHOR_NAME}</p>
                          <p className="text-[13px] text-[#65676B]">{formatTimestamp(post.created_at)}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-[15px] text-[#1C2B4B] mb-4">{post.body}</p>
                    {post.image_url && (
                      <div className="mt-2">
                        <Image 
                          src={post.image_url}
                          alt="Post image"
                          width={800}
                          height={600}
                          className="rounded-lg max-h-96 w-auto object-contain"
                        />
                      </div>
                    )}
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
