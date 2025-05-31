import Liquidos from '../../../../db/liquids.json';

export const GET = () => {
    return new Response(JSON.stringify(Liquidos), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}