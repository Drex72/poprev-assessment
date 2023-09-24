import CryptoJS from "crypto-js"
import { IEncryptor } from "../dto"
import { config } from "../../core"

class Encryptor implements IEncryptor {
  constructor(
    private readonly encryptorSecretKey: string = config.auth
      .encryptorSecretKey,
  ) {}

  encryptString = (item: string) => {
    return CryptoJS.AES.encrypt(item, this.encryptorSecretKey).toString()
  }
  decrypt(encryptedString: string): string {
    return CryptoJS.AES.decrypt(
      encryptedString,
      this.encryptorSecretKey,
    ).toString(CryptoJS.enc.Utf8)
  }
}

export const encryptor = new Encryptor()
