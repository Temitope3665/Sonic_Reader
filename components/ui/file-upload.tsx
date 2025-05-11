import { FilePlus2 } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { useToast } from '@/hooks/use-toast';

export default function FileUpload({ setOpen, onFileChange, setUploadedFile, uploadedFile }) {
  const { toast } = useToast();
  return (
    <div>
      <div className="grid w-full items-center gap-1.5">
        <label
          htmlFor="pdf"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FilePlus2 className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
          </div>
          <Input
            id="pdf"
            type="file"
            className="hidden"
            onChange={(e: any) => {
              const file = e.target.files[0];
              if (file && file.size > 10 * 1024 * 1024) {
                toast({
                  variant: 'destructive',
                  title: 'File too large',
                  description: 'Please upload a file smaller than 10MB',
                });
                return;
              }
              setUploadedFile(file);
            }}
            accept="application/pdf"
          />
        </label>
        <div className="py-4">{uploadedFile && <p className="text-sm text-gray-500 mt-2">File name: {uploadedFile.name}</p>}</div>
      </div>

      <div className="flex space-x-2">
        <Button className="" onClick={() => setOpen(false)} variant="outline">
          Cancel
        </Button>
        <Button onClick={onFileChange} className="w-full">
          Continue
        </Button>
      </div>
    </div>
  );
}
