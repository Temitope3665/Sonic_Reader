import Navbar from '@/components/navbar';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Audiofy | Convert PDF Document to Speech web app',
  description: 'This is a web application that allows you to convert pdf document into speech',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="pt-[60px]">{children}</div>
    </div>
  );
}
