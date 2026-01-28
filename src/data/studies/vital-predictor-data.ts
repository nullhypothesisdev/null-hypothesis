
export const BP_DATA = [
    { pt: 1, bp: 105, age: 47, weight: 85.4, bsa: 1.75, dur: 5.1, pulse: 63, stress: 33 },
    { pt: 2, bp: 115, age: 49, weight: 94.2, bsa: 2.10, dur: 3.8, pulse: 70, stress: 14 },
    { pt: 3, bp: 116, age: 49, weight: 95.3, bsa: 1.98, dur: 8.2, pulse: 72, stress: 10 },
    { pt: 4, bp: 117, age: 50, weight: 94.7, bsa: 2.01, dur: 5.8, pulse: 73, stress: 99 },
    { pt: 5, bp: 112, age: 51, weight: 89.4, bsa: 1.89, dur: 7.0, pulse: 72, stress: 95 },
    { pt: 6, bp: 121, age: 48, weight: 99.5, bsa: 2.25, dur: 9.3, pulse: 71, stress: 10 },
    { pt: 7, bp: 121, age: 49, weight: 99.8, bsa: 2.25, dur: 2.5, pulse: 69, stress: 42 },
    { pt: 8, bp: 110, age: 47, weight: 90.9, bsa: 1.90, dur: 6.2, pulse: 66, stress: 8 },
    { pt: 9, bp: 110, age: 49, weight: 89.2, bsa: 1.83, dur: 7.1, pulse: 69, stress: 62 },
    { pt: 10, bp: 114, age: 48, weight: 92.7, bsa: 2.07, dur: 5.6, pulse: 64, stress: 35 },
    { pt: 11, bp: 114, age: 47, weight: 94.4, bsa: 2.07, dur: 5.3, pulse: 74, stress: 90 },
    { pt: 12, bp: 115, age: 49, weight: 94.1, bsa: 1.98, dur: 5.6, pulse: 71, stress: 21 },
    { pt: 13, bp: 114, age: 50, weight: 91.6, bsa: 2.05, dur: 10.2, pulse: 68, stress: 47 },
    { pt: 14, bp: 106, age: 45, weight: 87.1, bsa: 1.92, dur: 5.6, pulse: 67, stress: 80 },
    { pt: 15, bp: 125, age: 52, weight: 101.3, bsa: 2.19, dur: 10.0, pulse: 76, stress: 98 },
    { pt: 16, bp: 114, age: 46, weight: 94.5, bsa: 1.98, dur: 7.4, pulse: 69, stress: 95 },
    { pt: 17, bp: 106, age: 46, weight: 87.0, bsa: 1.87, dur: 3.6, pulse: 62, stress: 18 },
    { pt: 18, bp: 113, age: 46, weight: 94.5, bsa: 1.90, dur: 4.3, pulse: 70, stress: 12 },
    { pt: 19, bp: 110, age: 48, weight: 90.5, bsa: 1.88, dur: 9.0, pulse: 71, stress: 99 },
    { pt: 20, bp: 122, age: 56, weight: 95.7, bsa: 2.09, dur: 7.0, pulse: 75, stress: 99 }
];

export const DESCRIPTIVE_STATS = {
    bp: { mean: 114.0, std: 5.43, min: 105, q1: 110.0, median: 114.0, q3: 116.25, max: 125 },
    age: { mean: 48.6, std: 2.50, min: 45, q1: 47.0, median: 48.5, q3: 49.25, max: 56 },
    weight: { mean: 93.09, std: 4.29, min: 85.4, q1: 90.23, median: 94.15, q3: 94.85, max: 101.3 },
    bsa: { mean: 1.998, std: 0.136, min: 1.75, q1: 1.90, median: 1.98, q3: 2.08, max: 2.25 },
    dur: { mean: 6.43, std: 2.15, min: 2.5, q1: 5.25, median: 6.0, q3: 7.60, max: 10.2 },
    pulse: { mean: 69.6, std: 3.80, min: 62, q1: 67.75, median: 70.0, q3: 72.0, max: 76 },
    stress: { mean: 53.35, std: 37.09, min: 8, q1: 17.0, median: 44.5, q3: 95.0, max: 99 }
};

export const CORRELATION_MATRIX = [
    { variable: 'BP', BP: 1.0, Age: 0.659, Weight: 0.950, BSA: 0.866, Dur: 0.293, Pulse: 0.721, Stress: 0.164 },
    { variable: 'Age', BP: 0.659, Age: 1.0, Weight: 0.407, BSA: 0.378, Dur: 0.344, Pulse: 0.619, Stress: 0.368 },
    { variable: 'Weight', BP: 0.950, Age: 0.407, Weight: 1.0, BSA: 0.875, Dur: 0.201, Pulse: 0.659, Stress: 0.034 },
    { variable: 'BSA', BP: 0.866, Age: 0.378, BSA: 1.0, Weight: 0.875, Dur: 0.131, Pulse: 0.465, Stress: 0.018 },
    { variable: 'Dur', BP: 0.293, Age: 0.344, Weight: 0.201, BSA: 0.131, Dur: 1.0, Pulse: 0.402, Stress: 0.312 },
    { variable: 'Pulse', BP: 0.721, Age: 0.619, Weight: 0.659, BSA: 0.465, Dur: 0.402, Pulse: 1.0, Stress: 0.506 },
    { variable: 'Stress', BP: 0.164, Age: 0.368, Weight: 0.034, BSA: 0.018, Dur: 0.312, Pulse: 0.506, Stress: 1.0 }
];

export const VIF_DATA = {
    before: [
        { feature: "Weight", vif: 8.42, status: "danger" },
        { feature: "BSA", vif: 5.33, status: "warning" },
        { feature: "Pulse", vif: 4.41, status: "safe" },
        { feature: "Age", vif: 1.76, status: "safe" },
        { feature: "Stress", vif: 1.83, status: "safe" },
        { feature: "Dur", vif: 1.24, status: "safe" },
    ],
    after: [
        { feature: "Pulse", vif: 2.36, status: "safe" },
        { feature: "Age", vif: 1.70, status: "safe" },
        { feature: "Stress", vif: 1.50, status: "safe" },
        { feature: "BSA", vif: 1.43, status: "safe" },
        { feature: "Dur", vif: 1.24, status: "safe" },
    ]
}

export const OLS_RESULTS = {
    initial: {
        r2: 0.926,
        adjR2: 0.900,
        fStat: 35.14,
        aic: 83.27,
        bic: 89.25,
        coefficients: [
            { name: "const", coef: 114.0000, stdErr: 0.384, t: 296.731, p: 0.000, conf: [113.176, 114.824] },
            { name: "Age", coef: 1.4077, stdErr: 0.514, t: 2.737, p: 0.016, conf: [0.304, 2.511] },
            { name: "BSA", coef: 3.3512, stdErr: 0.471, t: 7.114, p: 0.000, conf: [2.341, 4.362] },
            { name: "Dur", coef: 0.1648, stdErr: 0.438, t: 0.376, p: 0.713, conf: [-0.776, 1.105], status: "remove" },
            { name: "Pulse", coef: 1.7359, stdErr: 0.606, t: 2.866, p: 0.012, conf: [0.437, 3.035] },
            { name: "Stress", coef: -0.6206, stdErr: 0.483, t: -1.284, p: 0.220, conf: [-1.657, 0.416], status: "remove" }
        ]
    },
    final: {
        r2: 0.917,
        adjR2: 0.902,
        fStat: 59.08,
        aic: 81.57,
        bic: 85.56,
        durbinWatson: 2.420,
        jarqueBera: 0.641,
        coefficients: [
            { name: "const", coef: 114.0000, stdErr: 0.381, t: 299.488, p: 0.000, conf: [113.193, 114.807] },
            { name: "Age", coef: 1.3535, stdErr: 0.501, t: 2.699, p: 0.016, conf: [0.290, 2.416] },
            { name: "BSA", coef: 3.5173, stdErr: 0.445, t: 7.906, p: 0.000, conf: [2.574, 4.460] },
            { name: "Pulse", coef: 1.4441, stdErr: 0.524, t: 2.755, p: 0.014, conf: [0.333, 2.555] }
        ]
    }
};

export const DIAGNOSTICS = {
    shapiro: { statistic: 0.9625, pValue: 0.596, result: "Normal" },
    anova: {
        f: 59.08,
        p: 7.10e-09,
        table: [
            { source: "Age", sumSq: 21.11, df: 1, meanSq: 21.11, f: 7.28, p: 0.0158 },
            { source: "BSA", sumSq: 181.13, df: 1, meanSq: 181.13, f: 62.51, p: 0.0000006 },
            { source: "Pulse", sumSq: 21.99, df: 1, meanSq: 21.99, f: 7.59, p: 0.0141 },
            { source: "Residual", sumSq: 46.37, df: 16, meanSq: 2.90, f: null, p: null }
        ]
    }
};

export const CODE_SNIPPETS = {
    inspection: `import pandas as pd

# Load the dataset
data = pd.read_table('bloodpress.txt')
data2 = data.drop(columns=['Pt'])

# Inspect summary statistics
desc = data2.describe()
print(desc)`,
    visualization: `import seaborn as sns
import matplotlib.pyplot as plt

# Pairplot with Kernel Density Estimation (KDE)
sns.pairplot(data2, diag_kind='kde')
plt.show()`,
    correlation: `import numpy as np
import seaborn as sns
from statsmodels.stats.outliers_influence import variance_inflation_factor

# 1. Correlation Matrix
correlation = data2.corr()
mask = np.triu(np.ones_like(correlation, dtype=bool))
sns.heatmap(correlation, mask=mask, annot=True)

# 2. VIF Check (Example Logic)
def check_vif(X):
    vif_data = pd.DataFrame()
    vif_data["feature"] = X.columns
    vif_data["VIF"] = [variance_inflation_factor(X.values, i) for i in range(X.shape[1])]
    return vif_data`,
    tuning: `import statsmodels.api as sm

# 1. Standardize Predictors
df_scaled = data2.copy()
features = ['Age', 'Weight', 'BSA', 'Dur', 'Pulse', 'Stress']
df_scaled[features] = (df_scaled[features] - df_scaled[features].mean()) / df_scaled[features].std()

# 2. Backward Elimination (Drop insignificant variables)
X_final = df_scaled.drop(['BP', 'Weight', 'Dur', 'Stress'], axis=1)
X_final = sm.add_constant(X_final)

# 3. Fit Final Model
final_model = sm.OLS(y, X_final).fit()
print(final_model.summary())`,
    anova: `import statsmodels.formula.api as smf
from statsmodels.stats.anova import anova_lm

# Re-fit using formula API for ANOVA
formula_model = smf.ols(formula='BP ~ Age + BSA + Pulse', data=df_scaled).fit()
anova_results = anova_lm(formula_model, typ=2)
print(anova_results)`,
    diagnostics: `# Residual Analysis
residuals = final_model.resid
fitted_vals = final_model.fittedvalues

# 1. Residuals vs Fitted Plot
sns.scatterplot(x=fitted_vals, y=residuals)

# 2. Shapiro-Wilk Test for Normality
from scipy import stats
stat, p_value = stats.shapiro(residuals)
print(f"P-value: {p_value:.4f}")`,
    production: `import json

# 1. Extract Coefficients
coefficients = final_model.params.to_dict()

# 2. Extract Scaling Parameters
# We need the original Mean and Std to scale user input
features_kept = ['Age', 'BSA', 'Pulse']
scaling_params = df_scaled[features_kept].agg(['mean', 'std']).to_dict()

# 3. Construct Export Object
model_config = {
    "model_metadata": {
        "r_squared": round(final_model.rsquared, 4),
        "target": "Blood Pressure (mmHg)",
        "features": features_kept
    },
    "coefficients": coefficients,
    "scaling": scaling_params
}

# 4. Save to JSON for Frontend Usage
with open('bp_model_config.json', 'w') as f:
    json.dump(model_config, f, indent=4)`
};
