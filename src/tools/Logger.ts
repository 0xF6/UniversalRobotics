export class Logger {
    public static IsEscapeEnabled: boolean = true;

    //private static EscapeEnd: string = "\x1b[39m";

    //private static EscapeTemplate: string = "\x1b[38;2;{R};{G};{B}m";

    public static Log(str: any) {
        if (!Logger.IsEscapeEnabled) {
            console.log(`[UR5][LOG]${str}`);
            return;
        } if (str.toString() == "[object Object]")
            str = JSON.stringify(str);
        console.log(`[${"\x1b[38;2;229;50;50mUR5\x1b[39m"}][\x1b[38;2;140;140;140m LOG  \x1b[39m]: ${str}`)
    }
    public static Error(str: any) {
        if (!Logger.IsEscapeEnabled) {
            console.log(`[UR5][ERROR]${str}`);
            return;
        }
        if (str.toString() == "[object Object]")
            str = JSON.stringify(str);

        console.log(`[${"\x1b[38;2;229;50;50mUR5\x1b[39m"}][\x1b[38;2;229;50;50m ERR  \x1b[39m]: ${str}`)
    }
    public static Warn(str: any) {
        if (!Logger.IsEscapeEnabled) {
            console.log(`[UR5][WARN]${str}`);
            return;
        } if (str.toString() == "[object Object]")
            str = JSON.stringify(str);
        console.log(`[${"\x1b[38;2;229;50;50mUR5\x1b[39m"}][\x1b[38;2;246;187;26m WARN \x1b[39m]: ${str}`)
    }
}