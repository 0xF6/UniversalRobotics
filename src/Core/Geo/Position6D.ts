import { Vector3D } from "./Vector3D";

export class Position6D {
    static serialVersionUID: number = 3761969948420550442;


    private pos: Vector3D;
    private rot: Vector3D;
    public constructor(x: Vector3D, r: Vector3D) {
        this.pos = x;
        this.rot = r;
    }

    public static From(x: number, y: number, z: number, rx: number, ry: number, rz: number): Position6D {
        return new Position6D(new Vector3D(x, y, z), new Vector3D(rx, ry, rz));
    }




    public Clone(): Position6D {
        return new Position6D(new Vector3D(this.pos.x, this.pos.y, this.pos.z), new Vector3D(this.rot.x, this.rot.y, this.rot.z));
    }
}