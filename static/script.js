let historyData =
    JSON.parse(localStorage.getItem("agentHistory")) || [];

let favorites =
    JSON.parse(localStorage.getItem("agentFavorites")) || [];


function updateTime() {

    const now = new Date();

    document.getElementById("time")
        .textContent =
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
}

setInterval(updateTime, 1000);
updateTime();


function toggleSidebar() {

    document
        .getElementById("sidebar")
        .classList.toggle("show");

}


function focusCalculator() {

    document
        .getElementById("calculator")
        .scrollIntoView({
            behavior: "smooth"
        });

    document
        .getElementById("question")
        .focus();
}


function setExample(value) {

    document
        .getElementById("question")
        .value = value;

}


function askAgent() {

    const question =
        document
        .getElementById("question")
        .value
        .trim();

    if (!question) {

        alert("Please enter a calculation.");

        return;
    }


    const button =
        document.getElementById("runButton");

    button.disabled = true;

    button.innerHTML =
        "⏳ Agent Processing...";


    const startTime = performance.now();


    fetch("/ask", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            question: question
        })

    })

    .then(response => response.json())

    .then(data => {

        const endTime =
            performance.now();

        const time =
            ((endTime - startTime) / 1000)
            .toFixed(2);


        if (data.status === "success") {

            document
                .getElementById("resultQuestion")
                .textContent =
                data.question || question;


            document
                .getElementById("resultTool")
                .textContent =
                "🧮 " +
                (data.tool_used || "Calculator");


            document
                .getElementById("resultAnswer")
                .textContent =
                data.answer;


            document
                .getElementById("responseTime")
                .textContent =
                "⚡ " + time + "s";


            addHistory(
                question,
                data.answer,
                time
            );

        }

        else {

            alert(
                data.message ||
                "Something went wrong."
            );

        }

    })

    .catch(error => {

        alert(
            "Unable to connect to the server."
        );

        console.log(error);

    })

    .finally(() => {

        button.disabled = false;

        button.innerHTML =
            "🚀 Run Agent";

    });

}


function addHistory(
    question,
    answer,
    time
) {

    const item = {

        question: question,
        answer: answer,
        time: time,
        date: new Date()
            .toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })

    };


    historyData.unshift(item);


    if (historyData.length > 10) {

        historyData =
            historyData.slice(0, 10);

    }


    localStorage.setItem(
        "agentHistory",
        JSON.stringify(historyData)
    );


    renderHistory();


    document
        .getElementById("totalRequests")
        .textContent =
        historyData.length;

}


function renderHistory() {

    const container =
        document.getElementById("historyList");


    if (historyData.length === 0) {

        container.innerHTML =
            '<div class="empty">No calculations yet.</div>';

        return;
    }


    container.innerHTML = "";


    historyData.forEach((item, index) => {

        const row =
            document.createElement("div");

        row.className =
            "history-row";


        row.innerHTML = `

            <span class="history-number">
                ${index + 1}
            </span>

            <span class="history-question">
                ${item.question}
            </span>

            <strong>
                ${item.answer}
            </strong>

            <span class="history-success">
                ✓ success
            </span>

            <span class="history-time">
                🕐 ${item.date}
            </span>

            <button
                class="star"
                onclick="addFavoriteFromHistory(${index})">
                ☆
            </button>

        `;


        container.appendChild(row);

    });

}


function clearHistory() {

    if (
        confirm(
            "Clear all calculation history?"
        )
    ) {

        historyData = [];

        localStorage.removeItem(
            "agentHistory"
        );

        renderHistory();

        document
            .getElementById("totalRequests")
            .textContent = "0";

    }

}


function saveFavorite() {

    const question =
        document
        .getElementById("resultQuestion")
        .textContent;

    const answer =
        document
        .getElementById("resultAnswer")
        .textContent;


    if (
        question === "—" ||
        answer === "—"
    ) {

        alert(
            "Run a calculation first."
        );

        return;
    }


    favorites.push({

        question: question,
        answer: answer

    });


    localStorage.setItem(
        "agentFavorites",
        JSON.stringify(favorites)
    );


    document
        .getElementById("favoriteCount")
        .textContent =
        favorites.length;


    alert(
        "⭐ Added to Favorites!"
    );

}


function addFavoriteFromHistory(index) {

    const item =
        historyData[index];


    favorites.push({

        question: item.question,
        answer: item.answer

    });


    localStorage.setItem(
        "agentFavorites",
        JSON.stringify(favorites)
    );


    document
        .getElementById("favoriteCount")
        .textContent =
        favorites.length;

}


function showHistory() {

    document
        .getElementById("history")
        .scrollIntoView({
            behavior: "smooth"
        });

}


function showFavorites() {

    if (favorites.length === 0) {

        alert(
            "No favorite calculations yet."
        );

        return;
    }


    let text =
        "⭐ FAVORITES\n\n";


    favorites.forEach(
        (item, index) => {

            text +=
                `${index + 1}. ` +
                `${item.question} = ` +
                `${item.answer}\n`;

        }
    );


    alert(text);

}


function showExamples() {

    alert(
        "💡 Examples\n\n" +
        "25 * 4\n" +
        "100 + 200\n" +
        "144 / 12\n" +
        "(15 + 5) * 2\n" +
        "500 - 125\n\n" +
        "You can also use brackets and decimals."
    );

}


function showHelp() {

    alert(
        "🤖 How to use\n\n" +
        "1. Enter a mathematical expression.\n" +
        "2. Press Run Agent.\n" +
        "3. The Calculator Tool processes it.\n" +
        "4. View your structured result.\n" +
        "5. Save important results as favorites."
    );

}


function showSupport() {

    alert(
        "💬 Support\n\n" +
        "Single-Tool AI Agent Support\n\n" +
        "Enter your calculation and run the agent."
    );

}


document
    .getElementById("favoriteCount")
    .textContent =
    favorites.length;


document
    .getElementById("totalRequests")
    .textContent =
    historyData.length;


renderHistory();

// ================= THEME TOGGLE =================

function toggleTheme() {

    document.body.classList.toggle("light-mode");

    const button = document.getElementById("themeToggle");

    if (document.body.classList.contains("light-mode")) {

        button.textContent = "☀️";

        localStorage.setItem("agentTheme", "light");

    } else {

        button.textContent = "🌙";

        localStorage.setItem("agentTheme", "dark");
    }
}


// ================= LOAD SAVED THEME =================

document.addEventListener("DOMContentLoaded", function () {

    const button = document.getElementById("themeToggle");

    const savedTheme = localStorage.getItem("agentTheme");

    if (savedTheme === "light") {

        document.body.classList.add("light-mode");

        if (button) {
            button.textContent = "☀️";
        }

    } else {

        document.body.classList.remove("light-mode");

        if (button) {
            button.textContent = "🌙";
        }
    }

});

// ================= ENTER KEY SUPPORT =================

document.addEventListener("DOMContentLoaded", function () {

    const questionInput =
        document.getElementById("question");

    if (questionInput) {

        questionInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter" && !event.shiftKey) {

                event.preventDefault();

                askAgent();

            }

        });

    }

});