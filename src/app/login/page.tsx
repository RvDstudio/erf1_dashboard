// Path: src\app\login\page.tsx
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
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="bg-gray-100 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
        <Image src="/images/cow.png" alt="" className="w-full h-full object-cover" width={500} height={500} />
      </div>

      <div
        className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12
          flex items-center justify-center"
      >
        <div className="w-full h-100">
          <div className="flex justify-center items-center mb-6 ">
            <Image src="/images/datproefje.png" alt="" className="" width={300} height={300} />
          </div>
          <h2 className="text-xl text-[#374C69] md:text-2xl font-bold text-center mb-6">Log in op uw account</h2>
          <form id="login-form" className="grid gap-4 max-w-[400px] mx-auto">
            <div className="grid gap-2 text-[#374C69]">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-gray-100 focus:bg-white border-[#dddddd]"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center text-[#374C69]">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                minLength={6}
                name="password"
                id="password"
                type="password"
                placeholder="password"
                required
                className="bg-gray-100 focus:bg-white border-[#dddddd] "
              />
            </div>
            {searchParams.message && <div className="text-sm font-medium text-destructive">{searchParams.message}</div>}
            <Button formAction={emailLogin} className="w-full bg-[#374C69] text-white hover:bg-[#374C69]/90">
              Login
            </Button>
          </form>
          <OAuthButtons />
          <div className="text-center text-[#374C69] text-sm">
            Heeft u nog geen account?{' '}
            <button formAction={signup} form="login-form" className="underline text-[#374C69]">
              Account aanmaken
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
