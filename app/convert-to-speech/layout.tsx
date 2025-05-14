'use client';
import Navbar from '@/components/navbar';
import { useWallet } from '@solana/wallet-adapter-react';
import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ErrorIcon } from '@/assets/svg';

// export const metadata = {
//   title: 'Audiofy | Convert PDF Document to Speech web app',
//   description: 'This is a web application that allows you to convert pdf document into speech',
// };

export default function Layout({ children }: { children: ReactNode }) {
  const { publicKey } = useWallet();
  return (
    <div>
      <Navbar />
      {!publicKey ? (
        <div className="pt-60 flex justify-center">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mx-auto">
                <ErrorIcon />
              </div>
              <h2 className="text-xl font-semibold">You're not connected to wallet</h2>
              <p className="text-muted-foreground mt-2">Please connect wallet to continue</p>
              <WalletMultiButton
                style={{
                  background: '#000',
                  color: '#FFF',
                  borderRadius: '0.375rem',
                  transition: 'background-color 0.2s',
                  height: '44px',
                  fontSize: '12px',
                  fontWeight: '400',
                  padding: '3px 24px',
                  margin: '10px 0',
                }}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="pt-[60px]">{children}</div>
      )}
    </div>
  );
}
