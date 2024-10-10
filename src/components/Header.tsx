'use client';

import { useEffect, useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { createClient } from '@/utils/supabase/client'; // Client-side Supabase initialization
import Link from 'next/link';
import { User } from '@/types/types';
import { MobileSidebar } from './MobileSidebar';
import { FC } from 'react';
import Image from 'next/image';

const AvatarFallback: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('/images/default.png');
  const [username, setUsername] = useState(''); // State for username
  const [isScrolled, setIsScrolled] = useState(false); // Track scroll state
  const supabase = createClient();

  useEffect(() => {
    async function getUserData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user as unknown as User);

        // Fetch the user's profile to get the avatar URL and username
        const { data } = await supabase.from('profiles').select('avatar_url, username').eq('id', user.id).single();

        if (data?.avatar_url) {
          const {
            data: { publicUrl },
          } = supabase.storage.from('avatars').getPublicUrl(data.avatar_url);

          setAvatarUrl(publicUrl || '/images/default.png');
        }

        if (data?.username) {
          setUsername(data.username); // Set username
        }
      }
    }

    getUserData();
  }, [supabase]);

  // Add scroll event listener to track when the user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll); // Cleanup event listener
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between px-4 py-4 bg-[#f7f7f7] transition-shadow duration-300 ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="md:hidden">
        <MobileSidebar />
      </div>

      <div className="flex items-center space-x-8">
        {user && <div className="text-lg font-medium text-gray-900 pl-4">Welcome: {username}</div>}
      </div>

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
                  <Image src="/images/default.png" alt="Default Avatar" width={32} height={32} />
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
