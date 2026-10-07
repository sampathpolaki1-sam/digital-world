import sys
import json
from explanations import generate_boolean_explanation

def evaluate_boolean(data):
    try:
        op = data.get('operation')
        
        if op == 'EXPRESSION':
            expr = data.get('expression', '').upper()
            # Basic validation/replacement for eval
            safe_expr = expr.replace(' AND ', ' and ').replace(' OR ', ' or ').replace(' NOT ', ' not ')
            safe_expr = safe_expr.replace('A', 'a_val').replace('B', 'b_val').replace('C', 'c_val')
            
            # Simple truth table generator for A,B,C
            truth_table = "A B C | Result\n"
            truth_table += "-" * 15 + "\n"
            for a_val in [0, 1]:
                for b_val in [0, 1]:
                    for c_val in [0, 1]:
                        try:
                            res = 1 if eval(safe_expr) else 0
                            truth_table += f"{a_val} {b_val} {c_val} | {res}\n"
                        except Exception:
                            return {"error": "Invalid expression syntax."}
            return {
                "result": "See truth table",
                "truth_table": truth_table,
                "explanation": generate_boolean_explanation(op, expression=expr)
            }
            
        else:
            a = int(data.get('a', 0))
            if op != 'NOT':
                b = int(data.get('b', 0))
                
            if op == 'AND':
                res = a and b
                tt = "A B | AND\n0 0 | 0\n0 1 | 0\n1 0 | 0\n1 1 | 1"
            elif op == 'OR':
                res = a or b
                tt = "A B | OR\n0 0 | 0\n0 1 | 1\n1 0 | 1\n1 1 | 1"
            elif op == 'XOR':
                res = a ^ b
                tt = "A B | XOR\n0 0 | 0\n0 1 | 1\n1 0 | 1\n1 1 | 0"
            elif op == 'NOT':
                res = int(not a)
                tt = "A | NOT\n0 | 1\n1 | 0"
            else:
                raise ValueError("Unknown operation")
                
            return {
                "result": res,
                "truth_table": tt,
                "explanation": generate_boolean_explanation(op, a, b if op != 'NOT' else None)
            }
            
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        res = evaluate_boolean(input_data)
        print(json.dumps(res))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
