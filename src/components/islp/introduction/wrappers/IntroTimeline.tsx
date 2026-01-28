"use client";

import HistoricalTimeline from "../HistoricalTimeline";
import ch1Data from "@/data/islp/ch1.json";
import { Chapter1Data } from "@/data/islp/types";

const data = ch1Data as unknown as Chapter1Data;

export default function IntroTimeline() {
    return (
        <div className="my-12">
            <HistoricalTimeline events={data.timeline} />
        </div>
    );
}
