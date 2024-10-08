import { useState } from "react";

const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const speakText = (text: string): void => {
    if (text.trim() !== "") {
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = text;
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
      };

      // Split text into smaller chunks if it's too long
      const chunks = text.match(/.{1,200}/g); // Split into chunks of 200 characters
      let index = 0;

      const speakNextChunk = () => {
        if (chunks && index < chunks.length) { // Check if chunks is not null
          utterance.text = chunks[index++];
          window.speechSynthesis.speak(utterance);
        }
      };

      // Speak the next chunk when the current one ends
      utterance.onend = () => {
        speakNextChunk();
      };

      speakNextChunk(); // Start speaking the first chunk
    }
  };

  const stopSpeech = (): void => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return { isSpeaking, speakText, stopSpeech };
};

export default useTextToSpeech;
