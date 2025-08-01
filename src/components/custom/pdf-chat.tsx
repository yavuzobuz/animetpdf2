"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, User, Bot, Loader2 } from 'lucide-react';
import { saveChatMessage, getChatHistory, ChatMessage } from '@/lib/database';

interface PdfChatProps {
  pdfSummary: string;
  chatWithPdfFlow: (input: { prompt: string; pdfContent: string; narrativeStyle?: string }) => Promise<{ success: boolean; response?: string; error?: string }>;
  projectId?: string | undefined;
  narrativeStyle?: string;
}

export function PdfChat({ pdfSummary, chatWithPdfFlow, projectId, narrativeStyle = 'Varsayılan' }: PdfChatProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  // Load chat history on component mount
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!projectId) {
        setLoadingHistory(false);
        return;
      }

      setLoadingHistory(true);
      try {
        const history = await getChatHistory(projectId);
        if (history && history.length > 0) {
          setMessages(history.map(msg => ({
            role: msg.role,
            content: msg.content
          })));
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to state
    const newUserMessage = { role: 'user' as const, content: userMessage };
    setMessages(prev => [...prev, newUserMessage]);
    
    // Save user message to database (only if projectId exists)
    if (projectId) {
      const saved = await saveChatMessage(projectId, 'user', userMessage);
      if (!saved) {
        console.warn('Failed to save user message to database');
      }
    }
    
    setLoading(true);

    try {
      const result = await chatWithPdfFlow({
        prompt: userMessage,
        pdfContent: pdfSummary,
        narrativeStyle: narrativeStyle
      });
      
      // Add assistant message to state
      const assistantMessage = { role: 'assistant' as const, content: result.response || 'Özür dilerim, bir hata oluştu.' };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Save assistant response to database (only if projectId exists)
      if (projectId && result.response) {
        const saved = await saveChatMessage(projectId, 'assistant', result.response);
        if (!saved) {
          console.warn('Failed to save assistant response to database');
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        role: 'assistant' as const, 
        content: 'Özür dilerim, bir hata oluştu. Lütfen tekrar deneyin.' 
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Save error message to database (only if projectId exists)
      if (projectId) {
        const saved = await saveChatMessage(projectId, 'assistant', errorMessage.content);
        if (!saved) {
          console.warn('Failed to save error message to database');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-white border-2 border-gray-100 shadow-xl hover:shadow-xl transition-all duration-500 group">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b border-gray-100 p-6">
          <CardTitle className="flex items-center gap-4 text-gray-900 text-xl font-bold">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            PDF İçeriği ile Sohbet
            <div className="flex-1 h-1 bg-gradient-to-r from-orange-200 to-red-200 rounded-full ml-4"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96 p-6 text-base" ref={scrollAreaRef}>
            {loadingHistory ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                  <span className="text-base text-gray-600 font-medium">Sohbet geçmişi yükleniyor...</span>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8 space-y-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="font-bold text-gray-900 text-xl">PDF ile Sohbete Başlayın!</h3>
                  <p className="text-base text-gray-600 max-w-md leading-relaxed">
                    PDF içeriği hakkında sorular sorun, detayları öğrenin veya konuyu daha iyi anlayın.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                    <span className="font-medium">"Bu konuyu daha basit açıklar mısın?"</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                    <span className="font-medium">"Örnekler verebilir misin?"</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 bg-gray-500 rounded-full flex-shrink-0"></div>
                    <span className="font-medium">"Bu konu hangi alanlarda kullanılır?"</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-4 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-br from-orange-500 to-red-500' 
                          : 'bg-gradient-to-br from-gray-600 to-gray-700'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="h-5 w-5 text-white" />
                        ) : (
                          <Bot className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div className={`p-4 sm:p-5 rounded-2xl shadow-lg ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
                          : 'bg-white text-gray-800 border-2 border-gray-100'
                      }`}>
                        <p className="text-base leading-relaxed whitespace-pre-wrap font-medium">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-4 justify-start">
                    <div className="flex gap-4 max-w-[85%]">
                      <div className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-700 shadow-lg">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-gray-100 shadow-lg">
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-5 w-5 animate-spin text-orange-600" />
                          <span className="text-base text-gray-600 font-medium">Düşünüyor...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          <div className="p-6 border-t-2 border-gray-100 bg-gradient-to-r from-orange-50/50 to-white">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="PDF hakkında soru sorun..."
                disabled={loading}
                className="flex-1 bg-white border-2 border-gray-200 focus:border-orange-400 focus:ring-orange-200 text-base h-12 px-4 rounded-xl font-medium placeholder:text-gray-500"
              />
              <Button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-none shadow-lg h-12 px-6 rounded-xl font-semibold"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}