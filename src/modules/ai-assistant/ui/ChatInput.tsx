import { useRef, useEffect, useState } from "react";
import { Send, Paperclip, Mic, X } from "lucide-react";
import type { ChatInputProps } from "@/app/types/ai-assistant/ai-assistant.interfaces";

export function ChatInput({ message, setMessage, onSend }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);

  // 🔹 Автоматическая высота textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, window.innerHeight * 0.4);
    textarea.style.height = `${newHeight}px`;
  }, [message]);

  // 🔹 Добавление файлов
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;
    setFiles((prev) => [...prev, ...Array.from(selected)]);
    e.target.value = "";
  };

  // 🔹 Отправка сообщения
  const handleSend = () => {
    if (!message.trim() && files.length === 0) return;
    onSend();
    setMessage("");
    setFiles([]);
    if (textareaRef.current) textareaRef.current.style.height = "40px";
  };

  // 🔹 Голосовая кнопка (заглушка)
  const handleVoiceInput = () => {
    setIsRecording((prev) => !prev);
    console.log("🎙 Voice recording:", !isRecording);
  };

  const isDisabled = !message.trim() && files.length === 0;

  return (
    <div className="px-4 pt-4 bg-white relative z-10">
      {/* 🔸 Превью прикреплённых файлов */}
      {files.length > 0 && (
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

      {/* 🔸 Контейнер ввода */}
      <div className="relative flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-purple-400 transition-all duration-200 shadow-md">
        <textarea
          ref={textareaRef}
          placeholder="Введите сообщение..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="chat-textarea flex-1 bg-transparent pl-4 pr-28 py-3 outline-none resize-none min-h-[40px] max-h-[45vh] overflow-y-auto text-sm leading-relaxed transition-all"
          rows={1}
        />

        {/* 🔹 Кнопки действий */}
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
