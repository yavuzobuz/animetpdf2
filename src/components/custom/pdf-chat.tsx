"use client";

import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, MessageSquare, Send, User, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ChatWithPdfInput, ChatWithPdfOutput } from '@/ai/flows/chat-with-pdf-flow';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

interface PdfChatProps {
  pdfSummary: string | null;
  chatWithPdfFlow: (input: ChatWithPdfInput) => Promise<ChatWithPdfOutput>;
}

export function PdfChat({ pdfSummary, chatWithPdfFlow }: PdfChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim() || !pdfSummary) return;

    const newUserMessage: ChatMessage = { sender: 'user', text: userInput.trim() };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await chatWithPdfFlow({
        pdfSummary: pdfSummary,
        userQuery: newUserMessage.text,
      });
      const botMessage: ChatMessage = { sender: 'bot', text: response.botResponse };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      toast({
        title: "Sohbet Hatası",
        description: (error as Error).message || "Bot ile iletişim kurulamadı.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!pdfSummary) {
    return null;
  }

  return (
    <Card className="w-full shadow-lg hover:ring-2 hover:ring-primary/70 hover:ring-offset-2 hover:ring-offset-background transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center">
          <MessageSquare className="mr-2 h-6 w-6 text-primary" /> PDF ile Sohbet Et
        </CardTitle>
        <CardDescription>
          Yüklediğiniz PDF'in özeti hakkında sorular sorun. Bot yalnızca özetteki bilgilere göre cevap verecektir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full rounded-md border p-3 bg-muted/20" ref={scrollAreaRef}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Bot size={48} className="mb-2 opacity-50" />
              <p>PDF özeti hakkında soru sormaya başlayın.</p>
            </div>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 my-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="flex-shrink-0 p-2 bg-primary text-primary-foreground rounded-full shadow">
                  <Bot size={18} />
                </div>
              )}
              <div
                className={`max-w-[75%] p-3 rounded-lg shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-accent text-accent-foreground rounded-br-none'
                    : 'bg-card text-card-foreground rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
              {msg.sender === 'user' && (
                <div className="flex-shrink-0 p-2 bg-secondary text-secondary-foreground rounded-full shadow">
                   <User size={18} />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start gap-3 my-3">
                <div className="flex-shrink-0 p-2 bg-primary text-primary-foreground rounded-full shadow">
                  <Bot size={18} />
                </div>
                <div className="max-w-[75%] p-3 rounded-lg shadow-md bg-card text-card-foreground rounded-bl-none">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
            </div>
          )}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
          <Input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Sorunuzu buraya yazın..."
            className="flex-grow shadow-sm focus:ring-primary focus:border-primary"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !userInput.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow hover:shadow-md">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Gönder</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
