export interface IEncryptor {
  encryptString(item: string): string
  decrypt(encryptedString: string): string
}
