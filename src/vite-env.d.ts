/// <reference types="vite/client" />
interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

// Import the correct types for SpeechRecognition
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}
