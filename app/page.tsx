'use client';

import Navbar from '@/components/navbar';
import Image from 'next/image';
import SoundWave from '@/assets/images/sound-wave.png';
import ShortFemale from '@/assets/images/shot-female-student-listens-audio-book-with-earphones-mobile-phone-writes-some-records-details-diary-poses-stairs-outdoor-prepares-seminar-uses-internet-technology.jpg';
import { Download, Gift, Headphones, MoveRight, Upload, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-[#F7F8F3] min-h-screen w-full">
      <Navbar />

      <div className="pt-32 px-8 space-y-12">
        <div className="flex justify-between gap-12 items-center">
          <div className="w-[60%] space-y-12">
            <h1 className="font-light text-7xl text-[#262724]">
              Architectural <span className="text-[#B3B4AF]">Precision in Audio</span> Learning.
            </h1>
            <p className="font-light ">
              SonicReader blends voice synthesis with decentralized tech, elevating how documents are delivered — refined, intelligent, and always accessible.
            </p>
          </div>
          <div className="w-[40%]">
            <Image src={ShortFemale} alt="short female" className="" />
          </div>
        </div>
        <div className="flex items-start py-8">
          <div className="w-[40%] space-y-20">
            <Image src={SoundWave} alt="sound wave" className="-ml-10" />
            <div>
              <p className="font-light text-6xl text-[#B3B4AF] italic">Seamlessly transform documents into audio</p>
            </div>
          </div>
          <div className="w-[60%]">
            <p className="text-[#B3B4AF]">How it works: </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#ECE3DA] h-[300px] p-4">
                <p className="rounded-full w-8 h-8 bg-white text-black font-extralight flex items-center justify-center">01.</p>
                <div className="my-16 space-y-4">
                  <Wallet className="text-primary" size={24} strokeWidth={1} />
                  <div>
                    <p className="font-medium text-xl">Connect Your Wallet</p>
                    <p className="font-light text-sm">Securely sign in using your Solana wallet — no passwords, just crypto-native access.</p>
                  </div>
                  <div className="flex space-x-2 text-sm items-center">
                    <Link href={'/convert-to-speech'} className="flex space-x-2">
                      <p className="font-extralight">Learn more</p>
                      <MoveRight size={18} strokeWidth={1} />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="bg-[#262626] h-[300px] p-4">
                <p className="rounded-full w-8 h-8 bg-white text-black font-extralight flex items-center justify-center">02.</p>

                <div className="my-16 space-y-4">
                  <Upload className="text-[#B3B4AF]" size={24} strokeWidth={1} />

                  <div>
                    <p className="font-medium text-xl text-[#B3B4AF]">Upload Your PDF</p>
                    <p className="font-light text-sm text-white">Drag and drop or select a file — we support all standard documents for conversion.</p>
                  </div>
                  <div className="flex space-x-2 text-sm items-center text-white">
                    <Link href={'/convert-to-speech'} className="flex space-x-2">
                      <p className="font-extralight">Learn more</p>
                      <MoveRight size={18} strokeWidth={1} />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="bg-[#DFDBE5] h-[300px] p-4">
                <p className="rounded-full w-8 h-8 bg-white text-black font-extralight flex items-center justify-center">03.</p>

                <div className="my-16 space-y-4">
                  <Headphones className="text-primary" size={24} strokeWidth={1} />
                  <div>
                    <p className="font-medium text-xl">Convert to Audio</p>
                    <p className="font-light text-sm">Our AI reads your document and generates high-quality voice playback in seconds.</p>
                  </div>
                  <div className="flex space-x-2 text-sm items-center">
                    <Link href={'/convert-to-speech'} className="flex space-x-2">
                      <p className="font-extralight">Learn more</p>
                      <MoveRight size={18} strokeWidth={1} />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-[#262626] h-[300px] p-4">
                <p className="rounded-full w-8 h-8 bg-white text-black font-extralight flex items-center justify-center">04.</p>

                <div className="my-16 space-y-4">
                  <Download className="text-[#B3B4AF]" size={24} strokeWidth={1} />
                  <div>
                    <p className="font-medium text-xl text-[#B3B4AF]">Stream or Download</p>
                    <p className="font-light text-sm text-white">Listen directly on your dashboard or download for offline use — anytime, anywhere.</p>
                  </div>
                  <div className="flex space-x-2 text-sm items-center text-white">
                    <Link href={'/convert-to-speech'} className="flex space-x-2">
                      <p className="font-extralight">Learn more</p>
                      <MoveRight size={18} strokeWidth={1} />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-[#ECE3DA] h-[300px] p-4">
                <p className="rounded-full w-8 h-8 bg-white text-black font-extralight flex items-center justify-center">05.</p>
                <div className="my-16 space-y-4">
                  <Gift className="text-primary" size={24} strokeWidth={1} />

                  <div>
                    <p className="font-medium text-xl">Earn Rewards</p>
                    <p className="font-light text-sm">Unlock badges or NFTs as you listen and engage — turning learning into a rewarding experience.</p>
                  </div>
                  <div className="flex space-x-2 text-sm items-center">
                    <Link href={'/convert-to-speech'} className="flex space-x-2">
                      <p className="font-extralight">Learn more</p>
                      <MoveRight size={18} strokeWidth={1} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-y border-y-[#B3B4AF] space-y-4 px-8 flex items-end py-4">
          <h1 className="font-light text-7xl text-[#262724]">
            Redefining <span className="text-[#B3B4AF]">Document Interaction</span> Through Sound
          </h1>
          <div className="mt-12">
            <Button className="w-[300px] rounded-full h-[50px] mb-4">Get Started</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
