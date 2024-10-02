"use client";
import { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { createClient } from "@/utils/supabase/client"; // Client-side Supabase initialization
import Link from "next/link";
import { User } from '@/types/types'


export default function Header() {
  const [user, setUser] = useState<User | null>(null); // Update state type
  const [avatarUrl, setAvatarUrl] = useState("/images/default.png");
  const supabase = createClient();

  useEffect(() => {
    async function getUserData() {
      // Fetch user from Supabase client-side
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user as unknown as User); // Type assertion to match local User type
        // Fetch the user's profile to get the avatar URL
        const { data } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", user.id)
          .single();

        if (data?.avatar_url) {
          const { data: { publicUrl } } = supabase.storage
            .from("avatars")
            .getPublicUrl(data.avatar_url);

          setAvatarUrl(publicUrl || "/images/default.png");
        }
      }
    }

    getUserData();
  }, [supabase]);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-4 bg-white dark:bg-[#171717] border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center space-x-8"></div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
        <div>
          <ThemeToggle />
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-2">
          {user ? (
            <Link href="/dashboard/account">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} alt={`${user?.email}'s Avatar`} />
                <AvatarFallback>
                  <img src="/images/default.png" alt="Fallback Avatar" />
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
