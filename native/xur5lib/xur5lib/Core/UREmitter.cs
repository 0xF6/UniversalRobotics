namespace UR5.Core
{
    using System;
    using System.Linq;
    using System.Threading;
    using Network;
    using Struct;

    public class UREmitter : IDisposable
    {
        public UR5Socket Socket { get; private set; }
        public Thread ReceiveThread { get; set; }
        public readonly object SyncGuard = new object();
        private static bool isMove, isProgramWork;



        public bool IsMove
        {
            get
            {
                lock (SyncGuard)
                {
                    return isMove;
                }
            }
        }
        public bool IsProgramWork
        {
            get
            {
                lock (SyncGuard)
                {
                    return isProgramWork;
                }
            }
        }


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

                            isProgramWork = @base.IsProgramWork;
                            break;
                        case 1:
                            {
                                var code = 0;
                                while (true)
                                {
                                    if (code >= 6)
                                        break;
                                    @base.Joints[code].JointPosition = reader.readDouble();
                                    @base.Joints[code].JointTarger = reader.readDouble();
                                    @base.Joints[code].JointSpeed = reader.readDouble();
                                    @base.Joints[code].JointCurrent = reader.readFloat();
                                    @base.Joints[code].Voltage = reader.readFloat();
                                    @base.Joints[code].MotorTemperature = reader.readFloat();
                                    @base.Joints[code].MicroTemperature = reader.readFloat();
                                    @base.Joints[code].Mode = reader.readByte();
                                    code++;
                                }
                                // ReSharper disable once CompareOfFloatsByEqualityOperator
                                isMove = @base.Joints.All(x => x.JointSpeed == 0);
                            }
                            break;
                        case 2:
                            {
                                reader.readByte(); // analogInputRange[2]
                                reader.readByte(); // analogInputRange[3]
                                reader.readDouble(); // analogIn[2]
                                reader.readDouble(); // analogIn[3]
                                reader.readFloat(); // toolVoltage48V
                                reader.readByte(); // toolOutputVoltage
                                reader.readFloat(); // toolCurrent
                                reader.readFloat(); // toolTemperature
                                reader.readByte(); // toolMode
                            }
                            break;
                        case 3:
                            reader.setOffset(reader.getOffset() + 50);
                            var signalResponseTimeInMs = reader.readByte();
                            if (signalResponseTimeInMs == 1)
                                reader.setOffset(reader.getOffset() + 13);
                            break;
                        case 4:
                            {
                                @base.ToolPosition.X = reader.readDouble();
                                @base.ToolPosition.Y = reader.readDouble();
                                @base.ToolPosition.Z = reader.readDouble();

                                @base.ToolOrientation.X = reader.readDouble();
                                @base.ToolOrientation.Y = reader.readDouble();
                                @base.ToolOrientation.Z = reader.readDouble();
                            }
                            break;
                        case 7:
                            for (var i = 0; i != 6; i++)
                                reader.readDouble();
                            reader.readDouble();
                            break;
                        case 8:
                            reader.readBool();
                            reader.readBool();
                            break;
                        case 9:
                            reader.setOffset(reader.getOffset() + (box_size - 5));
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