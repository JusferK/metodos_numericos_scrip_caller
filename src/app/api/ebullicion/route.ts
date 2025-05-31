import { exec } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';

const execPromise = promisify(exec);

export interface RequestBody {
    A: number;
    B: number;
    C: number;
    P2nd: number;
}

export const POST = async (request: Request) => {
    try {
        const { A, B, C, P2nd } = await request.json() as RequestBody;

        const scriptPath: string = path.resolve('src', 'app', 'matlab', 'newton_raphson_antoine.m');
        const command = `matlab -batch "A=${A}; B=${B}; C=${C}; P_deseada=${P2nd}; run('${scriptPath}');"`;

        const { stdout } = await execPromise(command);
        return new Response(JSON.stringify({ output: stdout }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
