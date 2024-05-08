export type Data = Array<Record<string, string>>

export interface ApiUploadResponse {
  message: string
  data: Data
}

export interface ApiSearchResponse {
  data: Data
}
