from calculator_tool import calculate


def run_agent(user_input):
    """
    Single-tool agent.
    Uses the Calculator tool to process mathematical questions.
    """

    expression = user_input.strip()

    # Call the single external tool
    tool_result = calculate(expression)

    # Return a structured answer
    if tool_result["status"] == "success":
        return {
            "question": user_input,
            "tool_used": "Calculator",
            "answer": tool_result["result"],
            "status": "success"
        }

    return {
        "question": user_input,
        "tool_used": "Calculator",
        "answer": None,
        "status": "error",
        "message": tool_result.get("message", "Invalid calculation")
    }