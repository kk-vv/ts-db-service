export class DBError extends Error {
  reason?: string

  constructor(option?: { name?: string, reason?: string, cause?: unknown }) {
    let reason = option?.reason
    if (!reason && option?.cause) {
      reason = (option.cause as any).message || (option.cause as any).msg || `${option.cause}`
    }
    super(reason ?? 'DB errror')
    this.cause = option?.cause
    this.name = option?.name || 'DB errror'
    this.reason = reason
  }

  errorMessage() {
    return `${this.name}|${this.reason}`
  }
}