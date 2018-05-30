namespace UR5.Core.Network
{
    using System;
    using System.IO;
    using System.Linq;

    public class URBuffer
    {
        protected readonly MemoryStream nMStream;
        protected URBuffer(byte[] bytes)
        {
            nMStream = new MemoryStream(bytes);
        }
        protected URBuffer()
        {
            nMStream = new MemoryStream();
        }
        public long Remaining() => nMStream.Length - nMStream.Position;

        public static IURBufferReader InvokeReader(byte[] buffer) => new URBufferReader(buffer);
    }


    public interface IURBufferReader
    {
        byte readByte();
        short readInt16();
        float readFloat();
        int readInt32();
        long readInt64();
        bool readBool();
        double readDouble();
        IURBufferReader Clone();

        void setOffset(long offset);
        long getOffset();
        long Lenght { get; }
    }


    public class URBufferReader : URBuffer, IURBufferReader
    {
        internal URBufferReader(byte[] bytes) : base(bytes)
        { }
        
        short IURBufferReader.readInt16()
        {
            byte[] @Byte = new byte[sizeof(short)];
            nMStream.Read(@Byte, offset: 0, count: sizeof(short));
            return BitConverter.ToInt16(@Byte.Reverse().ToArray(), startIndex: 0);
        }
        byte IURBufferReader.readByte()
        {
            Byte[] @Byte = new byte[1];
            nMStream.Read(@Byte, offset: 0, count: @Byte.Length);
            return @Byte[0];
        }
        float IURBufferReader.readFloat()
        {
            byte[] @Byte = new byte[sizeof(float)];
            nMStream.Read(@Byte, offset: 0, count: sizeof(float));
            return BitConverter.ToSingle(@Byte.Reverse().ToArray(), startIndex: 0);
        }
        int IURBufferReader.readInt32()
        {
            byte[] @Byte = new byte[sizeof(int)];
            nMStream.Read(@Byte, offset: 0, count: sizeof(int));
            return BitConverter.ToInt32(@Byte.Reverse().ToArray(), startIndex: 0);
        }
        long IURBufferReader.readInt64()
        {
            byte[] @Byte = new byte[sizeof(long)];
            nMStream.Read(@Byte, offset: 0, count: sizeof(long));
            return BitConverter.ToInt64(@Byte.Reverse().ToArray(), startIndex: 0);
        }
        double IURBufferReader.readDouble()
        {
            byte[] @Byte = new byte[sizeof(double)];
            nMStream.Read(@Byte, offset: 0, count: sizeof(double));
            return BitConverter.ToDouble(@Byte.Reverse().ToArray(), startIndex: 0);
        }
        IURBufferReader IURBufferReader.Clone()
        {
            URBufferReader reader = (URBufferReader)InvokeReader(nMStream.ToArray());
            reader.nMStream.Position = nMStream.Position;
            return reader;
        }

        void IURBufferReader.setOffset(long offset) => nMStream.Position = offset;

        long IURBufferReader.getOffset() => nMStream.Position;

        public long Lenght => nMStream.ToArray().Length;

        bool IURBufferReader.readBool()
        {
            byte[] @Byte = new byte[sizeof(bool)];
            nMStream.Read(@Byte, offset: 0, count: sizeof(bool));
            return BitConverter.ToBoolean(@Byte, startIndex: 0);
        }


    }
}