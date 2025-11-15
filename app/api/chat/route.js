import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getBusinessByApiKey, saveChatHistory } from '../../../lib/supabase.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function buat clean markdown formatting
function cleanMarkdownFormatting(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
  .trim();
}
export async function POST(request) {
  try {
    const { apiKey, message, history = [] } = await request.json();

    // Validate input
    if (!apiKey || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing apiKey or message' },
        { status: 400 }
      );
    }

    // Get business data from Supabase
    let business;
    try {
      business = await getBusinessByApiKey(apiKey);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Prepare context from business data
    const contextData = business.context_data || {};
    const systemPrompt = `Kamu adalah CS (Customer Service) AI yang ramah dan membantu untuk ${business.business_name}.

Informasi Bisnis:
${contextData.description || 'Tidak ada deskripsi'}

${contextData.menu ? `Menu/Produk:\n${contextData.menu}` : ''}
${contextData.hours ? `Jam Operasional:\n${contextData.hours}` : ''}
${contextData.location ? `Lokasi:\n${contextData.location}` : ''}
${contextData.contact ? `Kontak:\n${contextData.contact}` : ''}
${contextData.faq ? `FAQ:\n${contextData.faq}` : ''}

Instruksi:
1. Jawab dengan ramah, santai, dan helpful (pake bahasa Indonesia casual tapi sopan)
2. Jika customer tanya sesuatu yang ga ada di info di atas, bilang dengan jujur kamu ga tau dan minta mereka hubungi langsung pemilik bisnis
3. Jangan buat-buat informasi yang ga ada
4. Fokus bantu customer dengan pertanyaan mereka
5. Kalau customer tanya harga/menu/jam buka, kasih info yang akurat dari data di atas
6. Gunakan emoji sesekali biar lebih friendly 😊

Sekarang jawab pertanyaan customer dengan baik!`;

    // Build conversation history for Gemini
    const geminiHistory = history.slice(-6).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Call Gemini API
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt
    });

    const chat = model.startChat({
      history: geminiHistory,
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(message);
    let response = result.response.text();

    //clean mark
    response = cleanMarkdownFormatting(response);

    // Save to chat history
    try {
      await saveChatHistory(business.id, message, response);
    } catch (error) {
      console.error('Failed to save chat history:', error);
      // Continue even if saving fails
    }

    return NextResponse.json({
      success: true,
      response: response
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// CORS headers for widget
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
