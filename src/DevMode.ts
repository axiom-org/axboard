// Convenience tools, only to be used during development
export default class DevMode {
  static getData(): any {
    let serialized = localStorage.dev;
    let data: any;
    try {
      data = JSON.parse(serialized);
    } catch (e) {
      return undefined;
    }
    return data;
  }

  static setData(data: any) {
    localStorage.dev = JSON.stringify(data);
  }

  static isActive(): boolean {
    return DevMode.getData() !== undefined;
  }

  static getAuth(): any {
    let data = DevMode.getData();
    if (!data) {
      return undefined;
    }
    return data.auth || {};
  }

  static getUsernames(): string[] {
    let auth = DevMode.getAuth();
    if (!auth) {
      return [];
    }
    return Object.keys(auth);
  }

  static addToAuth(username: string, passphrase: string) {
    let auth = DevMode.getAuth();
    auth[username] = { passphrase };
    DevMode.setData({ auth });
  }

  static getPassphrase(username: string): string {
    let auth = DevMode.getAuth();
    return auth[username].passphrase;
  }

  static exit() {
    localStorage.removeItem("dev");
  }
}
