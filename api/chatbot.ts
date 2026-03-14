import { handleChatRequest } from '../src/lib/chatbot/engine'

export const config = { runtime: 'edge' }

export default function handler(request: Request): Promise<Response> {
  return handleChatRequest(request)
}
