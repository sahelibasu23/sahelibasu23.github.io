/*
 * Saheli Basu Portfolio Navigator
 * --------------------------------
 * GitHub Pages compatible.
 * No dependencies.
 * No API.
 * No backend.
 */

(function () {
    "use strict";

    /* =========================================================
       CONFIGURATION
       ========================================================= */

    const CONFIG = {
        assistantName: "Portfolio Assistant",
        greeting:
            "Hi — I can help you explore Saheli's portfolio. Ask me about her work, experience, assessment practice, learning design, quality operations, applied AI, or projects.",

        placeholder:
            "Ask about Saheli's work...",

        maxInputLength: 500,

        suggestedQuestions: [
            "What did Saheli do at Workera?",
            "Tell me about her assessment work.",
            "What is her approach to learning design?",
            "What kind of AI work does she do?"
        ]
    };


    /* =========================================================
       STATE
       ========================================================= */

    let state = {
        isOpen: false,
        history: []
    };


    /* =========================================================
       CREATE CHATBOT
       ========================================================= */

    function createChatbot() {

        if (document.getElementById("portfolio-chatbot")) {
            return;
        }

        const root = document.createElement("div");

        root.id = "portfolio-chatbot";

        root.innerHTML = `
            <button
                class="portfolio-chatbot-trigger"
                id="portfolio-chatbot-trigger"
                type="button"
                aria-label="Open portfolio assistant"
                aria-expanded="false"
            >
                <span class="portfolio-chatbot-trigger-mark" aria-hidden="true">
                    +
                </span>
                <span class="portfolio-chatbot-trigger-label">
                    Explore portfolio
                </span>
            </button>

            <section
                class="portfolio-chatbot-panel"
                id="portfolio-chatbot-panel"
                aria-label="Portfolio assistant"
                aria-hidden="true"
            >

                <header class="portfolio-chatbot-header">

                    <div>
                        <div class="portfolio-chatbot-eyebrow">
                            PORTFOLIO ASSISTANT
                        </div>

                        <h2>
                            Explore the work
                        </h2>
                    </div>

                    <button
                        class="portfolio-chatbot-close"
                        id="portfolio-chatbot-close"
                        type="button"
                        aria-label="Close portfolio assistant"
                    >
                        ×
                    </button>

                </header>

                <div
                    class="portfolio-chatbot-messages"
                    id="portfolio-chatbot-messages"
                    aria-live="polite"
                ></div>

                <div
                    class="portfolio-chatbot-suggestions"
                    id="portfolio-chatbot-suggestions"
                ></div>

                <form
                    class="portfolio-chatbot-form"
                    id="portfolio-chatbot-form"
                >

                    <label
                        class="portfolio-chatbot-sr-only"
                        for="portfolio-chatbot-input"
                    >
                        Ask a question
                    </label>

                    <input
                        id="portfolio-chatbot-input"
                        class="portfolio-chatbot-input"
                        type="text"
                        maxlength="${CONFIG.maxInputLength}"
                        autocomplete="off"
                        placeholder="${CONFIG.placeholder}"
                    >

                    <button
                        class="portfolio-chatbot-send"
                        type="submit"
                        aria-label="Send question"
                    >
                        →
                    </button>

                </form>

                <div class="portfolio-chatbot-footer">
                    Public portfolio information · No external AI service
                </div>

            </section>
        `;

        document.body.appendChild(root);

        bindEvents();

        addAssistantMessage(CONFIG.greeting);

        renderSuggestions(CONFIG.suggestedQuestions);
    }


    /* =========================================================
       EVENTS
       ========================================================= */

    function bindEvents() {

        const trigger =
            document.getElementById("portfolio-chatbot-trigger");

        const close =
            document.getElementById("portfolio-chatbot-close");

        const form =
            document.getElementById("portfolio-chatbot-form");

        trigger.addEventListener("click", toggleChat);

        close.addEventListener("click", closeChat);

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            handleSubmit();
        });

        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape" && state.isOpen) {
                closeChat();
            }

        });
    }


    /* =========================================================
       OPEN / CLOSE
       ========================================================= */

    function toggleChat() {

        if (state.isOpen) {
            closeChat();
        } else {
            openChat();
        }
    }


    function openChat() {

        const panel =
            document.getElementById("portfolio-chatbot-panel");

        const trigger =
            document.getElementById("portfolio-chatbot-trigger");

        panel.classList.add("is-open");

        panel.setAttribute("aria-hidden", "false");

        trigger.setAttribute("aria-expanded", "true");

        state.isOpen = true;

        setTimeout(function () {

            const input =
                document.getElementById("portfolio-chatbot-input");

            if (input) {
                input.focus();
            }

        }, 150);
    }


    function closeChat() {

        const panel =
            document.getElementById("portfolio-chatbot-panel");

        const trigger =
            document.getElementById("portfolio-chatbot-trigger");

        panel.classList.remove("is-open");

        panel.setAttribute("aria-hidden", "true");

        trigger.setAttribute("aria-expanded", "false");

        state.isOpen = false;
    }


    /* =========================================================
       SUBMIT
       ========================================================= */

    function handleSubmit() {

        const input =
            document.getElementById("portfolio-chatbot-input");

        const question =
            input.value.trim();

        if (!question) {
            return;
        }

        if (question.length > CONFIG.maxInputLength) {
            addAssistantMessage(
                "That question is a little long. Try shortening it and I'll look for the most relevant part of the portfolio."
            );

            return;
        }

        addUserMessage(question);

        input.value = "";

        const response =
            findAnswer(question);

        setTimeout(function () {

            addAssistantMessage(
                response.text,
                response.section
            );

        }, 180);
    }


    /* =========================================================
       ANSWER ENGINE
       ========================================================= */

    function findAnswer(question) {

        const normalized =
            normalize(question);

        const tokens =
            tokenize(normalized);

        let matches = [];

        Object.keys(PORTFOLIO_DATA).forEach(function (key) {

            const item =
                PORTFOLIO_DATA[key];

            if (!item || !Array.isArray(item.keywords)) {
                return;
            }

            let score = 0;

            item.keywords.forEach(function (keyword) {

                const normalizedKeyword =
                    normalize(keyword);

                if (!normalizedKeyword) {
                    return;
                }

                /* Exact phrase match */
                if (normalized.includes(normalizedKeyword)) {
                    score += 8;
                }

                /* Individual keyword matches */
                const keywordTokens =
                    tokenize(normalizedKeyword);

                keywordTokens.forEach(function (word) {

                    if (tokens.includes(word)) {
                        score += 2;
                    }

                });
            });

            /* Extra intent boosts */

            if (
                normalized.includes("workera") &&
                key === "assessment"
            ) {
                score += 20;
            }

            if (
                normalized.includes("hawk") &&
                key === "assessment"
            ) {
                score += 25;
            }

            if (
                (
                    normalized.includes("ai") ||
                    normalized.includes("artificial intelligence")
                ) &&
                key === "ai"
            ) {
                score += 15;
            }

            if (
                normalized.includes("project") &&
                key === "projects"
            ) {
                score += 12;
            }

            if (
                normalized.includes("career") &&
                key === "journey"
            ) {
                score += 12;
            }

            if (score > 0) {
                matches.push({
                    key: key,
                    item: item,
                    score: score
                });
            }

        });

        matches.sort(function (a, b) {
            return b.score - a.score;
        });

        if (!matches.length) {
            return fallbackResponse();
        }

        const best =
            matches[0];

        return buildResponse(best);
    }


    /* =========================================================
       RESPONSE BUILDER
       ========================================================= */

    function buildResponse(match) {

        const key =
            match.key;

        const item =
            match.item;

        let text =
            item.answer || "";

        let section =
            item.section || null;

        /* -------------------------
           PROFILE
        ------------------------- */

        if (key === "profile") {

            text +=
                "\n\nThe portfolio currently focuses on " +
                item.details.slice(0, 6).join(", ") +
                ", and related systems and decision-support work.";
        }


        /* -------------------------
           JOURNEY
        ------------------------- */

        if (key === "journey") {

            text += "\n\nThe progression is:";

            item.stages.forEach(function (stage, index) {

                text +=
                    `\n${index + 1}. ${stage.title} — ${stage.description}`;
            });
        }


        /* -------------------------
           LEARNING
        ------------------------- */

        if (key === "learning") {

            text += "\n\nSelected learning-platform work:";

            item.platforms.forEach(function (platform) {

                text +=
                    `\n\n${platform.name} — ${platform.role}. ${platform.work}`;
            });
        }


        /* -------------------------
           ASSESSMENT
        ------------------------- */

        if (key === "assessment") {

            const workera =
                item.workera;

            text +=
                `\n\nAt ${workera.organization}, I worked in ${workera.team}, progressing from ${workera.progression}.`;

            text +=
                `\n\nCore areas included ${workera.skills.join(", ")}.`;

            if (
                questionContains(
                    state.history[state.history.length - 1],
                    ["hawk", "quality"]
                )
            ) {

                text +=
                    `\n\nHAWK: ${workera.hawk}`;

            } else {

                text +=
                    `\n\n${workera.hawk}`;
            }

            text +=
                `\n\n${workera.qualityOperations}`;

            text +=
                `\n\nDesign process: ${item.designProcess.stages.join(" → ")}. ${item.designProcess.description}`;

            text +=
                `\n\nFor quality and iteration, the work covered ${item.quality.areas.join(", ")}.`;
        }


        /* -------------------------
           QUALITY
        ------------------------- */

        if (key === "quality") {

            text +=
                `\n\nFeatured framework: ${item.framework.title}. ${item.framework.description}`;

            text +=
                `\n\nOperating flow: ${item.framework.flow.join(" → ")}.`;

            text +=
                "\n\nSupporting areas include:";

            item.systems.forEach(function (system) {

                text +=
                    `\n• ${system.title} — ${system.description}`;
            });
        }


        /* -------------------------
           AI
        ------------------------- */

        if (key === "ai") {

            text +=
                "\n\nSelected work includes:";

            item.caseStudies.forEach(function (study) {

                text +=
                    `\n• ${study.title} — ${study.description}`;
            });

            text +=
                `\n\nTools and approaches represented in the portfolio include ${item.tools.join(", ")}.`;
        }


        /* -------------------------
           PROJECTS
        ------------------------- */

        if (key === "projects") {

            text +=
                "\n\nSelected projects:";

            item.projects.forEach(function (project) {

                text +=
                    `\n• ${project.title} (${project.category}) — ${project.description}`;
            });
        }


        /* -------------------------
           CAPABILITIES
        ------------------------- */

        if (key === "capabilities") {

            text +=
                "\n\nThe capability set includes:";

            item.areas.forEach(function (area) {

                text +=
                    `\n• ${area.title} — ${area.description}`;
            });
        }


        /* -------------------------
           PHILOSOPHY
        ------------------------- */

        if (key === "philosophy") {

            text +=
                "\n\nThe process is:";

            item.stages.forEach(function (stage) {

                text +=
                    `\n• ${stage.title} — ${stage.description}`;
            });
        }


        /* -------------------------
           CONTACT
        ------------------------- */

        if (key === "contact") {

            text +=
                "\n\nYou can use the Professional Inquiry section of the portfolio to provide context about an opportunity, organization, expected contribution, and timing.";
        }


        return {
            text: text,
            section: section
        };
    }


    /* =========================================================
       FALLBACK
       ========================================================= */

    function fallbackResponse() {

        return {
            text:
                "I don't have a specific answer for that in the public portfolio information I have been given. Try asking about Saheli's learning design, assessment development, Workera experience, HAWK, quality operations, applied AI, projects, capabilities, professional journey, or working philosophy.",
            section: null
        };
    }


    /* =========================================================
       NORMALIZATION
       ========================================================= */

    function normalize(text) {

        return String(text || "")
            .toLowerCase()
            .replace(/[^\w\s&-]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }


    function tokenize(text) {

        return normalize(text)
            .split(" ")
            .filter(function (word) {
                return word.length > 1;
            });
    }


    function questionContains(question, words) {

        if (!question) {
            return false;
        }

        const normalized =
            normalize(question);

        return words.some(function (word) {

            return normalized.includes(
                normalize(word)
            );

        });
    }


    /* =========================================================
       MESSAGE UI
       ========================================================= */

    function addUserMessage(text) {

        addMessage(
            "user",
            escapeHTML(text)
        );

        state.history.push(text);
    }


    function addAssistantMessage(text, section) {

        const formatted =
            formatAssistantText(text);

        const container =
            document.getElementById(
                "portfolio-chatbot-messages"
            );

        const message =
            document.createElement("div");

        message.className =
            "portfolio-chatbot-message portfolio-chatbot-message-assistant";

        message.innerHTML = `
            <div class="portfolio-chatbot-message-label">
                ${CONFIG.assistantName}
            </div>

            <div class="portfolio-chatbot-message-content">
                ${formatted}
            </div>

            ${
                section
                    ? `
                        <button
                            type="button"
                            class="portfolio-chatbot-section-link"
                            data-section="${escapeHTML(section)}"
                        >
                            Explore this section →
                        </button>
                    `
                    : ""
            }
        `;

        container.appendChild(message);

        if (section) {

            const button =
                message.querySelector(
                    ".portfolio-chatbot-section-link"
                );

            button.addEventListener(
                "click",
                function () {
                    navigateToSection(section);
                }
            );
        }

        scrollMessagesToBottom();
    }


    function addMessage(type, content) {

        const container =
            document.getElementById(
                "portfolio-chatbot-messages"
            );

        const message =
            document.createElement("div");

        message.className =
            `portfolio-chatbot-message portfolio-chatbot-message-${type}`;

        message.innerHTML = `
            <div class="portfolio-chatbot-message-content">
                ${content}
            </div>
        `;

        container.appendChild(message);

        scrollMessagesToBottom();
    }

    function scrollMessagesToBottom() {

    const container =
        document.getElementById(
            "portfolio-chatbot-messages"
        );

    if (!container) {
        return;
    }

    container.scrollTop =
        container.scrollHeight;
}

    /* =========================================================
       SUGGESTIONS
       ========================================================= */

    function renderSuggestions(questions) {

        const container =
            document.getElementById(
                "portfolio-chatbot-suggestions"
            );

        container.innerHTML = "";

        questions.forEach(function (question) {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "portfolio-chatbot-suggestion";

            button.textContent =
                question;

            button.addEventListener(
                "click",
                function () {

                    const input =
                        document.getElementById(
                            "portfolio-chatbot-input"
                        );

                    input.value =
                        question;

                    handleSubmit();
                }
            );

            container.appendChild(button);
        });
    }


    /* =========================================================
       FORMAT TEXT
       ========================================================= */

    function formatAssistantText(text) {

        let safe =
            escapeHTML(text);

        /* Convert new lines */
        safe =
            safe.replace(/\n/g, "<br>");

        /* Convert bullets */
        safe =
            safe.replace(
                /• /g,
                '<span class="portfolio-chatbot-bullet">•</span> '
            );

        /* Convert simple arrow */
        safe =
            safe.replace(
                /→/g,
                '<span class="portfolio-chatbot-arrow">→</span>'
            );

        return safe;
    }


    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            String(text);

        return div.innerHTML;
    }


    /* =========================================================
       NAVIGATION
       ========================================================= */

    function navigateToSection(section) {

        const selector =
            PORTFOLIO_DATA.navigation[section];

        if (!selector) {
            return;
        }

        const target =
            document.querySelector(selector);

        if (!target) {

            /*
             * If the current HTML uses a different ID,
             * fail quietly rather than breaking the chatbot.
             */

            return;
        }

        closeChat();

        setTimeout(function () {

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);
    }


    /* =========================================================
       INITIALIZATION
       ========================================================= */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            createChatbot
        );

    } else {

        createChatbot();

    }

})();
