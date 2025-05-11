import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

interface ISelectComp {
  placeholder: string;
  data: { name: string; lang: string }[];
  onValueChange: (value: string) => void;
  className?: string;
}

const SelectComp: React.FC<ISelectComp> = ({ placeholder, data, onValueChange, className }) => {
  return (
    <div className={cn('text-left w-[100%]', className)}>
      <Label className="font-medium">Select voice: (optional)</Label>
      <Select onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-[40vh] rounded-md border-none">
            <SelectGroup>
              <SelectLabel>Voices</SelectLabel>
              {data.map((voice) => (
                <SelectItem value={voice.name} key={voice.name}>
                  {`${voice.name.slice(0, 20)} (${voice.lang})`}
                </SelectItem>
              ))}
            </SelectGroup>
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectComp;
