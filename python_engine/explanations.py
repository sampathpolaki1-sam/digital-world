def generate_number_system_explanation(num_str, from_base, decimal_val, to_base, result):
    steps = f"Conversion from Base {from_base} to Base {to_base}:\n\n"
    
    if from_base != 10:
        steps += f"Step 1: Convert {num_str} (Base {from_base}) to Decimal (Base 10)\n"
        steps += f"Using positional notation: Σ(d_i × {from_base}^i)\n"
        steps += f"= {decimal_val} (Base 10)\n\n"
    
    if to_base != 10:
        step_num = 2 if from_base != 10 else 1
        steps += f"Step {step_num}: Convert {decimal_val} (Base 10) to Base {to_base}\n"
        steps += f"Repeated division by {to_base} until quotient is 0.\n"
        steps += f"The remainders read bottom-to-top give: {result} (Base {to_base})\n"
        
    return steps

def generate_boolean_explanation(operation, a=None, b=None, expression=None):
    if expression:
        return f"Evaluated custom expression: {expression}"
    elif operation == 'NOT':
        return f"NOT {a} = {1 if a == 0 else 0}\nInverts the input."
    else:
        return f"{a} {operation} {b}\nChecks the logic gate truth table for {operation}."
        
def generate_matrix_explanation(op, a, b=None):
    if op == 'transpose':
        return "Transpose (A^T): Swapped rows and columns."
    elif op == 'add':
        return "Matrix Addition (A + B): Added corresponding elements (A[i][j] + B[i][j])."
    elif op == 'subtract':
        return "Matrix Subtraction (A - B): Subtracted corresponding elements (A[i][j] - B[i][j])."
    elif op == 'multiply':
        return "Matrix Multiplication (A * B): Computed dot product of rows of A and columns of B.\nRule: If A is m×n and B is n×p, AB is m×p."
    return ""

def generate_statistics_explanation():
    return "Mean: x̄ = Σx/n\nPopulation variance: σ² = Σ(x−x̄)²/n\nStandard deviation: σ = √σ²"
