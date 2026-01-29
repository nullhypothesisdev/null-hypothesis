import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://gefqshdrgozkxdiuligl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZnFzaGRyZ296a3hkaXVsaWdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzQ2ODI0MywiZXhwIjoyMDU5MDQ0MjQzfQ.4izUF5gnNueGzjfHkaCKA3PvBq9qbUCRyhxY9V4FgWM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TABLES = [
    'labs',
    'lab_content',
    'projects',
    'project_content',
    'courses',
    'course_chapters',
    'media',
    'ui_translations',
    'site_config',
    'pages'
];

async function inspectTable(tableName: string) {
    console.log(`\n=== INSPECTING TABLE: ${tableName} ===`);

    // Get count
    const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error(`Error fetching count/existence for ${tableName}:`, countError.message);
        return;
    }

    console.log(`Total Rows: ${count}`);

    if (count === 0) {
        console.log("No rows to inspect.");
        return;
    }

    // Get sample data
    const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(5);

    if (error) {
        console.error(`Error fetching data for ${tableName}:`, error.message);
        return;
    }

    if (!data || data.length === 0) return;

    // Analyze columns
    const columns = Object.keys(data[0]);
    console.log("Columns:", columns.join(", "));

    // Analyze usage (check for nulls/empty strings in sample)
    const usageStrats: Record<string, { used: number, nullOrEmpty: number, sample?: any }> = {};

    columns.forEach(col => {
        usageStrats[col] = { used: 0, nullOrEmpty: 0 };
    });

    data.forEach(row => {
        columns.forEach(col => {
            const val = row[col];
            if (val === null || val === undefined || val === "") {
                usageStrats[col].nullOrEmpty++;
            } else {
                usageStrats[col].used++;
                if (!usageStrats[col].sample) usageStrats[col].sample = val;
            }
        });
    });

    console.log("Column Usage (Sample of 5):");
    Object.entries(usageStrats).forEach(([col, stats]) => {
        const isSuspicious = stats.used === 0;
        const status = isSuspicious ? "⚠️  UNUSED/EMPTY" : "✅ Used";
        let sampleStr = JSON.stringify(stats.sample);
        if (sampleStr && sampleStr.length > 50) sampleStr = sampleStr.substring(0, 50) + "...";

        console.log(`- ${col.padEnd(20)}: ${status} (Null/Empty: ${stats.nullOrEmpty}/${data.length}) Sample: ${sampleStr}`);
    });
}

async function inspectAll() {
    for (const table of TABLES) {
        await inspectTable(table);
    }
}

inspectAll();
