from flask import Flask, render_template, request, jsonify
from agent import run_agent

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()

    user_input = data.get("question", "").strip()

    if not user_input:
        return jsonify({
            "status": "error",
            "message": "Please enter a calculation."
        })

    result = run_agent(user_input)

    return jsonify(result)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)