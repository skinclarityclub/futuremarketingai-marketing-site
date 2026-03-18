import type { TopicDefinition, TopicRouterResult } from './types'

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

interface ScoredTopic {
  topic: TopicDefinition
  score: number
}

export function routeToKnowledge(
  message: string,
  topics: TopicDefinition[],
  conversationTopics?: string[]
): TopicRouterResult {
  const lower = message.toLowerCase()

  const scored: ScoredTopic[] = []

  for (const topic of topics) {
    let score = 0

    for (const keyword of topic.keywords) {
      const keywordLower = keyword.toLowerCase()

      // +1 for substring match
      if (lower.includes(keywordLower)) {
        score += 1

        // +0.5 bonus for exact word boundary match
        try {
          const regex = new RegExp(`\\b${escapeRegex(keywordLower)}\\b`)
          if (regex.test(lower)) {
            score += 0.5
          }
        } catch {
          // If regex fails, skip the bonus
        }
      }
    }

    // +0.3 for context carryover
    if (conversationTopics && conversationTopics.includes(topic.key)) {
      score += 0.3
    }

    if (score >= 1) {
      scored.push({ topic, score })
    }
  }

  if (scored.length === 0) {
    return { topics: [], knowledgeContent: '', estimatedTokens: 0 }
  }

  // Sort by score DESC, then priority DESC as tiebreaker
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score
    }
    return b.topic.priority - a.topic.priority
  })

  // Select top 3
  const selected = scored.slice(0, 3)

  const topicKeys = selected.map((s) => s.topic.key)
  const knowledgeContent = selected.map((s) => s.topic.content).join('\n\n')
  const estimatedTokens = Math.ceil(knowledgeContent.length / 4)

  return { topics: topicKeys, knowledgeContent, estimatedTokens }
}
