'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

interface TicketReplyDialogProps {
  ticketId: string;
  ticketSubject: string;
  userEmail: string;
  onSuccess: () => void;
}

export function TicketReplyDialog({ ticketId, ticketSubject, userEmail, onSuccess }: TicketReplyDialogProps) {
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendReply = async () => {
    if (!reply.trim()) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Lütfen bir yanıt yazın.',
      });
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/admin/tickets/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          reply,
          userEmail,
          subject: `Re: ${ticketSubject}`,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: 'Başarılı',
          description: 'Yanıt gönderildi.',
        });
        setReply('');
        setOpen(false);
        onSuccess();
      } else {
        toast({
          variant: 'destructive',
          title: 'Hata',
          description: data.error || 'Yanıt gönderilemedi.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Beklenmeyen bir hata oluştu.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Mail className="h-4 w-4 mr-1" />
          Yanıtla
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Destek Talebine Yanıt</DialogTitle>
          <DialogDescription>
            <strong>Konu:</strong> {ticketSubject}<br />
            <strong>Kullanıcı:</strong> {userEmail}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reply">Yanıtınız</Label>
            <Textarea
              id="reply"
              placeholder="Kullanıcıya gönderilecek yanıtı yazın..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={6}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={sending}
          >
            İptal
          </Button>
          <Button 
            type="button" 
            onClick={handleSendReply}
            disabled={sending}
          >
            {sending ? 'Gönderiliyor...' : 'Yanıt Gönder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 