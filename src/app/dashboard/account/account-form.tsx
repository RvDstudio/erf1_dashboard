// Path: src\app\dashboard\account\account-form.tsx
'use client';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import Image from 'next/image';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { MoveHorizontalIcon, SearchIcon } from 'lucide-react';

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/login'); // Redirect to login page or other destination
    } else {
      console.error('Error signing out:', error);
    }
  };

  const getProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      alert('Error loading user data!');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user, getProfile]);

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      setAvatarUrl(filePath);
      await updateProfile({ fullname, username, website, avatar_url: filePath });
    } catch (error: unknown) {
      alert((error as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function updateProfile({
    username,
    fullname,
    website,
    avatar_url,
  }: {
    username: string | null;
    fullname: string | null;
    website: string | null;
    avatar_url: string | null;
  }) {
    if (!user?.id) return;

    try {
      setLoading(true);

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert('Profile updated!');
    } catch {
      alert('Error updating the data!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pl-10 pt-10 pb-10">
      <div className="bg-white dark:bg-[#252525] rounded-lg shadow-sm border border-gray-200 dark:border-[#2e2e2e] mr-8">
        <div className="mt-0 flex flex-col md:flex-row p-6">
          <div className="border-none md:border-r border-gray-200">
            <div className="border-b md:border-b-0 md:border-r md:pr-8 border-gray-200 dark:border-[#414141] pb-6">
              <h2 className="text-xl mb-3 text-[#888888]">User Profile</h2>
              <div className="flex flex-col items-center w-full">
                {avatarUrl && (
                  <Image
                    src={
                      supabase.storage.from('avatars').getPublicUrl(avatarUrl).data?.publicUrl || '/images/default.png'
                    }
                    alt="Avatar"
                    width={100}
                    height={100}
                    className="rounded"
                  />
                )}
                <div>
                  <Label htmlFor="image-upload" className="text-[18px] block mb-4 text-center">
                    Avatar
                  </Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="mb-2"
                    onChange={uploadAvatar}
                    disabled={uploading}
                    aria-describedby="file-upload-description"
                  />
                  <p id="file-upload-description" className="text-sm text-center text-gray-500 mt-1">
                    JPG, PNG, GIF (max 5MB)
                  </p>
                </div>
              </div>
              <div className="mt-4 text-[#888888]">
                <div className="flex justify-between items-center space-y-4">
                  <Label htmlFor="fullname" className="w-48">
                    Full Name
                  </Label>
                  <input
                    className="px-4 py-1 rounded items-center dark:bg-[#414141] ml-4"
                    id="fullName"
                    type="text"
                    value={fullname || ''}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </div>
                <div className="flex justify-between items-center space-y-4">
                  <Label htmlFor="username" className="w-48">
                    Username
                  </Label>
                  <input
                    className="px-4 py-1 rounded items-center dark:bg-[#414141] ml-4"
                    id="username"
                    type="text"
                    value={username || ''}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="flex justify-between items-center space-y-4">
                  <Label htmlFor="website" className="w-48">
                    Website
                  </Label>
                  <input
                    className="px-4 py-1 rounded items-center dark:bg-[#414141] ml-4"
                    id="website"
                    type="url"
                    value={website || ''}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-10">
                <Button
                  className="text-white dark:bg-[#323232] dark:text-white"
                  onClick={() => updateProfile({ fullname, username, website, avatar_url: avatarUrl })}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign out
                </Button>
              </div>
            </div>
          </div>
          <div className="md:pl-6 w-full">
            <div className="flex items-center justify-between mb-6 mt-2">
              <h1 className="text-xl text-[#888888]">Recente bestellingen</h1>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-[#252525]" />
                <Input
                  type="search"
                  placeholder="Search team members..."
                  className="pl-10 pr-4 py-2 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-[#414141] dark:text-gray-200"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-4 dark:bg-[#414141] relative">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium">Biologische sinaasappel vla</h3>
                      <Badge
                        variant="outline"
                        className="bg-gray-100 text-gray-700 dark:bg-[#252525] dark:text-gray-300"
                      >
                        Onze Zuivel
                      </Badge>
                    </div>
                    <p className="text-gray-500 dark:text-[#252525] text-sm">Erf1 zuivel & meer</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <MoveHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Team member actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Bestelling bekijken</DropdownMenuItem>
                      <DropdownMenuItem>Opnieuw bestellen</DropdownMenuItem>
                      <DropdownMenuItem>verwijderen</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {/* Repeated orders block remain unchanged */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
