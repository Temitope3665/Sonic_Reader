// Type definition for the speechConfig parameters
export interface SpeechConfigParams {
  rate: number | string;
  pitch: number | string;
}

// Type for the returned speech configuration object
export interface SpeechConfig {
  volume: number;
  lang: string;
  rate: number;
  pitch: number;
  listeners: {
    onvoiceschanged: (voices: unknown) => void;
  };
}

export interface PDFData {
  data: Uint8Array | string; // depends on how pdfData is passed (can be URL, base64, or Uint8Array)
}

export interface PDFItem {
  str: string;
}

export interface TextContentItem {
  items: PDFItem[];
}

export interface IAppContext {
  balance: number;
}

export interface AppProviderProps {
  children: ReactNode;
}
