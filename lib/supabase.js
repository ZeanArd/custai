import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getBusinessByApiKey(apiKey) {
  const { data, error } = await supabase
    .from('business')
    .select('*')
    .eq('api_key', apiKey)
    .single();

  if (error) throw error;
  return data;
}

export async function saveChatHistory(businessId, userMessage, aiResponse) {
  const { data, error } = await supabase
    .from('chat_history')
    .insert([
      {
        business_id: businessId,
        user_message: userMessage,
        ai_response: aiResponse,
        timestamp: new Date().toISOString()
      }
    ]);

  if (error) throw error;
  return data;
}
