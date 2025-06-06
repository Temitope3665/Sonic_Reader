'use client';

import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import * as pdfjs from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Speech from 'speak-tts';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Slider } from '@/components/ui/slider';
import SelectComp from '@/components/select-comp';
import { speechConfig } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { FileAudio, FilePlus2, FileText, Pause, Play } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FileUpload from '@/components/ui/file-upload';
import { ErrorIcon } from '@/assets/svg';
import { unlockAndMintNFT } from '@/config/mint-nft';

export default function Home() {
  const { publicKey } = useWallet();
  const [open, setOpen] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [totalPdfPage, setTotalPdfPage] = useState(0);
  const [allVoices, setAllVoices] = useState([]);
  const [rate, setRate] = useState(0.7);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [pdfData, setPdfData] = useState<any>(null);
  const [selectedVoice, setSelectedVoice] = useState(undefined);
  const [initialPdfs, setInitialPdfs] = useState<any>([]);
  const [text, setText] = useState('');
  const [currentPlaying, setCurrentPlaying] = useState<{ data: string; name: string; id: string } | null>(null);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(0);
  const [overallTexts, setOverallTexts] = useState<string[]>([]);
  const speech = typeof window !== 'undefined' && new Speech();
  const [loading, setLoading] = useState(false);
  const savedPdfs = typeof window !== 'undefined' && localStorage.getItem('sonic_reader_pdfs');

  const handleReadPdf = async (pdfData: Uint8Array) => {
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(pdfData) }).promise; // Fresh copy here too
    const maxPages = pdf.numPages;

    const items: string[] = [];

    for (let i = from; i <= maxPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items.map((item: any) => item.str).join(' ');
      items.push(text);
    }

    setOverallTexts(items);
    setText(items.join(''));
  };

  const onFileChange = (e) => {
    // const file = e.target.files[0];

    if (uploadedFile) {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const bufferCopy = arrayBuffer.slice(0); // <-- this creates a clone
        const typedArray = new Uint8Array(bufferCopy);

        setPdfData(typedArray); // This is passed to <Viewer />
        await handleReadPdf(typedArray); // This is passed to pdfjs.getDocument
      };

      reader.readAsArrayBuffer(uploadedFile);
      setOpen(false);
    }
  };

  useEffect(() => {
    const updatedTexts = overallTexts.slice(from - 1).join(' ');
    setText(updatedTexts);
  }, [from]);

  useEffect(() => {
    if (typeof window !== 'undefined' && speech.hasBrowserSupport()) {
      // toast({
      //   variant: 'destructive',
      //   title: 'Uh oh! Something went wrong.',
      //   description: 'Sorry, browser not supported to use this service',
      // });
    }
    speech.init(speechConfig(rate, pitch)).then((data) => {
      setAllVoices(data?.voices);
    });
    const initialPdfs = savedPdfs ? JSON.parse(savedPdfs) : [];
    setInitialPdfs(initialPdfs);
  }, []);

  const handleSpeak = async () => {
    // setLoading(true);
    speech.setRate(rate);
    speech.setPitch(pitch);
    speech.setVolume(volume);
    selectedVoice && speech.setVoice(selectedVoice);
    speech
      .speak({
        text: text,
        queue: false, // current speech will be interrupted,
        listeners: {
          onstart: () => {
            // setLoading(false);
            console.log('Start utterance');
          },
          onend: () => {
            toast({
              title: 'Hurray 😎🎉',
              description: "You've completed this module",
            });
          },
          onresume: () => {
            speech.setRate(rate);
            speech.setPitch(pitch);
            speech.setVolume(volume);
          },
          onboundary: (event) => {
            console.log(event, '-->');
            console.log(event.name + ' boundary reached after ' + event.elapsedTime + ' milliseconds.');
          },
        },
      })
      .then(() => {
        console.log('Success !');
      })
      .catch((e) => {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: "Sorry, can't read view this pdf",
        });
        console.error('An error occurred :', e);
      });
    // setLoading(false);
  };

  const handleChangeNumber = ({ target }) => {
    if (target.value <= to) {
      setFrom(target.value);
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: "You've exceeded the maximum page.",
      });
    }
  };

  const updateSettings = () => {
    toast({
      title: 'Updated successfully 😎',
      description: "You're there now. Enjoy listening to your pdf",
    });
  };

  const handleSavePdf = () => {
    if (uploadedFile && pdfData) {
      try {
        console.log(uploadedFile, '-uploadedFile');

        const file: File = uploadedFile;

        const reader = new FileReader();

        reader.onload = function (event: ProgressEvent<FileReader>) {
          const arrayBuffer: ArrayBuffer = event?.target?.result as ArrayBuffer;
          const uint8Array: Uint8Array = new Uint8Array(arrayBuffer);

          // Convert to Base64
          const binaryString: string = String.fromCharCode(...(uint8Array as any));
          const base64String = btoa(binaryString);

          const pdfInfo = {
            name: uploadedFile.name,
            data: base64String,
            date: new Date().toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour12: true,
            }),
            status: from < totalPdfPage ? 'In progress' : 'Finish',
            userAddress: publicKey,
            id: uuidv4(),
          };
          if (savedPdfs) {
            localStorage.setItem('sonic_reader_pdfs', JSON.stringify([...JSON.parse(savedPdfs), pdfInfo]));
            setInitialPdfs([...initialPdfs, pdfInfo]);
          } else {
            localStorage.setItem('sonic_reader_pdfs', JSON.stringify([pdfInfo]));
            setInitialPdfs([pdfInfo]);
          }
        };

        reader.readAsArrayBuffer(file);

        toast({
          title: 'Success',
          description: 'PDF saved successfully',
        });
      } catch (error) {
        console.log(error, '-> error');

        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to save PDF. File might be too large.',
        });
      }
    }
  };

  const handlePlay = async (each: { data: string; name: string; id: string }) => {
    const binaryString: string = atob(each.data);

    const arrayBuffer: ArrayBuffer = new ArrayBuffer(binaryString.length);
    const uint8Array: Uint8Array = new Uint8Array(arrayBuffer);
    for (let i: number = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    // Create a clone of the ArrayBuffer (as in your example)
    const bufferCopy: ArrayBuffer = arrayBuffer.slice(0);
    const typedArray: Uint8Array = new Uint8Array(bufferCopy);

    // Use the typedArray as in your original code
    setPdfData(typedArray);
    await handleReadPdf(typedArray);
    handleSpeak();
    setCurrentPlaying(each);
  };

  const handleUpload = () => {
    const isPaid = localStorage.getItem('isSubscribed');
    if (!isPaid) {
      toast({
        variant: 'destructive',
        title: 'Subscription Required!',
        description: 'Please subscribe to continue!',
      });
    } else {
      setOpen(true);
    }
  };

  return (
    <main className="flex flex-col md:flex-row overflow-hidden gap-4 md:gap-12 pt-6 h-full">
      <div className="w-full md:w-[30%] bg-[#F7F8F3] px-4 md:pl-12 md:pr-4 py-4 min-h-fit lg:min-h-screen space-y-4 overflow-y-auto">
        <h1 className="font-light mt-4">Recent Documents</h1>

        <div className="space-y-2">
          {initialPdfs.length === 0 && (
            <div className="flex items-center text-sm space-x-1.5">
              <ErrorIcon />
              <p className="font-bold">No recent documents saved</p>
            </div>
          )}
          {initialPdfs.map((each) => (
            <div className="border rounded-lg p-4 flex justify-between bg-white hover:bg-none" key={each.title}>
              <div className="flex space-x-2 items-start">
                <FileText size={18} className="mt-1" />
                <div>
                  <p className="text-sm font-bold capitalize truncate">{each.name}</p>
                  <p className="text-xs text-slate-700 font-light">{each.date}</p>
                  <p className="text-xs font-light mt-1.5">Mint NFT</p>
                </div>
              </div>
              <Button className="rounded-full h-8 px-2" size="sm" onClick={() => handlePlay(each)}>
                <div className="flex space-x-1 items-center">
                  {each.id === currentPlaying?.id ? <Pause size={12} /> : <Play size={12} />}
                  <p className="text-xs">{each.id === currentPlaying?.id ? 'Pause' : 'Play'}</p>
                </div>
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full md:w-[70%] px-4 md:pr-8 py-8 space-y-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-0">
          <div className="font-light space-y-1">
            {publicKey && (
              <h1 className="text-sm">
                Hello <span className="font-medium">{publicKey?.toString()}</span>,
              </h1>
            )}
            <p>Upload PDFs and convert them to audio:</p>
          </div>
          <div className="flex space-x-4">
            {pdfData && (
              <Button variant="outline" className="rounded-full" onClick={handleSavePdf}>
                Save File
              </Button>
            )}

            <Button className="rounded-full" onClick={handleUpload}>
              <div className="flex space-x-2">
                <FilePlus2 size={16} />
                <p className="text-sm">Upload new pdf</p>
              </div>
            </Button>
          </div>
        </div>

        <div className="border rounded-lg h-full lg:h-[75vh]">
          {!pdfData && (
            <div className="flex items-center justify-center w-full h-full">
              <div className="text-center space-y-1">
                <FileAudio className="h-16 w-16 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground text-center">No file selected</p>
                <Button className="rounded-full" onClick={handleUpload}>
                  <div className="flex space-x-2">
                    <FilePlus2 size={16} />
                    <p className="text-sm">Upload new pdf</p>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {pdfData && (
            <div className="w-full lg:flex gap-4 px-4 lg:gap-8 lg:px-10">
              <div className="w-full lg:w-[40%]">
                {pdfData && (
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <div className="h-full lg:h-[350px] w-full py-4 relative">
                      <Viewer
                        fileUrl={pdfData}
                        onDocumentLoad={(e: any) => {
                          setTo(e.doc._pdfInfo.numPages);
                          setTotalPdfPage(e.doc._pdfInfo.numPages);
                        }}
                      />
                    </div>
                  </Worker>
                )}

                <div className="border rounded-md px-4 py-2 my-4 ">
                  <p className="text-sm text-left font-semibold md:text-normal">What pages do you want to listen to today?</p>
                  <div className="flex items-center py-2 justify-between">
                    <div className="text-left w-[20%]">
                      <Label className="text-sm">From</Label>
                      <Input
                        type="number"
                        placeholder="From"
                        value={from}
                        className="text-sm"
                        readOnly={totalPdfPage === from}
                        min="1"
                        onChange={handleChangeNumber}
                      />
                    </div>
                    <p className="mt-2">-</p>
                    <div className="text-left w-[20%]">
                      <Label className="text-sm">To</Label>
                      <Input
                        type="number"
                        placeholder="To"
                        readOnly={totalPdfPage === to}
                        value={to}
                        min="1"
                        className="text-sm"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTo(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center w-full lg:w-[60%]">
                {pdfData && (
                  <div className="w-full mt-4">
                    <div className="flex w-full justify-between border rounded-md p-4">
                      <div className="text-left w-[28%]">
                        <Label className="my-2 font-medium">Rate: {rate}</Label>
                        <Slider className="mt-2" max={2} step={0.1} defaultValue={[rate]} onValueChange={(value: any) => setRate(value.toString())} />
                      </div>
                      <div className="text-left w-[28%]">
                        <Label className="my-2 font-medium">Pitch: {pitch}</Label>
                        <Slider className="mt-2" max={2} step={0.1} defaultValue={[pitch]} onValueChange={(value: any) => setPitch(value.toString())} />
                      </div>
                      <div className="text-left w-[22%]">
                        <Label className="my-2 font-medium">Volume: {volume}</Label>
                        <Slider className="mt-2" max={1} step={0.1} defaultValue={[volume]} onValueChange={(value: any) => setVolume(value.toString())} />
                      </div>
                    </div>

                    <div className="border rounded-md px-4 py-2 my-4">
                      <SelectComp className="py-4" placeholder="Select your voice" data={allVoices} onValueChange={(value: any) => setSelectedVoice(value)} />
                    </div>
                    <Button onClick={updateSettings} disabled={!pdfData} className="w-full" variant="outline">
                      Update Settings
                    </Button>
                  </div>
                )}

                <div className="gap-4 my-4 grid grid-cols-2 md:grid-cols-2">
                  <Button onClick={handleSpeak} disabled={!pdfData} loading={loading} loadingText="Please wait...">
                    Start listening
                  </Button>
                  <Button onClick={() => speech.pause()} disabled={!pdfData}>
                    Pause
                  </Button>
                  <Button onClick={() => speech.resume()} disabled={!pdfData}>
                    Resume
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button disabled={!pdfData}>Reset</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. This will cancel your listening.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            speech.cancel();
                            setFrom(1);
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload PDF</DialogTitle>
            <DialogDescription>Upload valid PDFs only. Maximum file size: 10MB</DialogDescription>
          </DialogHeader>

          <FileUpload setOpen={setOpen} onFileChange={onFileChange} setUploadedFile={setUploadedFile} uploadedFile={uploadedFile} />
        </DialogContent>
      </Dialog>
    </main>
  );
}
