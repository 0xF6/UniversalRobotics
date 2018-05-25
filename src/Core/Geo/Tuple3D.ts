export class Tuple3D {
    public x: number;
    public y: number;
    public z: number;
    public static Tuple3D(var1: number, var3: number, var5: number) {
        let q = new Tuple3D();
        q.x = var1;
        q.y = var3;
        q.z = var5;
        return q;
    }
    public scaleAdd1(var1: number, var3: Tuple3D): void {
        this.x = var1 * this.x + var3.x;
        this.y = var1 * this.y + var3.y;
        this.z = var1 * this.z + var3.z;
    }
    public scaleAdd2(var1: number, var3: Tuple3D, var4: Tuple3D): void {
        this.x = var1 * var3.x + var4.x;
        this.y = var1 * var3.y + var4.y;
        this.z = var1 * var3.z + var4.z;
    }
    public scale1(var1: number): void {
        this.x *= var1;
        this.y *= var1;
        this.z *= var1;
    }
    public scale2(var1: number, var3: Tuple3D): void {
        this.x = var1 * var3.x;
        this.y = var1 * var3.y;
        this.z = var1 * var3.z;
    }
    public negate(): void {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
    }
    public negate1(var1: Tuple3D): void {
        this.x = -var1.x;
        this.y = -var1.y;
        this.z = -var1.z;
    }
    public sub(var1: Tuple3D): void {
        this.x -= var1.x;
        this.y -= var1.y;
        this.z -= var1.z;
    }
    public sub1(var1: Tuple3D, var2: Tuple3D): void {
        this.x = var1.x - var2.x;
        this.y = var1.y - var2.y;
        this.z = var1.z - var2.z;
    }
    public add(var1: Tuple3D): void {
        this.x += var1.x;
        this.y += var1.y;
        this.z += var1.z;
    }
    public add1(var1: Tuple3D, var2: Tuple3D) {
        this.x = var1.x + var2.x;
        this.y = var1.y + var2.y;
        this.z = var1.z + var2.z;
    }
    public get(var1: Tuple3D): void {
        var1.x = this.x;
        var1.y = this.y;
        var1.z = this.z;
    }
}