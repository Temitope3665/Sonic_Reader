import Image from 'next/image';
import Logo from '@/assets/icon/logo.png';

const Navbar: React.FC = () => {
  return (
    <div className="px-10 w-full border-b border-neutral-200 py-5 fixed bg-white z-10">
      <div className="flex items-center">
        <Image src={Logo} alt="logo" className="w-[40px]" />
        <h1 className="ml-1 font-semibold">SonicReader</h1>
      </div>
    </div>
  );
};

export default Navbar;
