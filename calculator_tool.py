import ast
import operator

# Allowed mathematical operations
OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Pow: operator.pow,
    ast.Mod: operator.mod,
}


def calculate(expression):
    """
    Safely evaluates a mathematical expression.
    """

    try:
        tree = ast.parse(expression, mode="eval")

        def evaluate(node):
            if isinstance(node, ast.Expression):
                return evaluate(node.body)

            if isinstance(node, ast.Constant):
                if isinstance(node.value, (int, float)):
                    return node.value

            if isinstance(node, ast.BinOp):
                left = evaluate(node.left)
                right = evaluate(node.right)

                operation = OPERATORS.get(type(node.op))

                if operation is None:
                    raise ValueError("Unsupported operator")

                return operation(left, right)

            if isinstance(node, ast.UnaryOp):
                value = evaluate(node.operand)

                if isinstance(node.op, ast.USub):
                    return -value

                if isinstance(node.op, ast.UAdd):
                    return value

            raise ValueError("Invalid expression")

        result = evaluate(tree)

        return {
            "status": "success",
            "expression": expression,
            "result": result
        }

    except Exception as e:
        return {
            "status": "error",
            "expression": expression,
            "result": None,
            "message": str(e)
        }