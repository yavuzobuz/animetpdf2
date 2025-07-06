import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

interface TicketReplyDialogProps {
  ticketId: string;
  ticketSubject: string;
  userEmail: string;
  onSuccess?: () => void;
}

export function TicketReplyDialog({ ticketId, ticketSubject, userEmail, onSuccess }: TicketReplyDialogProps) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(`Re: ${ticketSubject}`);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Lütfen bir mesaj girin',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/tickets/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          subject,
          message,
          adminId: 'admin' // İleride admin ID'si eklenebilir
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Başarılı',
          description: 'Yanıt başarıyla gönderildi',
        });
        setOpen(false);
        setMessage('');
        if (onSuccess) onSuccess();
      } else if (response.status === 207) {
        // Kısmi başarı - yanıt kaydedildi ama e-posta gönderilemedi
        toast({
          variant: 'warning',
          title: 'Uyarı',
          description: data.warning || 'Yanıt kaydedildi ancak e-posta gönderilemedi',
        });
        setOpen(false);
        setMessage('');
        if (onSuccess) onSuccess();
      } else {
        toast({
          variant: 'destructive',
          title: 'Hata',
          description: data.error || 'Yanıt gönderilemedi',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Bir hata oluştu',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-1">
          <Mail className="h-4 w-4" />
          <span>Yanıtla</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Destek Talebini Yanıtla</DialogTitle>
          <DialogDescription>
            <span className="font-medium">{userEmail}</span> adresine yanıt gönder
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Konu</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Konu"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Mesaj</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mesajınızı buraya yazın..."
              rows={6}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Gönderiliyor...' : 'Gönder'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}