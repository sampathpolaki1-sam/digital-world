import sys
import json

def calculate_crypto(data):
    try:
        msg = data.get('message', '').upper()
        key = int(data.get('key', 3))
        
        if not msg.isalpha():
            return {"error": "Message must contain only alphabetical characters for this educational demo."}
            
        encrypted = ""
        explanation = f"Caesar Cipher Encryption with key k = {key}\n"
        explanation += "Formula: E(x) = (x + k) mod 26\n\n"
        
        for char in msg:
            x = ord(char) - 65
            e_x = (x + key) % 26
            enc_char = chr(e_x + 65)
            encrypted += enc_char
            explanation += f"'{char}' -> x={x} -> ({x} + {key}) mod 26 = {e_x} -> '{enc_char}'\n"
            
        return {
            "encrypted": encrypted,
            "explanation": explanation
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        res = calculate_crypto(input_data)
        print(json.dumps(res))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
