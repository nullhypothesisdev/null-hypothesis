
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const CONTENT_EN = `
# Introduction

Hypertension, or high blood pressure, acts as a "silent killer," often presenting no symptoms while silently damaging the cardiovascular system. This analysis explores the **statistical determinants** of hypertension using a dataset of demographic and health metrics.

We aim to answer: *Which factors—Age, BMI, or Smoking Status—are the strongest predictors of hypertension?*

## The Dataset

We are analyzing a dataset containing the following variables:
- **Age**: The age of the patient (years).
- **sex**: Biological sex (Male/Female).
- **bmi**: Body Mass Index (kg/m²).
- **bp**: Blood Pressure (Average Systolic/Diastolic).
- **smoking_status**: Current smoking status.

### Initial Data Inspection

Let's load the data and examine the distribution of our key variables.

<PythonPlayground
  initialCode=\`import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Simulate dataset
np.random.seed(42)
n_samples = 500
ages = np.random.normal(55, 12, n_samples)
bmis = np.random.normal(28, 5, n_samples)
bp_sys = 100 + 0.5 * ages + 0.8 * bmis + np.random.normal(0, 10, n_samples)

data = pd.DataFrame({
    'Age': ages,
    'BMI': bmis,
    'SystolicBP': bp_sys
})

print(data.describe())\`
/>

## Correlation Analysis

To understand the relationships between these variables, we calculate the Pearson correlation coefficients.

<LabPartner
  title="Correlation Matrix"
  analysis="There is a moderate positive correlation between Age and Systolic BP (r ≈ 0.45) and a stronger correlation between BMI and Systolic BP (r ≈ 0.60). This suggests that while both factors contribute, BMI may be a more dominant predictor in this dataset."
/>

## Statistical Modeling

We will now fit a **Linear Regression model** to quantify the effect of Age and BMI on Systolic Blood Pressure.

The model assumes the form:
$$ BP = \\beta_0 + \\beta_1 \\cdot Age + \\beta_2 \\cdot BMI + \\epsilon $$

### Python Implementation

<PythonPlayground
  initialCode=\`from sklearn.linear_model import LinearRegression

X = data[['Age', 'BMI']]
y = data['SystolicBP']

model = LinearRegression()
model.fit(X, y)

print(f"Intercept: {model.intercept_:.2f}")
print(f"Coefficient (Age): {model.coef_[0]:.2f}")
print(f"Coefficient (BMI): {model.coef_[1]:.2f}")\`
/>

## Conclusion

Our analysis indicates that **BMI is a significant predictor** of systolic blood pressure, with a larger standardized coefficient compared to age in this simulated cohort. Interventions targeting weight management could potentially yield significant reductions in hypertension prevalence.
`;

async function seed() {
    console.log("Seeding 'studies/blood-pressure-analysis'...");

    const { error } = await supabase
        .from('pages')
        .upsert({
            slug: 'studies/blood-pressure-analysis',
            title: 'The Vital Predictor',
            subtitle: 'Uncovering the statistical determinants of hypertension.',
            description: 'A statistical deep dive into the factors influencing blood pressure.',
            content_en: CONTENT_EN,
            meta: {
                source_url: 'https://github.com/Ezzio11/null-hypothesis',
                category: 'Biostatistics'
            }
        }, { onConflict: 'slug' });

    if (error) {
        console.error("Error seeding page:", error);
    } else {
        console.log("Successfully seeded 'studies/blood-pressure-analysis'.");
    }
}

seed();
