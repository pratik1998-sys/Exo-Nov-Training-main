export class StringUtility {
  static isStringEmpty(str: string) {
    return !str || str.trim() == "";
  }

  static isStringNotEmpty(str: string) {
    return !this.isStringEmpty(str);
  }
}
