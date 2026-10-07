import sys
import json
import math
import random

def get_percentile(data, p):
    n = len(data)
    if n == 0: return 0
    k = (n - 1) * p
    f = math.floor(k)
    c = math.ceil(k)
    if f == c: return data[int(k)]
    return data[int(f)] * (c - k) + data[int(c)] * (k - f)

def profiler(payload):
    data = payload.get('data', [])
    if not data: return {"error": "No data"}
    data = sorted(data)
    n = len(data)
    mean = sum(data) / n
    variance = sum((x - mean)**2 for x in data) / n
    std_dev = math.sqrt(variance)
    median = get_percentile(data, 0.5)
    q1 = get_percentile(data, 0.25)
    q3 = get_percentile(data, 0.75)
    iqr = q3 - q1
    
    # Skewness
    skewness = sum((x - mean)**3 for x in data) / (n * std_dev**3) if std_dev > 0 else 0
    # Kurtosis
    kurtosis = sum((x - mean)**4 for x in data) / (n * std_dev**4) if std_dev > 0 else 0

    return {
        "mean": round(mean, 2), "median": round(median, 2), "variance": round(variance, 2),
        "std_dev": round(std_dev, 2), "skewness": round(skewness, 2), "kurtosis": round(kurtosis, 2),
        "iqr": round(iqr, 2),
        "explanation": f"Calculated descriptive statistics for N={n}. An IQR of {round(iqr, 2)} helps identify outliers. Positive skew indicates tail to the right."
    }

def bayesian(payload):
    prior = float(payload.get('prior', 0))
    tpr = float(payload.get('tpr', 0))
    fpr = float(payload.get('fpr', 0))
    
    # P(Alert) = P(Alert|Fraud)*P(Fraud) + P(Alert|Not Fraud)*P(Not Fraud)
    p_alert = (tpr * prior) + (fpr * (1 - prior))
    
    # P(Fraud | Alert)
    if p_alert == 0:
        posterior = 0
    else:
        posterior = (tpr * prior) / p_alert
        
    return {
        "posterior": round(posterior, 4),
        "p_alert": round(p_alert, 4),
        "explanation": f"Using Bayes Theorem:\nP(Fraud|Alert) = ({tpr} * {prior}) / {p_alert} = {round(posterior, 4)}"
    }

def distributions(payload):
    lam = float(payload.get('lambda', 1))
    k = int(payload.get('k', 1))
    
    # Poisson: (lam^k * e^-lam) / k!
    poisson_prob = (math.pow(lam, k) * math.exp(-lam)) / math.factorial(k)
    
    return {
        "poisson_prob": round(poisson_prob, 4),
        "explanation": f"Poisson: The probability of exactly {k} requests when average is {lam} is {round(poisson_prob * 100, 2)}%."
    }

def ab_testing(payload):
    group_a = payload.get('group_a', [])
    group_b = payload.get('group_b', [])
    
    if len(group_a) < 2 or len(group_b) < 2: return {"error": "Need at least 2 samples per group"}
    
    mean_a = sum(group_a)/len(group_a)
    mean_b = sum(group_b)/len(group_b)
    
    var_a = sum((x - mean_a)**2 for x in group_a) / (len(group_a)-1)
    var_b = sum((x - mean_b)**2 for x in group_b) / (len(group_b)-1)
    
    se = math.sqrt((var_a/len(group_a)) + (var_b/len(group_b)))
    if se == 0: z_score = 0
    else: z_score = (mean_b - mean_a) / se
    
    significant = abs(z_score) > 1.96 # 95% confidence
    
    return {
        "mean_a": round(mean_a, 4), "mean_b": round(mean_b, 4),
        "z_score": round(z_score, 4), "significant": significant,
        "explanation": f"Z-Score is {round(z_score, 4)}. Since |Z| {' > ' if significant else ' < '} 1.96, the difference is {'statistically significant' if significant else 'NOT statistically significant'} at 95% confidence."
    }

def regression(payload):
    x = payload.get('x', [])
    y = payload.get('y', [])
    predict_x = payload.get('predict_x')
    
    n = len(x)
    if n == 0 or len(y) != n: return {"error": "X and Y must be same length"}
    
    mean_x, mean_y = sum(x)/n, sum(y)/n
    numerator = sum((x[i] - mean_x) * (y[i] - mean_y) for i in range(n))
    denominator = sum((x[i] - mean_x) ** 2 for i in range(n))
    
    if denominator == 0: return {"error": "Denominator is zero"}
    slope = numerator / denominator
    intercept = mean_y - (slope * mean_x)
    
    # R^2
    ss_tot = sum((y[i] - mean_y)**2 for i in range(n))
    ss_res = sum((y[i] - (slope*x[i] + intercept))**2 for i in range(n))
    r_squared = 1 - (ss_res / ss_tot) if ss_tot > 0 else 1
    
    res = {
        "slope": round(slope, 4), "intercept": round(intercept, 4), "r_squared": round(r_squared, 4),
        "explanation": f"OLS Regression: y = {round(slope, 4)}x + {round(intercept, 4)}. R² = {round(r_squared, 4)}"
    }
    
    if predict_x is not None:
        pred_y = slope * float(predict_x) + intercept
        res["prediction"] = round(pred_y, 4)
        res["explanation"] += f"\nPredicted Revenue for x={predict_x} is {round(pred_y, 4)}"
        
    return res

def monte_carlo(payload):
    n = int(payload.get('n', 1000))
    p = float(payload.get('p', 0.05))
    
    failures = 0
    for _ in range(n):
        if random.random() < p:
            failures += 1
            
    simulated_p = failures / n
    error_margin = abs(simulated_p - p)
    
    return {
        "simulated_p": round(simulated_p, 4),
        "failures": failures,
        "explanation": f"Ran {n} simulations. Expected P(Fail) = {p}. Simulated P(Fail) = {round(simulated_p, 4)}.\nAccording to Law of Large Numbers (LLN), as N gets larger, Simulated P approaches Expected P.\nError margin: {round(error_margin, 4)}"
    }

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        module = input_data.get('module')
        
        if module == "profiler": print(json.dumps(profiler(input_data)))
        elif module == "bayesian": print(json.dumps(bayesian(input_data)))
        elif module == "distributions": print(json.dumps(distributions(input_data)))
        elif module == "ab_testing": print(json.dumps(ab_testing(input_data)))
        elif module == "regression": print(json.dumps(regression(input_data)))
        elif module == "monte_carlo": print(json.dumps(monte_carlo(input_data)))
        else: print(json.dumps({"error": "Unknown module"}))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
