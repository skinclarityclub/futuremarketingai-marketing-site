import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Secure OpenAI Proxy API
 *
 * This serverless function acts as a secure proxy between the frontend
 * and OpenAI API, keeping the API key hidden from the browser.
 */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': '*', // In production, replace with your domain
  'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  'Access-Control-Allow-Headers':
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ body: 'OK' })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST requests are supported',
    })
  }

  // Get API key from environment (server-side only)
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.error('OPENAI_API_KEY is not configured')
    return res.status(500).json({
      error: 'Configuration error',
      message: 'API key is not configured on the server',
    })
  }

  try {
    // Extract request body
    const { messages, model, temperature, max_tokens } = req.body

    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'messages array is required',
      })
    }

    // Make request to OpenAI
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages,
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenAI API error:', response.status, errorData)
      return res.status(response.status).json({
        error: 'OpenAI API error',
        message: errorData.error?.message || 'Failed to get response from AI',
        status: response.status,
      })
    }

    const data = await response.json()

    // Add CORS headers and return response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(data)
  } catch (error) {
    console.error('Server error:', error)
    return res.status(500).json({
      error: 'Server error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    })
  }
}
