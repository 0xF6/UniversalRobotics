namespace UR5.Core
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Globalization;
    using System.Threading;
    using System.Threading.Tasks;

    public class NodeEntryPoint
    {
        public static UREmitter Emitter { get; set; }

        private static Func<object, Task<object>> Link { get; set; }
        
        public async Task<object> Init(dynamic input)
        {
            try
            {
                SetCulture();
                Config.IP = (string)input.IP;
                Config.Port = (int)input.Port;
                Emitter = new UREmitter();
            }
            catch (Exception e)
            {
                Debug.Assert(false, $"[native err]\nfailed init node entry point.\n{e.Message}");
                return await new Task<object>(() => false);
            }
            return await new Task<object>(() => true);
        }
        public async Task<object> OnData(dynamic input)
        {
            Link = input.func;
            Emitter.DataEvent += Emitter_DataEvent;
            return await new Task<object>(() => true);
        }

        public static Dictionary<string, object> obj = new Dictionary<string, object>();

        public async Task<object> RunProgram(dynamic input)
        {
            Console.WriteLine("New program");
            switch (input.name)
            {
                case "nyan":
                {
                    if (!obj.ContainsKey("nya"))
                    {
                        Console.WriteLine("Start nya");
                        obj.Add("nya", new NyanProgram());
                    }
                    else
                    {
                        Console.WriteLine("Stop nya");
                        (obj["nya"] as NyanProgram).Stop();
                        obj["nya"] = new NyanProgram();
                    }
                }
                break;
            }
            return await new Task<object>(() => true);
        }
        public async Task<object> StopProgram(dynamic input)
        {
            switch (input.name)
            {
                case "nyan":
                    {
                        if (obj.ContainsKey("nya"))
                        {
                            (obj["nya"] as NyanProgram).Stop();
                            Console.WriteLine("Stop nya");
                        }
                    }
                    break;
            }
            return await new Task<object>(() => true);
        }

        private static void Emitter_DataEvent(byte[] data) => Link?.Invoke(data);

        private void SetCulture()
        {
            CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;
            CultureInfo.DefaultThreadCurrentUICulture = CultureInfo.InvariantCulture;
        }
    }


    public class NyanProgram
    {
        public Thread Th;
        private bool IsStop;
        public NyanProgram()
        {
            Th = new Thread(Run);
            Th.Start();
            Console.WriteLine("START nya");
        }

        public void Stop()
        {
            IsStop = true;
            Th.Abort();
            Th = null;
        }

        private bool IsMove() => NodeEntryPoint.Emitter.IsMove;
        private bool IsProg() => NodeEntryPoint.Emitter.IsProgramWork;

        private void movej(string coord)
        {
            NodeEntryPoint.Emitter.Write($"movej({coord},2.200,2.750,0,0)\n");
            Console.WriteLine($"MOVE {coord}");
        }

        public void Run()
        {
            Console.WriteLine("RUN nya");
            bool isQwe = false;
            movej("[-1.7296626891646794, -0.873911545921711, -2.6683137081091917, 0.8614078700797733, 1.609629230276196, 0.2695362316363145]");
            while (!IsStop)
            {
                Thread.Sleep(1400);
                Console.WriteLine($"IsMove: {IsMove()}, IsProg: {IsProg()}");

                if(IsMove())
                    continue;
                if(IsProg())
                    continue;
                Thread.Sleep(400);

                if (isQwe)
                {
                    movej("[-1.2565043465328065, -0.9156906312074228, -2.653504651191361, 0.6140473201146802, 1.1946722910583585, 0.18491323471501875]");
                    isQwe = false;
                }
                else
                {
                    movej("[-2.1285621659490337, -0.8738926907411932, -2.667946025697509, 0.8644803257400226, 2.0817837231187304, 0.2689776828661254]");
                    isQwe = true;
                }
            }
        }
    }
}