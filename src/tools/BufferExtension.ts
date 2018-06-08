const int64 = require('node-int64');

declare interface Buffer {
    readInt64BE(offset: number): number;
    readBooleanBE(offset: number): boolean;
    readByteBE(offset: number): number;
}
(function () {
    Buffer.prototype.readInt64BE = function (this: Buffer, offset: number): number {
        return new int64(this, offset).toNumber(true);
    }
    Buffer.prototype.readBooleanBE = function (this: Buffer, offset: number): boolean {
        return this[offset] == 1;
    }
    Buffer.prototype.readByteBE = function (this: Buffer, offset: number): number {
        return this[offset];
    }
})();