
export const dynamic = 'force-dynamic';

export default function Page() {
    return (
        <div style={{ padding: 50, background: 'red', color: 'white', fontSize: 30 }}>
            <h1>DEPLOYMENT VERIFICATION</h1>
            <p>Commit Hash: {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "Unknown"}</p>
            <p>Time: {new Date().toISOString()}</p>
        </div>
    );
}
