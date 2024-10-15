'use client';
import { Button } from '@/components/ui/button';
import { Provider } from '@supabase/supabase-js';
import { Github } from 'lucide-react';
import { oAuthSignIn } from './actions';

type OAuthProvider = {
  name: Provider; // Expecting a string matching a valid provider
  displayName: string;
  icon?: JSX.Element;
};

export function OAuthButtons() {
  const oAuthProviders: OAuthProvider[] = [
    {
      name: 'github' as Provider, // Cast the string to the correct Provider type
      displayName: 'Github',
      icon: <Github className="size-5" />,
    },
    {
      name: 'google' as Provider, // Cast the string to the correct Provider type
      displayName: 'Google',
      icon: <Github className="size-5" />,
    },
    {
      name: 'azure' as Provider, // Cast the string to the correct Provider type
      displayName: 'Azure',
      icon: <Github className="size-5" />,
    },
  ];

  return (
    <>
      {oAuthProviders.map((provider) => (
        <Button
          key={provider.name} // Always add a key when rendering list items
          className="w-full flex items-center justify-center gap-2"
          variant="outline"
          onClick={async () => {
            await oAuthSignIn(provider.name);
          }}
        >
          {provider.icon}
          Login with {provider.displayName}
        </Button>
      ))}
    </>
  );
}
