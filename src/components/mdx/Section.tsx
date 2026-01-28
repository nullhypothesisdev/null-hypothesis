
import { ReactNode } from "react";

export default function Section({ children }: { children: ReactNode }) {
    return <section className="mb-24 last:mb-0">{children}</section>;
}
