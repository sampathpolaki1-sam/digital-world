import sys
import json
from explanations import generate_matrix_explanation

def calculate_matrices(data):
    try:
        op = data.get('operation')
        A = data.get('matrixA')
        
        if not A or not isinstance(A, list) or not isinstance(A[0], list):
            return {"error": "Matrix A must be a 2D array (list of lists)."}
            
        rows_A = len(A)
        cols_A = len(A[0])
        
        if op == 'transpose':
            result = [[A[j][i] for j in range(rows_A)] for i in range(cols_A)]
            return {
                "result": result,
                "explanation": generate_matrix_explanation(op, A)
            }
            
        B = data.get('matrixB')
        if not B or not isinstance(B, list) or not isinstance(B[0], list):
            return {"error": "Matrix B must be a 2D array for this operation."}
            
        rows_B = len(B)
        cols_B = len(B[0])
        
        if op in ['add', 'subtract']:
            if rows_A != rows_B or cols_A != cols_B:
                return {"error": f"Invalid dimensions for {op}. Matrices must be same size."}
                
            if op == 'add':
                result = [[A[i][j] + B[i][j] for j in range(cols_A)] for i in range(rows_A)]
            else:
                result = [[A[i][j] - B[i][j] for j in range(cols_A)] for i in range(rows_A)]
                
        elif op == 'multiply':
            if cols_A != rows_B:
                return {"error": f"Invalid dimensions for multiply. A is {rows_A}x{cols_A} and B is {rows_B}x{cols_B}."}
                
            result = [[0 for _ in range(cols_B)] for _ in range(rows_A)]
            for i in range(rows_A):
                for j in range(cols_B):
                    for k in range(cols_A):
                        result[i][j] += A[i][k] * B[k][j]
        else:
            return {"error": "Unknown matrix operation."}
            
        return {
            "result": result,
            "explanation": generate_matrix_explanation(op, A, B)
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        res = calculate_matrices(input_data)
        print(json.dumps(res))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
