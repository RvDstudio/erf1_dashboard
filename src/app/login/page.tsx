import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { emailLogin, signup } from './actions';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { OAuthButtons } from './oauth-signin';
import Image from 'next/image';

export default async function Login({ searchParams }: { searchParams: { message: string } }) {
  const supabase = await createClient();

  // Check if a session exists on the server-side
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is authenticated, redirect to the homepage
  if (session?.user) {
    return redirect('/');
  }

  return (
    <div className="w-full lg:grid h-screen lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <form id="login-form" className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input minLength={6} name="password" id="password" type="password" required />
            </div>
            {searchParams.message && <div className="text-sm font-medium text-destructive">{searchParams.message}</div>}
            <Button formAction={emailLogin} className="w-full">
              Login
            </Button>
          </form>
          <OAuthButtons />
          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <button formAction={signup} form="login-form" className="underline">
              Sign up
            </button>
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <Image src="/images/cow.png" alt="Image" width="500" height="500" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
