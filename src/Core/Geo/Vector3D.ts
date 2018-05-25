import { Tuple3D } from "./Tuple3D";

export class Vector3D extends Tuple3D {

    constructor(x, y, z) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public cross(var1: Vector3D, var2: Vector3D): void {
        let var3 = var1.y * var2.z - var1.z * var2.y;
        let var5 = var2.x * var1.z - var2.z * var1.x;
        this.z = var1.x * var2.y - var1.y * var2.x;
        this.x = var3;
        this.y = var5;
    }
    public normalize(var1: Vector3D): void {
        let var2 = 1.0 / Math.sqrt(var1.x * var1.x + var1.y * var1.y + var1.z * var1.z);
        this.x = var1.x * var2;
        this.y = var1.y * var2;
        this.z = var1.z * var2;
    }
    public normalizeThis(): void {
        let var1 = 1.0 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        this.x *= var1;
        this.y *= var1;
        this.z *= var1;
    }
    public dot(var1: Vector3D): number {
        return this.x * var1.x + this.y * var1.y + this.z * var1.z;
    }
    public lengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    public angle(var1: Vector3D) {
        let var2 = this.dot(var1) / (this.length() * var1.length());
        if (var2 < -1.0) {
            var2 = -1.0;
        }
        if (var2 > 1.0) {
            var2 = 1.0;
        }
        return Math.acos(var2);
    }
}