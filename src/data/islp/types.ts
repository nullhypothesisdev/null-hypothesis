export interface CaseStudy {
    id: string;
    title: string;
    dataset: string;
    status: "OPEN" | "PENDING" | "UNSOLVED" | "CLOSED";
    classification: string;
    briefing: string;
    investigation_points: string[];
    variables: {
        n: number;
        p: number;
        key_features: string[];
    };
}

export interface NotationEntry {
    symbol: string;
    definition: string;
    example: string;
    type: "Scalar" | "Matrix" | "Vector" | "Set" | "Function";
}

export interface NotationSystem {
    title: string;
    description: string;
    entries: NotationEntry[];
}

export interface TimelineEvent {
    era: string;
    event: string;
    architects: string[];
    impact: string;
    status: "FOUNDATIONAL" | "CRITICAL" | "STANDARD" | "UNIFYING" | "MODERN";
}

// ... keeping existing interfaces ...

export interface Chapter1Data {
    cases: CaseStudy[];
    notation: NotationSystem;
    timeline: TimelineEvent[];
}
