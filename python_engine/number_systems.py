import sys
import json
from explanations import generate_number_system_explanation

def convert_number(num_str, from_base, to_base):
    try:
        from_base = int(from_base)
        to_base = int(to_base)
        
        # Convert to decimal first
        decimal_val = int(num_str, from_base)
        
        # Convert decimal to target base
        if to_base == 10:
            result = str(decimal_val)
        elif to_base == 2:
            result = bin(decimal_val)[2:]
        elif to_base == 16:
            result = hex(decimal_val)[2:].upper()
        else:
            raise ValueError(f"Unsupported target base: {to_base}")
            
        explanation = generate_number_system_explanation(num_str, from_base, decimal_val, to_base, result)
        
        return {
            "result": result,
            "explanation": explanation
        }
    except ValueError as e:
        return {"error": "Invalid input for the specified base."}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        res = convert_number(input_data['input'], input_data['fromBase'], input_data['toBase'])
        print(json.dumps(res))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
