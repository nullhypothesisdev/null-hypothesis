"use client";

import CaseStudyGrid from "../CaseStudyGrid";
import ch1Data from "@/data/islp/ch1.json";
import { Chapter1Data } from "@/data/islp/types";

const data = ch1Data as unknown as Chapter1Data;

export default function IntroCaseStudies() {
    return (
        <div className="my-10">
            <CaseStudyGrid cases={data.cases} />
        </div>
    );
}
