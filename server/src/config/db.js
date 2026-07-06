import dns from 'dns';

const dnsServers = ['8.8.8.8', '1.1.1.1'];
const currentDnsServers = dns.getServers();
const dnsChanged =
  currentDnsServers.length !== dnsServers.length ||
  currentDnsServers.some((server, index) => server !== dnsServers[index]);

if (dnsChanged) {
  dns.setServers(dnsServers);
  console.log(`DNS FIX APPLIED: ${dnsServers.join(', ')}`);
}

const { default: mongoose } = await import('mongoose');

let reconnectDelayMs = 1000;
let reconnectTimer = null;

async function connectWithRetry(uri) {
  try {
    console.log('CONNECTING TO MONGODB ATLAS');
    const isProduction = process.env.NODE_ENV === 'production';
    const connectOptions = {
      tls: true,
      family: 4,
      serverSelectionTimeoutMS: 5000
    };

    if (!isProduction) {
      connectOptions.tlsAllowInvalidCertificates = true;
      connectOptions.tlsAllowInvalidHostnames = true;
    }

    await mongoose.connect(uri, connectOptions);
    reconnectDelayMs = 1000;
    console.log('MONGODB CONNECTED SUCCESSFULLY');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    if (error?.message?.includes('unable to verify the first certificate')) {
      console.error('TLS certificate verification failed during MongoDB connection.');
    }
    console.log(`Retrying MongoDB connection in ${reconnectDelayMs}ms`);
    reconnectTimer = setTimeout(() => {
      connectWithRetry(uri);
    }, reconnectDelayMs);
    reconnectDelayMs = Math.min(reconnectDelayMs * 2, 30000);
  }
}

export default async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cafirm';

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
    if (!reconnectTimer) {
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connectWithRetry(uri);
      }, reconnectDelayMs);
      reconnectDelayMs = Math.min(reconnectDelayMs * 2, 30000);
    }
  });

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error.message);
  });

  await connectWithRetry(uri);

  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
    } finally {
      process.exit(0);
    }
  });

  process.on('SIGTERM', async () => {
    try {
      await mongoose.connection.close();
    } finally {
      process.exit(0);
    }
  });
}
