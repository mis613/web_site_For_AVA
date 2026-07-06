import dns from 'dns/promises';
import dnsSync from 'dns';
import net from 'net';

const TARGET_HOST = 'google.com';
const MONGODB_SRV = '_mongodb._tcp.cluster0.jqdfneh.mongodb.net';
const TCP_TARGET = { host: '8.8.8.8', port: 53 };
const TCP_TIMEOUT_MS = 5000;

dnsSync.setServers(['8.8.8.8', '1.1.1.1']);

function log(section, message, extra) {
  const stamp = new Date().toISOString();
  if (typeof extra === 'undefined') {
    console.log(`[${stamp}] [${section}] ${message}`);
    return;
  }
  console.log(`[${stamp}] [${section}] ${message}`, extra);
}

async function resolveA(hostname) {
  const records = await dns.resolve4(hostname);
  return records;
}

async function resolveSrv(name) {
  const records = await dns.resolveSrv(name);
  return records;
}

function testTcpConnectivity(host, port, timeoutMs) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;

    const finish = (result) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finish({ ok: true }));
    socket.once('timeout', () => finish({ ok: false, error: `Timeout after ${timeoutMs}ms` }));
    socket.once('error', (error) => finish({ ok: false, error: error.message }));
    socket.connect(port, host);
  });
}

async function main() {
  log('START', 'MongoDB connectivity debug started');
  log('DNS', 'Using DNS servers: 8.8.8.8, 1.1.1.1');

  let googleDns = null;
  let mongoSrv = null;
  let tcp = null;

  try {
    googleDns = await resolveA(TARGET_HOST);
    log('DNS', `A lookup for ${TARGET_HOST} succeeded`, googleDns);
  } catch (error) {
    log('DNS', `A lookup for ${TARGET_HOST} failed: ${error.message}`);
  }

  try {
    mongoSrv = await resolveSrv(MONGODB_SRV);
    log('SRV', `SRV lookup for ${MONGODB_SRV} succeeded`, mongoSrv);
  } catch (error) {
    log('SRV', `SRV lookup for ${MONGODB_SRV} failed: ${error.code || error.message}`);
  }

  tcp = await testTcpConnectivity(TCP_TARGET.host, TCP_TARGET.port, TCP_TIMEOUT_MS);
  if (tcp.ok) {
    log('TCP', `Connectivity to ${TCP_TARGET.host}:${TCP_TARGET.port} succeeded`);
  } else {
    log('TCP', `Connectivity to ${TCP_TARGET.host}:${TCP_TARGET.port} failed: ${tcp.error}`);
  }

  let conclusion = 'Inconclusive';
  if ((!googleDns || googleDns.length === 0) && (!mongoSrv || mongoSrv.length === 0) && tcp.ok) {
    conclusion = 'Outbound TCP is available, but DNS resolution is failing. The MongoDB error is most likely caused by a broken or blocked DNS resolver path, not general internet connectivity.';
  } else if (googleDns && googleDns.length > 0 && (!mongoSrv || mongoSrv.length === 0) && !tcp.ok) {
    conclusion = 'Likely local network or DNS egress problem. General DNS works, but MongoDB SRV lookup and TCP connectivity are blocked.';
  } else if (googleDns && googleDns.length > 0 && (!mongoSrv || mongoSrv.length === 0)) {
    conclusion = 'Likely MongoDB Atlas DNS/SRV resolution problem or blocked access to the Atlas DNS endpoint.';
  } else if (mongoSrv && mongoSrv.length > 0 && !tcp.ok) {
    conclusion = 'DNS is resolving MongoDB SRV records, but outbound TCP connectivity is blocked on this machine or network.';
  } else if (googleDns && mongoSrv && tcp.ok) {
    conclusion = 'Basic DNS and TCP checks passed. The MongoDB error is likely caused by the Atlas cluster, connection string, or a transient network/DNS issue specific to the MongoDB driver path.';
  }

  log('RESULT', `Final root-cause conclusion: ${conclusion}`);
}

main().catch((error) => {
  log('FATAL', `Unexpected failure: ${error.stack || error.message}`);
  process.exitCode = 1;
});
