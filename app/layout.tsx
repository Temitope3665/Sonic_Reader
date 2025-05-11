import localFont from 'next/font/local';
import React from 'react';
import { cn } from '../lib/utils';
import Navbar from '@/components/navbar';
import '@/styles/globals.css';
// import { Toast } from '@/components/ui/use-toast';

const gilroyFont = localFont({
  variable: '--font-sans',
  src: [
    {
      path: '../assets/fonts/Gilroy-UltraLight.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Gilroy-Thin.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Gilroy-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Gilroy-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Gilroy-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Gilroy-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Gilroy-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Gilroy-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Gilroy-Heavy.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
});

export const metadata = {
  title: 'Convert PDF Document to Speech web app',
  description: 'This is a web application that allows you to convert pdf document into speech',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <title>Convert PDF Document to Speech web app</title>
      </head>
      <body className={cn('font-sans', gilroyFont.variable)}>
        <Navbar />
        <div className="pt-[60px]">{children}</div>
        {/* <Toaster /> */}
      </body>
    </html>
  );
}
