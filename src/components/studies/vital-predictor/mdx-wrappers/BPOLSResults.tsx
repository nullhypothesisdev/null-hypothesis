"use client";

import { OLS_RESULTS } from "@/data/studies/vital-predictor-data";
import OLSResults from "../OLSResults";

export default function BPOLSResults({ model, title }: { model: "initial" | "final", title: string }) {
    return <OLSResults data={OLS_RESULTS[model]} title={title} phase={model} />;
}
