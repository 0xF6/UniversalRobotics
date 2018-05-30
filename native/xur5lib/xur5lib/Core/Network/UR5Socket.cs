namespace UR5.Core.Network
{
    using System;
    using System.Linq;
    using System.Net;
    using System.Net.Sockets;
    using System.Text;

    public class UR5Socket : IDisposable
    {
        private readonly Encoding _encoding;
        private readonly Socket _socket;
        /// <summary>
        /// Constructs and connects the socket.
        /// </summary>
        /// <param name="endpoint">Endpoint to connect to</param>
        public UR5Socket(EndPoint endpoint) : this(endpoint, Encoding.UTF8) { }

        /// <summary>
        /// Constructs and connects the socket.
        /// </summary>
        /// <param name="endpoint">Endpoint to connect to</param>
        /// <param name="encoding">Encoding of the content sended and received by the socket</param>
        public UR5Socket(EndPoint endpoint, Encoding encoding)
        {
            _encoding = encoding;
            _socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            _socket.Connect(endpoint);
        }

        /// <summary>
        /// Constructs and connects the socket.
        /// </summary>
        /// <param name="host">Host to connect to</param>
        /// <param name="port">Port to connect to</param>
        public UR5Socket(string host, int port) : this(host, port, Encoding.UTF8) { }

        /// <summary>
        /// Constructs and connects the socket.
        /// </summary>
        /// <param name="host">Host to connect to</param>
        /// <param name="port">Port to connect to</param>
        /// <param name="encoding">Encoding of the content sended and received by the socket</param>
        public UR5Socket(string host, int port, Encoding encoding)
        {
            _encoding = encoding;
            _socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            _socket.Connect(host, port);
        }

        internal UR5Socket(Socket socket)
        {
            _encoding = Encoding.UTF8;
            _socket = socket;
        }

        /// <summary>
        /// True if there's any data to receive on the socket.
        /// </summary>
        public bool AnythingToReceive => _socket.Available > 0;

        /// <summary>
        /// The underlying socket.
        /// </summary>
        public Socket UnderlyingSocket => _socket;

        /// <summary>
        /// Disposes the socket.
        /// </summary>
        public void Dispose()
        {
            _socket.Shutdown(SocketShutdown.Both);
            _socket.Dispose();
        }

        /// <summary>
        /// Receives any pending data.
        /// This blocks execution until there's data available.
        /// </summary>
        /// <param name="bufferSize">Amount of data to read</param>
        /// <returns>Received data</returns>
        public string Receive(int bufferSize = 1024)
        {
            var buffer = new byte[bufferSize];
            _socket.Receive(buffer);
            return _encoding.GetString(buffer).TrimEnd('\0');
        }
        /// <summary>
        /// Receives any pending data.
        /// This blocks execution until there's data available.
        /// </summary>
        /// <returns>Received data</returns>
        public byte[] ReceiveBytes(int bufferSize = 4096)
        {
            var buffer = new byte[bufferSize];
            _socket.Receive(buffer);
            var data_found = false;
            var array = buffer.Reverse().SkipWhile(point =>
            {
                if (data_found) return false;
                if (point == 0x0) return true;
                data_found = true; 
                return false;
            }).Reverse().ToArray();
            return array;
        }
        /// <summary>
        /// Sends the given data.
        /// </summary>
        /// <param name="data">Data to send</param>
        public void Send(string data) => _socket.Send(_encoding.GetBytes(data));
    }
}