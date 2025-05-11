'use client';
import Image from 'next/image';
import Logo from '@/assets/icon/logo.png';
import Link from 'next/link';
import { navs } from '@/config/navigations';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAppContext } from '@/context/app-context';
import { useWallet } from '@solana/wallet-adapter-react';

const Navbar: React.FC = () => {
  const { balance } = useAppContext();
  const pathname = usePathname();
  const { publicKey } = useWallet();

  return (
    <div className="px-10 w-full border-b border-neutral-200 py-5 fixed bg-white z-10 flex justify-between">
      <div className="flex items-center">
        <Image src={Logo} alt="logo" className="w-[40px]" />
        <h1 className="ml-1 font-semibold">SonicReader</h1>
      </div>

      <div className="space-x-16 flex items-center">
        <div className="flex space-x-8 items-center text-sm">
          {navs.map((nav, i) => (
            <Link key={i} href={nav.url} className={cn('mr-5 hover:text-slate-400', pathname === nav.url && 'border-b-2 border-b-black')}>
              {nav.label}
            </Link>
          ))}
        </div>
        <div className="flex space-x-2 items-center">
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
            }}
          />
          {publicKey && <p>Balance: {balance.toFixed(1)}</p>}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
