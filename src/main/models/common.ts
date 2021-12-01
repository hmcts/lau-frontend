interface Metadata {
  key: string,
  value: never
}

export interface MetadataObj {
  [key: string]: Metadata
}
