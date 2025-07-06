"use client";

import { HelpCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SupportTicketButtonProps {
  /** If true, renders inline; otherwise fixed to bottom-right */
  inline?: boolean;
}

export default function SupportTicketButton({ inline = false }: SupportTicketButtonProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const t = {
    support: language === 'en' ? 'Support' : 'Destek',
    email: language === 'en' ? 'Email' : 'E-posta',
    subject: language === 'en' ? 'Subject' : 'Konu',
    message: language === 'en' ? 'Message' : 'Mesaj',
    send: language === 'en' ? 'Send' : 'Gönder',
    success: language === 'en' ? 'Your request has been sent.' : 'Talebiniz gönderildi.',
    error: language === 'en' ? 'An error occurred. Try again.' : 'Bir hata oluştu. Tekrar deneyin.',
  };

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: user?.email || '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.email || !form.subject || !form.message) return;
    try {
      setLoading(true);
      const res = await fetch('/api/support-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast({ title: t.success });
        setForm({ email: user?.email || '', subject: '', message: '' });
        setOpen(false);
      } else {
        toast({ title: t.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: t.error, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={`${inline ? '' : 'fixed bottom-6 right-6 z-50'} bg-orange-500 hover:bg-orange-600 text-white shadow-lg group`.trim()}
        >
          <HelpCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
          {t.support}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.support}</DialogTitle>
          <DialogDescription>
            {language === 'en'
              ? 'We usually reply within 24 hours.'
              : 'Genellikle 24 saat içinde yanıtlarız.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            name="email"
            placeholder={t.email}
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
          <Input
            name="subject"
            placeholder={t.subject}
            value={form.subject}
            onChange={handleChange}
            disabled={loading}
          />
          <Textarea
            name="message"
            placeholder={t.message}
            rows={4}
            value={form.message}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit} disabled={loading || !form.subject || !form.message}>
            {loading ? (
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {t.send}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 