import sys
import json

def calculate_error(data):
    try:
        binary_data = data.get('data', '')
        error_index = data.get('error_index')
        
        if not all(bit in ['0', '1'] for bit in binary_data):
            return {"error": "Data must be a binary string."}
            
        # Calculate Even Parity
        ones_count = binary_data.count('1')
        parity_bit = '0' if ones_count % 2 == 0 else '1'
        
        transmitted = binary_data + parity_bit
        received = transmitted
        
        explanation = f"1. Original Data: {binary_data}\n"
        explanation += f"2. Count of '1's: {ones_count}\n"
        explanation += f"3. Even Parity Bit Calculated: P = {parity_bit} (to make total '1's even)\n"
        explanation += f"4. Transmitted Data (Data + P): {transmitted}\n\n"
        
        if error_index is not None and 0 <= error_index < len(transmitted):
            # Inject Error
            bit_list = list(transmitted)
            bit_list[error_index] = '1' if bit_list[error_index] == '0' else '0'
            received = "".join(bit_list)
            explanation += f"--- ERROR INJECTED at index {error_index} ---\n\n"
            
        explanation += f"5. Received Data: {received}\n"
        
        # Check Parity on Received Data
        received_ones = received.count('1')
        is_valid = received_ones % 2 == 0
        
        explanation += f"6. Receiver checks total '1's: {received_ones}\n"
        explanation += f"7. Receiver Even Parity Check: {received_ones} mod 2 = {received_ones % 2}\n"
        
        if is_valid:
            explanation += "Result: SUCCESS (No errors detected)\n"
        else:
            explanation += "Result: FAILURE (XOR sum != 0). Error detected in transmission!\n"
            
        return {
            "transmitted": transmitted,
            "received": received,
            "isValid": is_valid,
            "explanation": explanation
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        res = calculate_error(input_data)
        print(json.dumps(res))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
