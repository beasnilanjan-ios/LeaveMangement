type ApiLogType = 'request' | 'response' | 'error';

function generateId() {
    return `req-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function maskAuth(headers: Record<string, any>) {
    const out: Record<string, any> = { ...headers };
    if (out.Authorization) {
        out.Authorization = 'Bearer ********';
    }
    return out;
}

export function createRequestId() {
    return generateId();
}

export function logApi(opts: {
    id: string;
    type: ApiLogType;
    timestamp?: string;
    method?: string;
    url?: string;
    headers?: Record<string, any>;
    body?: any;
    status?: number;
    ok?: boolean;
    durationMs?: number;
    error?: any;
}) {
    const entry = {
        id: opts.id,
        type: opts.type,
        timestamp: opts.timestamp || new Date().toISOString(),
        method: opts.method,
        url: opts.url,
        headers: opts.headers ? maskAuth(opts.headers) : undefined,
        body: opts.body,
        status: opts.status,
        ok: opts.ok,
        durationMs: opts.durationMs,
        error: opts.error ? (typeof opts.error === 'string' ? opts.error : String(opts.error)) : undefined,
    };

    try {
        // Single-line JSON for easier synchronized parsing
        console.log(JSON.stringify(entry));
    } catch (e) {
        console.log('ApiLogger error serializing log', e);
    }
}

export default {
    createRequestId,
    logApi,
};
