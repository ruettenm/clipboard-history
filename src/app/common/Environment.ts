export class Environment {
    public static isElectron() {
        return window && window.process && window.process.type
    }

    public static isProduction() {
        return false
    }
}
