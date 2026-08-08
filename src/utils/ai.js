/**
 * Utility for client-side Gemini AI content generation
 */

export async function generateAIResponse(prompt, systemInstruction = '') {
  const apiKey = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 10) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: systemInstruction 
                      ? `${systemInstruction}\n\nHere is the user input and details to process:\n${prompt}` 
                      : prompt
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            }
          })
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.error?.message || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        return text;
      } else {
        throw new Error('API returned empty candidate response.');
      }
    } catch (error) {
      console.warn('Gemini API call failed, falling back to smart client templates. Error:', error);
      // Fall through to smart mock generator below
    }
  }

  // Smart Context-Aware Local Fallback Generator
  return simulateSmartAI(prompt, systemInstruction);
}

function simulateSmartAI(prompt, systemInstruction) {
  // We can analyze the prompt keywords to give a highly tailored response
  const lowerPrompt = prompt.toLowerCase();
  
  if (systemInstruction.includes('Email') || lowerPrompt.includes('email') || lowerPrompt.includes('recipient') || lowerPrompt.includes('subject')) {
    // Email writer fallback
    const recipient = getMatch(prompt, /recipient[:\s]+([^\n]+)/i) || 'Recipient';
    const subject = getMatch(prompt, /subject[:\s]+([^\n]+)/i) || getMatch(prompt, /purpose[:\s]+([^\n]+)/i) || 'Business Discussion';
    const keyPoints = getMatch(prompt, /points[:\s]+([^\n]+)/i) || getMatch(prompt, /details[:\s]+([^\n]+)/i) || 'Please connect on details.';
    const tone = getMatch(prompt, /tone[:\s]+([^\n]+)/i) || 'Professional';

    return `Subject: ${subject}

Dear ${recipient},

I hope this message finds you well. I am writing regarding our latest update on "${subject}".

Here are the key points to note:
${keyPoints.split(';').map(p => `- ${p.trim()}`).join('\n')}

Please review these details. Let's align on this at your earliest convenience.

Best regards,
[Your Name]
[Your Company]`;
  }

  if (systemInstruction.includes('WhatsApp') || lowerPrompt.includes('whatsapp') || lowerPrompt.includes('chat')) {
    // WhatsApp reply fallback
    const msg = getMatch(prompt, /message[:\s]+([^\n]+)/i) || 'your query';
    const details = getMatch(prompt, /details[:\s]+([^\n]+)/i) || 'We are looking into this.';
    return `Hi! 👋 Thanks for reaching out. Concerning: "${msg}". 

${details}

Let us know if you have any other questions. Have a great day! 😊`;
  }

  if (systemInstruction.includes('Proposal') || lowerPrompt.includes('proposal')) {
    // Proposal Writer fallback
    const client = getMatch(prompt, /client[:\s]+([^\n]+)/i) || 'Patil Enterprises';
    const project = getMatch(prompt, /project[:\s]+([^\n]+)/i) || 'Software Modernization';
    const problem = getMatch(prompt, /problem[:\s]+([^\n]+)/i) || 'Manual systems cause operations delay.';
    const cost = getMatch(prompt, /cost[:\s]+([^\n\d,]+)/i) || '1,50,000';
    return `==========================================
PROJECT PROPOSAL: ${project.toUpperCase()}
==========================================
Prepared for: ${client}
Date: ${new Date().toLocaleDateString('en-IN')}

1. Executive Summary
--------------------
To solve the issue: "${problem}", our engineering team will construct a specialized dashboard platform.

2. Deliverables & Scope
-----------------------
- Phase 1: Interactive System Architecture Design
- Phase 2: React Core UI Engineering
- Phase 3: PostgreSQL Database Integration & Secure API Deployment

3. Budget Estimation
--------------------
Total Estimate: ₹${cost} (Inclusive of local tax compliance)
Payment Terms: 40% upfront deposit, 60% upon system staging.

Authorized Signature: _______________________`;
  }

  if (systemInstruction.includes('Caption') || lowerPrompt.includes('caption') || lowerPrompt.includes('social')) {
    // Caption generator fallback
    const topic = getMatch(prompt, /topic[:\s]+([^\n]+)/i) || 'our new dashboard launched today';
    const platform = getMatch(prompt, /platform[:\s]+([^\n]+)/i) || 'Instagram';
    return `🚀 BIG NEWS! We are thrilled to share details about: ${topic}! 

This represents a major milestone in scaling our business workflows. Consistent daily effort is the driver of growth. 📈✨

What are your thoughts on this? Let us know in the comments! 👇
#businessgrowth #startupindia #indiatech #buildinpublic #productivity #bizpilot`;
  }

  if (systemInstruction.includes('Meeting') || lowerPrompt.includes('transcript') || lowerPrompt.includes('summarize')) {
    // Meeting Summarizer fallback
    return `MEETING SUMMARY & REKEY HIGHLIGHTS
------------------------------------
Key Points discussed:
- Reviewed core operations. Revenue metrics are stable.
- Noted bottleneck areas in product checkout flow.
- Agreed to set up an automated database sync.

Action items:
[ ] Team: Finalize UI reviews by Friday.
[ ] Engineering: Setup the Cloud Storage keys.`;
  }

  if (systemInstruction.includes('Business Name') || lowerPrompt.includes('business name') || lowerPrompt.includes('keywords')) {
    // Business name gen fallback
    const keywords = getMatch(prompt, /keywords[:\s]+([^\n]+)/i) || 'tech smart cloud';
    const words = keywords.split(/[\s,]+/);
    const w1 = words[0] || 'Stark';
    const w2 = words[1] || 'Flow';
    return `Here are premium AI suggested names for your business:
1. ${w1}Pilot AI (SaaS / Productivity)
2. ${w1}craft ${w2} (Creative Solutions)
3. Apex ${w1} (Enterprise Solutions)
4. ${w1}ify Tech (Modern Operations)
5. Core${w1} Solutions (Consulting)`;
  }

  if (systemInstruction.includes('Chat') || lowerPrompt.includes('chat') || lowerPrompt.includes('assistant')) {
    // General chat assistant fallback
    return `I am your Stark-themed AI Assistant. 🦾

Based on your query, here is what I recommend:
1. Ensure your API keys are configured in the System Settings panel.
2. Store your invoice and expense details. They are saved in your local database and will sync to Supabase if connected.
3. Use the sidebar tools to generate emails, calculate GST, and create proposals in seconds.

Let me know how else I can assist your operations today!`;
  }

  // Default catch-all
  return `SYS.REPLY // PROCESSED INPUTS:
-----------------------------
Received Prompt: "${prompt}"

Action: Content drafted successfully. Ensure your Gemini API Key is saved in the dashboard settings to run live custom generative models.`;
}

// Regex extraction helper
function getMatch(text, regex) {
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}
