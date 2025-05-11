import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const speechConfig = (rate, pitch) => ({
  volume: 1,
  lang: 'en-GB',
  rate: Number(rate),
  pitch: Number(pitch),
  //  'voice': voice || undefined,
  //  'splitSentences': true,
  listeners: {
    onvoiceschanged: (voices) => {
      console.log('Event voiceschanged', voices);
    },
  },
});
