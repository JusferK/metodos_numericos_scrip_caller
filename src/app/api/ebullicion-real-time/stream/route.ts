import { spawn } from 'child_process';
import path from 'path';

export async function GET(req: Request) {

    const url = new URL(req.url);
    const A = url.searchParams.get('A');
    const B = url.searchParams.get('B');
    const C = url.searchParams.get('C');
    const P2nd = url.searchParams.get('P2nd');

    if (!A || !B || !C || !P2nd) {
        return new Response('Missing parameters', { status: 400 });
    }

    const scriptPath: string = path.resolve('src', 'app', 'matlab', 'newton_raphson_antoine.m');

    const command = `A=${A}; B=${B}; C=${C}; P_deseada=${P2nd}; run('${scriptPath.replace(/\\/g, '/')}');`;
    const matlab = spawn('matlab', ['-batch', command]);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        start(controller) {
            const send = (data: string) => {
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            };

            matlab.stdout.on('data', (data) => {
                send(data.toString());
            });

            matlab.stderr.on('data', (data) => {
                send(`[stderr] ${data.toString()}`);
            });

            matlab.on('close', (code) => {
                send(`MATLAB finalizó con código ${code}`);
                controller.close();
            });
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
