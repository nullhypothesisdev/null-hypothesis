export function getLocalizedDifficulty(difficulty: string | undefined, t: (key: string) => string): string {
    if (!difficulty) return "";
    // DB returns "INTERMEDIATE", keys are "courses.intermediate"
    const key = difficulty.toLowerCase();
    // Return translation or fallback to title-cased difficulty
    return t(`courses.${key}`) || (difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase());
}
