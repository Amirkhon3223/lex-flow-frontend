import { useRef, useEffect, useState } from "react";
import { Send, Paperclip, Mic, X } from "lucide-react";
import { toast } from "sonner";
import type { ChatInputProps, SpeechRecognitionInstance } from "@/app/types/ai-assistant/ai-assistant.interfaces";
import {
  createSpeechRecognition,
  setupSpeechRecognitionCallbacks,
  startSpeechRecognition,
  stopSpeechRecognition,
  cleanupSpeechRecognition,
  isSpeechRecognitionSupported,
} from "@/app/utils/speechRecognition";

export function ChatInput({ message, setMessage, onSend }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const baseMessageRef = useRef<string>(''); // Базовый текст до начала записи
  const [interimText, setInterimText] = useState<string>(''); // Промежуточный текст (серый)

  // 🔹 Автоматическая высота textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, window.innerHeight * 0.4);
    textarea.style.height = `${newHeight}px`;
  }, [message]);

  // 🔹 Инициализация распознавания речи
  useEffect(() => {
    recognitionRef.current = createSpeechRecognition({
      lang: 'ru-RU',
      continuous: true,
      interimResults: true,
    });

    if (recognitionRef.current) {
      setupSpeechRecognitionCallbacks(recognitionRef.current, {
        onResult: (transcript: string, isFinal: boolean) => {
          if (isFinal) {
            // Финальный текст - добавляем к базовому
            const finalText = baseMessageRef.current + (baseMessageRef.current ? ' ' : '') + transcript.trim();
            setMessage(finalText);
            baseMessageRef.current = finalText; // Обновляем базу
            setInterimText(''); // Очищаем промежуточный
          } else {
            // Промежуточный текст - показываем серым
            setInterimText(transcript.trim());
          }
        },
        onError: (error: string) => {
          console.error('Ошибка распознавания речи:', error);
          setIsRecording(false);
          setInterimText('');
        },
        onEnd: () => {
          setIsRecording(false);
          setInterimText('');
        },
      });
    }

    return () => {
      cleanupSpeechRecognition(recognitionRef.current);
    };
  }, [setMessage]);

  // 🔹 Добавление файлов
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;
    setFiles((prev) => [...prev, ...Array.from(selected)]);
    e.target.value = "";
  };

  // 🔹 Отправка сообщения
  const handleSend = () => {
    if (!message.trim() && !files.length) return;
    onSend();
    setMessage("");
    setFiles([]);
    if (textareaRef.current) textareaRef.current.style.height = "40px";
  };

  // 🔹 Управление голосовым вводом
  const handleVoiceInput = () => {
    if (!isSpeechRecognitionSupported()) {
      toast.error('Распознавание речи недоступно', {
        description: 'Ваш браузер не поддерживает эту функцию. Используйте Chrome или Edge.',
      });
      return;
    }

    if (isRecording) {
      stopSpeechRecognition(recognitionRef.current);
      setIsRecording(false);
      setInterimText('');
    } else {
      // Сохраняем текущий текст как базовый
      baseMessageRef.current = message;
      setInterimText('');
      const started = startSpeechRecognition(recognitionRef.current);
      if (started) {
        setIsRecording(true);
      }
    }
  };

  const isDisabled = !message.trim() && !files.length;

  return (
    <div className="px-4 pt-4 bg-white relative z-10">
      {!!files.length && (
        <div className="mb-2 flex flex-wrap gap-2 animate-fadeIn">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-xs shadow-sm"
            >
              <Paperclip className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700 truncate max-w-[150px]">
                {file.name}
              </span>
              <button
                onClick={() =>
                  setFiles((prev) => prev.filter((_, i) => i !== index))
                }
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-purple-400 transition-all duration-200 shadow-md">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            placeholder={interimText ? "" : "Введите сообщение..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="chat-textarea w-full bg-transparent pl-4 pr-28 py-3 outline-none resize-none min-h-[40px] max-h-[45vh] overflow-y-auto text-sm leading-relaxed transition-all"
            rows={1}
          />
          {interimText && (
            <div className="absolute inset-0 pl-4 pr-28 py-3 pointer-events-none text-sm leading-relaxed overflow-hidden">
              <span className="invisible">{message}</span>
              <span className="text-gray-400">{message ? ' ' : ''}{interimText}</span>
            </div>
          )}
        </div>

        <div className="absolute right-2 bottom-1.5 flex items-center gap-1">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
          />

          {/* 📎 Прикрепить файл */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            type="button"
          >
            <Paperclip className="w-5 h-5 text-gray-500" />
          </button>

          {/* 🎙 Микрофон */}
          <button
            onClick={handleVoiceInput}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isRecording ? "bg-red-100 hover:bg-red-200" : "hover:bg-gray-200"
            }`}
            type="button"
          >
            <Mic
              className={`w-5 h-5 ${
                isRecording ? "text-red-500" : "text-gray-500"
              }`}
            />
          </button>

          {/* 🚀 Отправить */}
          <button
            onClick={handleSend}
            disabled={isDisabled}
            className={`p-2 rounded-lg transition-all ${
              isDisabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md shadow-purple-500/30 cursor-pointer"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
