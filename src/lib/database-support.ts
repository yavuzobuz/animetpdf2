import { createAdminClient } from './supabase';

// Destek talebine yanıt ekle
export async function addSupportTicketReply({
  ticketId,
  reply,
  adminId
}: {
  ticketId: string;
  reply: string;
  adminId: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient();
    
    // Yanıtı ekle
    const { error } = await supabase.from('support_ticket_replies').insert({
      ticket_id: ticketId,
      admin_id: adminId,
      reply_text: reply,
      created_at: new Date().toISOString()
    });

    if (error) {
      console.error('Support ticket reply error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Support ticket reply exception:', error);
    return { success: false, error: 'Bilinmeyen hata oluştu' };
  }
}

// Destek talebi detaylarını getir
export async function getSupportTicketDetails(ticketId: string): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const supabase = createAdminClient();
    
    // Talebi getir
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId)
      .single();

    if (ticketError) {
      return { success: false, error: ticketError.message };
    }

    // Yanıtları getir
    const { data: replies, error: repliesError } = await supabase
      .from('support_ticket_replies')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (repliesError) {
      return { success: false, error: repliesError.message };
    }

    return { 
      success: true, 
      data: {
        ticket,
        replies: replies || []
      }
    };
  } catch (error) {
    console.error('Support ticket details exception:', error);
    return { success: false, error: 'Bilinmeyen hata oluştu' };
  }
}