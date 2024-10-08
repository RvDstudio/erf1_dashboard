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
    <div className="pl-10 pt-10 pb-10 flex flex-col lg:flex-row">
      <div className="bg-white dark:bg-[#252525] rounded-lg shadow-sm mr-8 mb-6">
        <div className="mt-0 flex flex-col md:flex-row p-8">
          <div className="">
            <h2 className="text-xl mb-3 text-[#374c69]">Gebruikersprofiel</h2>
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
            <div className="mt-6 text-[#888888] flex flex-col space-y-4">
              <div className="flex justify-center items-center ">
                <Label htmlFor="fullname" className="w-48">
                  Full Name
                </Label>
                <input
                  className="px-4 bg-gray-100 rounded dark:bg-[#414141] ml-4"
                  id="fullName"
                  type="text"
                  value={fullname || ''}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
              <div className="flex justify-between items-center ">
                <Label htmlFor="username" className="w-48">
                  Username
                </Label>
                <input
                  className="px-4 bg-gray-100 rounded items-center dark:bg-[#414141] ml-4"
                  id="username"
                  type="text"
                  value={username || ''}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="flex justify-between items-center ">
                <Label htmlFor="website" className="w-48">
                  Website
                </Label>
                <input
                  className="px-4 bg-gray-100 rounded items-center dark:bg-[#414141] ml-4"
                  id="website"
                  type="url"
                  value={website || ''}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-10">
              <Button
                className="text-white dark:bg-[#323232] bg-[#374c69] hover:bg-[#374c69]/90 dark:text-white"
                onClick={() => updateProfile({ fullname, username, website, avatar_url: avatarUrl })}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Profiel bijwerken'}
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                Uitloggen
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white flex-1 dark:bg-[#252525] rounded-lg shadow-sm border border-gray-200 dark:border-[#2e2e2e] mr-8">
        <div className="mt-0 flex flex-col md:flex-row p-8">
          <div className="">
            <h2 className="text-xl mb-3 text-[#374c69]">Meer informatie komt hier</h2>
            <p className="text-[#888888]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis pariatur commodi, itaque officia nostrum
              dolore sint obcaecati vitae ad voluptatibus voluptatem, officiis fuga deleniti nobis eos sequi nihil.
              Totam corporis magni modi impedit, ipsa quam maxime. Ad alias nulla perspiciatis expedita deserunt rem
              delectus, ut id voluptate? Error, ex, expedita tempore minima accusantium debitis nulla sunt quibusdam
              quas alias dicta quae accusamus facere? Amet libero minus velit repellendus corrupti accusamus fuga
              nostrum et, a perferendis, consequuntur esse aut exercitationem. Perferendis doloremque qui debitis
              ducimus, beatae delectus fugit consequatur temporibus, veniam corporis ut, modi odio vero dignissimos!
              Vitae quas explicabo laborum reprehenderit est eaque illum sit cum repellendus alias error iusto ad
              tempore quisquam labore non harum exercitationem, quam cumque porro repellat facere numquam omnis.
              Consectetur ullam dignissimos illo unde reprehenderit alias neque minus voluptatum quibusdam, hic maxime
              dicta vel eius nostrum similique vero? Nostrum temporibus repudiandae, harum, nisi repellendus, modi culpa
              voluptatem consectetur possimus qui delectus ratione laudantium voluptatum? Id reiciendis voluptatum
              commodi ipsam totam. Quaerat a eum odit dicta at commodi deleniti expedita necessitatibus, inventore
              laboriosam hic explicabo dignissimos praesentium error consequuntur nam et soluta esse, quasi ipsa ratione
              dolores autem tempora. Tempora expedita itaque neque impedit quia eum.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
