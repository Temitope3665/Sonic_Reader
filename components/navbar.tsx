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
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { balance } = useAppContext();
  const pathname = usePathname();
  const { publicKey } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="px-4 md:px-10 w-full border-b border-neutral-200 py-5 fixed bg-white z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Image src={Logo} alt="logo" className="w-[40px]" />
          <h1 className="ml-1 font-semibold">SonicReader</h1>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:space-x-8 lg:space-x-16 items-center">
          <div className="flex space-x-4 md:space-x-8 items-center text-sm">
            {navs.map((nav, i) => (
              <Link key={i} href={nav.url} className={cn('hover:text-slate-400', pathname === nav.url && 'border-b-2 border-b-black')}>
                {nav.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-center">
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
            {publicKey && <p className="text-sm">Balance: {balance.toFixed(1)}</p>}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden pt-4 pb-2">
          <div className="flex flex-col space-y-4">
            {navs.map((nav, i) => (
              <Link
                key={i}
                href={nav.url}
                className={cn('hover:text-slate-400 text-sm', pathname === nav.url && 'border-b-2 border-b-black')}
                onClick={() => setIsMenuOpen(false)}
              >
                {nav.label}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-2">
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
              {publicKey && <p className="text-sm">Balance: {balance.toFixed(1)}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
