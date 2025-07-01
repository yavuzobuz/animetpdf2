import { createClient } from '@supabase/supabase-js';

const handler = async (req: Request): Promise<Response> => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID parameter is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(JSON.stringify({ error: 'Missing Supabase configuration' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization') || '' },
      },
    });

    // İlk olarak mevcut created_animations değerini al
    const { data: currentData, error: fetchError } = await supabase
      .from('statistics')
      .select('created_animations')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return new Response(JSON.stringify({ error: fetchError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const currentCount = currentData?.created_animations || 0;

    // Değeri güncelle
    const { data, error } = await supabase
      .from('statistics')
      .update({ created_animations: currentCount + 1 })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Update error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export default handler;
