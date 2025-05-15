'use client';
import Navbar from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { encodeURL, createQR } from '@solana/pay';
import { Keypair, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useSendSol } from '@/hooks/use-pay';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { LoadingFallback } from '@/components/suspense-loading';

export default function Subscription() {
  const [_, setPaymentLink] = useState<any | null>(null);
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [txId, setTxId] = useState('5DbQp2LchjucA2v7FCriAPf9uvNEpi9hVs4f1hDCTRyB9yP89Ep6nxNPgb7KDEv6siouTDGFH79Vr4isTxURDeSk');
  const qrRef: any = useRef(null);
  const reference = Keypair.generate().publicKey;
  const isPaid = typeof window !== 'undefined' && localStorage.getItem('isSubscribed'); // Retrieve the payment status from local storage

  const { sendSolFromUser } = useSendSol();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const url = encodeURL({
      recipient: new PublicKey('45Tv4jzLswUfBHNvNuYeQ3udoHf2T7MMbps5AXgrDgH9'),
      amount: new BigNumber(1),
      reference: new PublicKey(reference.toBase58()),
      splToken: new PublicKey('Ejmc1UB4EsES5UFgxW2ZcxFb3r9iHpbKdrqZx6ELpBvT'), // Devnet USDC Mint
      label: 'ListenPDF',
      message: 'Subscribe to convert PDFs to Audio',
    });

    if (isClient && !isPaid) {
      const qr = createQR(url, 300);
      qrRef.current.innerHTML = '';
      qr.append(qrRef.current);
      setPaymentLink(url);
    }
  }, [isClient]);

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      const tx = await sendSolFromUser(2); // Send 0.01 SOL
      setTxId(tx);
      localStorage.setItem('isSubscribed', tx);
      toast({
        variant: 'success',
        title: 'Payment Successful',
        description: 'Your payment has been processed successfully.',
      });
    } catch (err) {
      console.log(err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while processing your payment.',
      });
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="bg-[#F7F8F3] min-h-screen w-full">
      <Navbar />

      {!isClient && <LoadingFallback />}

      <div className="pt-28 px-4 md:px-0 flex justify-center items-center">
        {isPaid ? (
          <Card className="w-full md:w-[600px] lg:w-[40vw] text-center">
            <CardContent className="pt-6 pb-4 flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-green-700">Payment Successful!</h2>
              <p className="text-sm md:text-base text-muted-foreground mt-2 px-4 md:px-0">
                Your payment of <span className="font-medium">2.00 SOL</span> has been processed successfully.
              </p>
              <p className="text-sm md:text-base text-muted-foreground mt-1">You now have full access to our conversion service.</p>

              <div className="mt-3 text-green-600 text-sm md:text-base">
                ✅ Tx ID:{' '}
                <a
                  href={`https://explorer.solana.com/tx/${txId}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline break-all md:break-normal"
                >
                  {txId.slice(0, 6)}...{txId.slice(-6)}
                </a>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button asChild className="text-sm md:text-base">
                <Link href="/convert-to-speech">
                  Continue to Library <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-full md:w-[600px] lg:w-[40vw] text-center">
            <CardHeader>
              <CardTitle>
                <h2 className="text-2xl md:text-4xl font-light">Subscribe to Convert</h2>
                <p className="font-light text-xs md:text-sm w-full md:w-1/2 text-center mx-auto px-4 md:px-0">
                  Subscribe a token of 2 sol to use our service. You can make a payment through solana pay
                </p>
              </CardTitle>
              <CardDescription> </CardDescription>
            </CardHeader>
            <CardContent className="text-center w-full flex justify-center px-4 md:px-6">
              <div>
                <div className="mx-auto scale-75 md:scale-100" ref={qrRef} />
                <p className="mr-4 mb-4 text-sm md:text-base">or</p>
                <Button onClick={handlePayment} loading={isPaying} loadingText="Please wait..." className="text-sm md:text-base">
                  Pay with Solana Pay
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
