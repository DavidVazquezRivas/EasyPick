export type SuggestionStatus = 'ACCEPTED'

export type SuggestionRejectionPayload = {
  reasonId?: string
  customReason?: string
}

export type PatchSuggestionRequest = {
  status?: SuggestionStatus
  rejection?: SuggestionRejectionPayload
}
