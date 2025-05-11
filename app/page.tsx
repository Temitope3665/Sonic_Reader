'use client';

import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import * as pdfjs from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Speech from 'speak-tts';
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

export default function Home() {
  const [totalPdfPage, setTotalPdfPage] = useState(0);
  const [allVoices, setAllVoices] = useState([]);
  const [rate, setRate] = useState(0.7);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [pdfData, setPdfData] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(undefined);
  const [text, setText] = useState('');
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(0);
  const [overallTexts, setOverallTexts] = useState([]);
  const speech = typeof window !== 'undefined' && new Speech();
  const [loading, setLoading] = useState(false);

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
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const bufferCopy = arrayBuffer.slice(0); // <-- this creates a clone
        const typedArray = new Uint8Array(bufferCopy);

        setPdfData(typedArray); // This is passed to <Viewer />
        await handleReadPdf(typedArray); // This is passed to pdfjs.getDocument
      };

      reader.readAsArrayBuffer(file);
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
            // toast({
            //   title: 'Hurray 😎🎉',
            //   description: "You've completed this module",
            // });
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
        // toast({
        //   variant: 'destructive',
        //   title: 'Uh oh! Something went wrong.',
        //   description: "Sorry, can't read view this pdf",
        // });
        console.error('An error occurred :', e);
      });
    // setLoading(false);
  };

  const handleChangeNumber = ({ target }) => {
    if (target.value <= to) {
      setFrom(target.value);
    } else {
      // toast({
      //   variant: 'destructive',
      //   title: 'Uh oh! Something went wrong.',
      //   description: "You've exceeded the maximum page.",
      // });
    }
  };

  const updateSettings = () => {
    // toast({
    //   title: 'Updated successfully 😎',
    //   description: "You're there now. Enjoy listening to your pdf",
    // });
  };

  return (
    <main className="flex flex-col items-center justify-center overflow-hidden px-12">
      <div className="text-center">
        <h1 className="py-7 font-medium text-lg">Convert PDFs to Speech</h1>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="pdf" className="py-4">
            Upload valid pdfs only
          </Label>
          <Input id="pdf" type="file" onChange={onFileChange} accept="application/pdf" />
        </div>

        {pdfData && (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <div className="h-[350px] w-full py-4 relative">
              <Viewer
                fileUrl={pdfData}
                onDocumentLoad={(e) => {
                  setTo(e.doc._pdfInfo.numPages);
                  setTotalPdfPage(e.doc._pdfInfo.numPages);
                }}
              />
            </div>
          </Worker>
        )}

        {pdfData && (
          <div className="w-full">
            <div className="border rounded-md px-4 py-2 my-4">
              <p className="text-sm text-left font-semibold md:text-normal">What pages do you want to listen to today?</p>
              <div className="flex items-center py-2 justify-between">
                <div className="text-left w-[15%]">
                  <Label className="text-sm">From</Label>
                  <Input
                    type="number"
                    placeholder="From"
                    value={from}
                    className="text-base"
                    readOnly={totalPdfPage === from}
                    min="1"
                    onChange={handleChangeNumber}
                  />
                </div>
                <p className="mt-2">-</p>
                <div className="text-left w-[15%]">
                  <Label className="text-sm">To</Label>
                  <Input
                    type="number"
                    placeholder="To"
                    readOnly={totalPdfPage === to}
                    value={to}
                    min="1"
                    className="text-base"
                    onChange={({ target }) => setTo(target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex w-full justify-between border rounded-md p-4 my-4">
              <div className="text-left w-[28%]">
                <Label className="my-2 font-medium">Rate: {rate}</Label>
                <Slider className="mt-2" max={2} step={0.1} defaultValue={[rate]} onValueChange={(value) => setRate(value.toString())} />
              </div>
              <div className="text-left w-[28%]">
                <Label className="my-2 font-medium">Pitch: {pitch}</Label>
                <Slider className="mt-2" max={2} step={0.1} defaultValue={[pitch]} onValueChange={(value) => setPitch(value.toString())} />
              </div>
              <div className="text-left w-[22%]">
                <Label className="my-2 font-medium">Volume: {volume}</Label>
                <Slider className="mt-2" max={1} step={0.1} defaultValue={[volume]} onValueChange={(value) => setVolume(value.toString())} />
              </div>
            </div>

            <div className="border rounded-md px-4 py-2 my-4">
              <SelectComp className="py-4" placeholder="Select your voice" data={allVoices} onValueChange={(value) => setSelectedVoice(value)} />
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
    </main>
  );
}
