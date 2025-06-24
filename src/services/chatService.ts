import OpenAI from 'openai';
import { SessionManager } from './sessionManager';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  message: string;
  timestamp: string;
  needsEscalation: boolean;
  confidence: number;
}

export class ChatService {
  private openai: OpenAI;
  private sessionManager: SessionManager;
  private escalationKeywords: string[];

  constructor(sessionManager: SessionManager) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.sessionManager = sessionManager;
    this.escalationKeywords = (process.env.ESCALATION_KEYWORDS || '').split(',').map(k => k.trim().toLowerCase());
  }

  async processMessage(sessionId: string, userMessage: string, userId: string): Promise<ChatResponse> {
    const timestamp = new Date().toISOString();
    
    try {
      // Get conversation history
      const conversationHistory = await this.sessionManager.getConversationHistory(sessionId);
      
      // Check for escalation keywords
      const needsEscalation = this.checkForEscalation(userMessage);
      
      if (needsEscalation) {
        const escalationMessage = "I understand you need additional assistance. I'm connecting you with a human support agent who will be able to help you better. Please hold on for a moment.";
        
        // Save escalation message to history
        await this.sessionManager.addMessageToHistory(sessionId, {
          role: 'assistant',
          content: escalationMessage,
          timestamp
        });
        
        return {
          message: escalationMessage,
          timestamp,
          needsEscalation: true,
          confidence: 1.0
        };
      }

      // Prepare messages for OpenAI
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: this.getSystemPrompt(),
          timestamp
        },
        ...conversationHistory,
        {
          role: 'user',
          content: userMessage,
          timestamp
        }
      ];

      // Call OpenAI API
      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: 500,
        temperature: 0.7,
      });

      const aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process your request. Please try again.";
      
      // Calculate confidence based on response
      const confidence = this.calculateConfidence(aiResponse, userMessage);
      
      // Save messages to history
      await this.sessionManager.addMessageToHistory(sessionId, {
        role: 'user',
        content: userMessage,
        timestamp
      });
      
      await this.sessionManager.addMessageToHistory(sessionId, {
        role: 'assistant',
        content: aiResponse,
        timestamp
      });

      return {
        message: aiResponse,
        timestamp,
        needsEscalation: confidence < 0.5, // Escalate if confidence is low
        confidence
      };

    } catch (error) {
      console.error('Error in ChatService.processMessage:', error);
      
      // Fallback response
      const fallbackMessage = "I'm experiencing some technical difficulties. Please try again, or I can connect you with a human agent.";
      
      return {
        message: fallbackMessage,
        timestamp,
        needsEscalation: true,
        confidence: 0.0
      };
    }
  }

  private getSystemPrompt(): string {
    return `You are a helpful customer support chatbot. Your role is to:
1. Assist customers with common questions and issues
2. Provide accurate and helpful information
3. Be polite, professional, and empathetic
4. If you cannot resolve an issue or if the customer seems frustrated, acknowledge their concern and offer to escalate to a human agent
5. Keep responses concise but comprehensive
6. Always maintain a friendly and helpful tone

Common topics you can help with:
- Product information and features
- Account questions
- Order status and tracking
- Returns and exchanges
- Technical support basics
- Billing inquiries

If a customer's issue is complex, involves sensitive information, or requires human judgment, politely offer to connect them with a human agent.`;
  }

  private checkForEscalation(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    return this.escalationKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  private calculateConfidence(aiResponse: string, userMessage: string): number {
    // Simple confidence calculation based on response characteristics
    const lowConfidenceIndicators = [
      "i don't know",
      "i'm not sure",
      "i can't help",
      "contact support",
      "try again",
      "technical difficulties"
    ];
    
    const lowerResponse = aiResponse.toLowerCase();
    const hasLowConfidenceIndicators = lowConfidenceIndicators.some(indicator => 
      lowerResponse.includes(indicator)
    );
    
    if (hasLowConfidenceIndicators) {
      return 0.3;
    }
    
    // Higher confidence for longer, more detailed responses
    if (aiResponse.length > 100) {
      return 0.8;
    }
    
    return 0.6;
  }
}
