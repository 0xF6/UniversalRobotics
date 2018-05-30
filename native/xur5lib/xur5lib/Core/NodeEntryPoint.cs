namespace UR5.Core
{
    using System;
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

        private static void Emitter_DataEvent(byte[] data) => Link?.Invoke(data);

        private void SetCulture()
        {
            CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;
            CultureInfo.DefaultThreadCurrentUICulture = CultureInfo.InvariantCulture;
        }
    }
}