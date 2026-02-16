/** Shared input validation for frontend forms. */

export const MAX_CHAT_MESSAGE_LENGTH = 10_000
export const MAX_SEARCH_QUERY_LENGTH = 500

const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

const ALLOWED_UPLOAD_EXTENSIONS = new Set(['.pdf', '.txt', '.doc', '.docx'])

export interface ValidationResult {
  valid: boolean
  error?: string
}

export function validateChatMessage(content: string): ValidationResult {
  const trimmed = content.trim()
  if (!trimmed) {
    return { valid: false, error: 'Message cannot be empty' }
  }
  if (trimmed.length > MAX_CHAT_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Message too long (max ${MAX_CHAT_MESSAGE_LENGTH.toLocaleString()} characters)`,
    }
  }
  return { valid: true }
}

export function validateSearchQuery(query: string): ValidationResult {
  const trimmed = query.trim()
  if (!trimmed) {
    return { valid: false, error: 'Search query cannot be empty' }
  }
  if (trimmed.length > MAX_SEARCH_QUERY_LENGTH) {
    return {
      valid: false,
      error: `Query too long (max ${MAX_SEARCH_QUERY_LENGTH} characters)`,
    }
  }
  return { valid: true }
}

export function validateUploadFile(file: File): ValidationResult {
  const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '')

  if (!ALLOWED_UPLOAD_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: `File type "${ext}" not allowed. Accepted: PDF, TXT, DOC, DOCX`,
    }
  }

  if (file.type && !ALLOWED_UPLOAD_MIME_TYPES.has(file.type)) {
    return {
      valid: false,
      error: `MIME type "${file.type}" not allowed. Upload a PDF, TXT, DOC, or DOCX file`,
    }
  }

  return { valid: true }
}
