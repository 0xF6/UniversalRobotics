namespace UR5.Core
{
    using System;
    using System.Threading;
    using Network;
    using Struct;

    public class UREmitter : IDisposable
    {
        public UR5Socket Socket { get; private set; }
        public Thread ReceiveThread { get; set; }
        public readonly object SyncGuard = new object();
        private static bool isMove, IsProgramWork;
        public UREmitter()
        {
            Socket = new UR5Socket(Config.IP, Config.Port);
            ReceiveThread = new Thread(onReceive);
            ReceiveThread.Start();
            this.DataEvent += idataEvent;
        }

        private void idataEvent(byte[] data)
        {
            lock (SyncGuard)
            {
                var reader = URBuffer.InvokeReader(data);
                var @base = new UR5Info();

                var size = packet_size(reader);

                if (size > reader.Lenght)
                    return;

                var opcode = reader.readByte();

                if(opcode != 16)
                    return;
               
                while (reader.getOffset() < size)
                {
                    var packet_start = reader.getOffset();
                    var box_size = reader.readInt32();
                    var box_type = reader.readByte();
                    switch (box_type)
                    {
                        case 0:
                            @base.TimeStamp = reader.readInt64();
                            @base.IsPhysical = reader.readBool();
                            @base.IsReal = reader.readBool();
                            @base.IsPowerOn = reader.readBool();
                            @base.IsEmergencyStopped = reader.readBool();
                            @base.IsSecurityStopped = reader.readBool();
                            @base.IsProgramWork = reader.readBool();
                            @base.IsProgramPaused = reader.readBool();
                            @base.Mode = (RobotMode)reader.readByte();
                            reader.readDouble(); // speed fraction
                            break;
                    }
                }
             
            }
        }


        public void Dispose() => Socket?.Dispose();
        public void Write(string str) => Socket?.Send(str);

        #region Event

        public void OnData(byte[] data) => DataEvent?.Invoke(data);

        private void onReceive()
        {
            while (true)
            {
                lock (SyncGuard)
                {
                    OnData(Socket.ReceiveBytes());
                }
                Thread.Sleep(20);
            }
        }



        public delegate void DataDelegate(byte[] data);
        public event DataDelegate DataEvent;
        #endregion


        #region LowLevel
        /// <summary>
        /// Get packet size according to the byte array
        /// </summary>
        public static int packet_size(IURBufferReader buff)
        {
            if (buff.Lenght < 4)
                return 0;
            return buff.readInt32();
        }
        /// <summary>
        /// Check if a packet is complete
        /// </summary>
        public static bool packet_check(IURBufferReader buff) => buff.Lenght >= packet_size(buff);

        #endregion



        #region Main Region

        public void SwitchFreeDrive()
        {

        }

        #endregion
    }
}