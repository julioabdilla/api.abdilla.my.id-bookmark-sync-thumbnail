export class StringUtils {
  public static padLeft(string: string, length: number, char: string): string {
    while (string.length < length) {
      string = char + string;
    }
    return string;
  }

  public static unpadLeft(string: string, char: string): string {
    const regex = new RegExp(`^${char}+`);
    return string.replace(regex, '');
  }

  public static random(length: number = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  }
}
