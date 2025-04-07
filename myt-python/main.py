import sys
import json
import traceback

def add(a, b):
    try:
        return a + b
    except Exception as e:
        return {"error": f"Addition failed: {str(e)}"}

def subtract(a, b):
    try:
        return a - b
    except Exception as e:
        return {"error": f"Subtraction failed: {str(e)}"}

def main():
    try:
        # 从命令行参数获取输入
        if len(sys.argv) != 4:
            print(json.dumps({"error": "Invalid arguments. Usage: <operation> <number1> <number2>"}))
            sys.exit(1)
        
        operation = sys.argv[1]
        try:
            a = float(sys.argv[2])
            b = float(sys.argv[3])
        except ValueError:
            print(json.dumps({"error": "Invalid numbers. Please provide valid numbers."}))
            sys.exit(1)
        
        result = None
        if operation == "add":
            result = add(a, b)
        elif operation == "subtract":
            result = subtract(a, b)
        else:
            print(json.dumps({"error": f"Invalid operation: {operation}. Valid operations are 'add' and 'subtract'."}))
            sys.exit(1)
        
        # 检查结果是否包含错误
        if isinstance(result, dict) and "error" in result:
            print(json.dumps(result))
            sys.exit(1)
        
        # 输出JSON格式的结果
        print(json.dumps({"result": result}))
        sys.exit(0)
        
    except Exception as e:
        # 捕获所有未处理的异常
        error_info = {
            "error": "Internal error occurred",
            "message": str(e),
            "traceback": traceback.format_exc()
        }
        print(json.dumps(error_info))
        sys.exit(1)

if __name__ == "__main__":
    main() 