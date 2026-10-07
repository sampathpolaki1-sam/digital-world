import sys
import json
import math
from explanations import generate_statistics_explanation

def calculate_statistics(data):
    try:
        dataset_x = data.get('dataset', [])
        
        if not dataset_x or len(dataset_x) == 0:
            return {"error": "Dataset X cannot be empty."}
            
        n = len(dataset_x)
        count = n
        sum_x = sum(dataset_x)
        mean_x = sum_x / n
        
        variance_x = sum((x - mean_x) ** 2 for x in dataset_x) / n
        std_dev_x = math.sqrt(variance_x)
        
        result = {
            "count": count,
            "mean": round(mean_x, 4),
            "variance": round(variance_x, 4),
            "std_dev": round(std_dev_x, 4),
            "explanation": generate_statistics_explanation()
        }
        
        dataset_y = data.get('dataset_y', [])
        
        if dataset_y and len(dataset_y) == n:
            sum_y = sum(dataset_y)
            mean_y = sum_y / n
            
            # Linear Regression: y = mx + c
            # m = sum((x - mean_x) * (y - mean_y)) / sum((x - mean_x)^2)
            
            numerator = sum((dataset_x[i] - mean_x) * (dataset_y[i] - mean_y) for i in range(n))
            denominator = sum((dataset_x[i] - mean_x) ** 2 for i in range(n))
            
            if denominator == 0:
                result["regression"] = {"error": "Cannot compute regression (X values are identical)"}
            else:
                slope = numerator / denominator
                intercept = mean_y - (slope * mean_x)
                
                regression_data = {
                    "slope": round(slope, 4),
                    "intercept": round(intercept, 4)
                }
                
                predict_x = data.get('predict_x')
                if predict_x is not None:
                    predicted_y = (slope * float(predict_x)) + intercept
                    regression_data["prediction"] = round(predicted_y, 4)
                    
                result["regression"] = regression_data
                result["explanation"] += "\nLinear Regression: Predicted Y using equation y = mx + c."
                
        return result
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        res = calculate_statistics(input_data)
        print(json.dumps(res))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
