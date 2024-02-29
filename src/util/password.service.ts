import { Injectable } from "@nestjs/common";
import { scrypt, randomBytes, BinaryLike, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

@Injectable()
export default class PasswordService {
  private readonly KEY_LEN = 64;
  private readonly _scrypt = promisify<BinaryLike, BinaryLike, number, Buffer>(
    scrypt
  );
  async generatePassword(input: string): Promise<string> {
    const salt = randomBytes(8).toString("hex");
    const pass = (await this._scrypt(input, salt, this.KEY_LEN)).toString(
      "hex"
    );

    const result = salt + "." + pass;
    return result;
  }
  async comparePassword(input: string, hash: string): Promise<boolean> {
    const [salt, pass] = hash.split(".");
    const inputHash = await this._scrypt(input, salt, this.KEY_LEN);
    return timingSafeEqual(inputHash, Buffer.from(pass, "hex"));
  }
}
