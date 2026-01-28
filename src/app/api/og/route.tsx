import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const title = searchParams.get('title') || "The Null Hypothesis";
        const tagline = searchParams.get('tagline') || "";
        const category = searchParams.get('category') || undefined;
        const date = searchParams.get('date') || new Date().getFullYear().toString();

        // Try to fetch font from Google Fonts
        let fonts: string | any[] | undefined = [];
        try {
            const response = await fetch(
                'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400&display=swap',
                { headers: { 'User-Agent': 'Mozilla/5.0' } }
            );

            if (response.ok) {
                const css = await response.text();
                // Extract the actual font URL from CSS
                const fontUrlMatch = css.match(/url\((https:\/\/[^)]+\.ttf)\)/);

                if (fontUrlMatch) {
                    const fontResponse = await fetch(fontUrlMatch[1]);
                    const fontBuffer = await fontResponse.arrayBuffer();

                    fonts = [
                        {
                            name: 'EB Garamond',
                            data: fontBuffer,
                            weight: 400 as const,
                            style: 'normal' as const,
                        }
                    ];
                }
            }
        } catch (error) {
            console.error('Font fetching error:', error);
            // Continue without custom font
        }

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f5f2ed', // --paper-val (Cream)
                        // Scientific Graph Paper Grid (Dark Ink on Cream)
                        backgroundImage: `
                            linear-gradient(to right, rgba(26, 22, 20, 0.06) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(26, 22, 20, 0.06) 1px, transparent 1px),
                            linear-gradient(to right, rgba(26, 22, 20, 0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(26, 22, 20, 0.03) 1px, transparent 1px)
                        `,
                        backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
                        color: '#1a1614', // --ink-val (Dark)
                        fontFamily: fonts.length > 0 ? 'EB Garamond' : 'Georgia, serif',
                        position: 'relative',
                    }}
                >
                    {/* Abstract Statistical Curve (The "Null Hypothesis" Bell Curve) */}
                    <svg
                        height="400"
                        width="1200"
                        viewBox="0 0 1200 400"
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            opacity: 0.15, // Slightly clearer in light mode
                        }}
                    >
                        {/* Normal Distribution Curve Path */}
                        <path
                            d="M0,350 C200,350 350,350 450,250 C550,150 600,50 600,50 C600,50 650,150 750,250 C850,350 1000,350 1200,350 L1200,400 L0,400 Z"
                            fill="rgba(212, 119, 78, 0.15)" // Accent color fill
                            stroke="#d4774e"
                            strokeWidth="3"
                        />
                        {/* Mean Line */}
                        <line x1="600" y1="50" x2="600" y2="400" stroke="#d4774e" strokeWidth="2" strokeDasharray="12,12" />
                    </svg>

                    {/* Logo / Brand */}
                    <div style={{
                        position: 'absolute',
                        top: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '2px solid rgba(26, 22, 20, 0.1)', // Stronger divider
                        paddingBottom: 20,
                        width: '80%',
                    }}>
                        <span style={{
                            fontSize: 14,
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            color: '#756b5e',
                            fontFamily: 'monospace',
                            textTransform: 'uppercase'
                        }}>
                            FIG. {category?.toUpperCase() || 'DATA'}
                        </span>
                        <span style={{
                            fontSize: 14,
                            fontWeight: 600,
                            letterSpacing: '0.25em',
                            color: '#1a1614',
                            fontFamily: 'monospace',
                            textTransform: 'uppercase'
                        }}>
                            NØH | The Null Hypothesis
                        </span>
                    </div>

                    {/* Content Container */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '80%', textAlign: 'center', zIndex: 10 }}>

                        {/* Title */}
                        <div style={{
                            fontSize: 110, // Bold and Big
                            fontFamily: fonts.length > 0 ? 'EB Garamond' : 'Georgia, serif',
                            fontWeight: 500,
                            color: '#1a1614', // Jet Black
                            lineHeight: 0.9,
                            marginBottom: 20,
                            letterSpacing: '-0.04em',
                        }}>
                            {title}
                        </div>

                        {/* Tagline */}
                        {tagline && (
                            <div style={{
                                fontSize: 32,
                                color: '#4a4a4a', // Dark Gray
                                fontFamily: fonts.length > 0 ? 'EB Garamond' : 'Georgia, serif',
                                fontStyle: 'italic',
                                maxWidth: '900px',
                                lineHeight: 1.3,
                            }}>
                                {tagline}
                            </div>
                        )}
                    </div>

                    {/* Footer / Meta */}
                    <div style={{
                        position: 'absolute',
                        bottom: 40,
                        width: '80%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: 20,
                        borderTop: '2px solid rgba(26, 22, 20, 0.1)',
                        color: '#4a4a4a',
                        fontSize: 12,
                        fontFamily: 'monospace',
                        letterSpacing: '0.05em'
                    }}>
                        <span>nullhypothesis.dev</span>
                        <span>EST. {date}</span>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: fonts.length > 0 ? fonts : undefined,
            }
        );
    } catch (error) {
        console.error('Route error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}