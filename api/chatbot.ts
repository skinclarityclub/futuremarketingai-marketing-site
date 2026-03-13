import { handleChatRequest } from '../src/lib/chatbot/engine'

export default {
  async fetch(request: Request): Promise<Response> {
    return handleChatRequest(request)
  },
}
