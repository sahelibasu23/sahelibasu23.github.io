/*
 * Saheli Basu Portfolio — Portfolio Navigator
 * ------------------------------------------------
 * Static portfolio chatbot.
 * No external API.
 * No backend.
 * Uses portfolio-data.js as its knowledge base.
 */

(function () {

    "use strict";

    const CONFIG = {

        greeting:
            "Hi — I'm Saheli's portfolio navigator. Ask me about her learning design, assessment work, quality operations, applied AI, projects, or professional journey.",

        placeholder:
            "Ask about Saheli's work...",

        maxInputLength: 500,

        contactUrl:
            "https://sahelibasu23.github.io/contact.html",

        suggestedQuestions: [
            "What did Saheli do at Workera?",
            "Tell me about her assessment work.",
            "What is her approach to learning design?",
            "What kind of AI work does she do?",
            "Tell me about her professional journey.",
            "What does she mean by quality operations?",
            "What projects has she built?",
            "What can I contact her about?"
        ]

    };


    /* --------------------------------------------------
       STATE
    -------------------------------------------------- */

    const state = {
        isOpen: false,
        history: []
    };


    /* --------------------------------------------------
       INITIALIZATION
    -------------------------------------------------- */

    function init() {

        if (document.getElementById("portfolio-chatbot")) {
            return;
        }

        createChatbot();

        const input =
            document.getElementById(
                "portfolio-chatbot-input"
            );

        const form =
            document.getElementById(
                "portfolio-chatbot-form"
            );

        if (form) {

            form.addEventListener(
                "submit",
                handleSubmit
            );

        }

        if (input) {

            input.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter" &&
                        !event.shiftKey
                    ) {

                        event.preventDefault();

                        form.dispatchEvent(
                            new Event("submit", {
                                bubbles: true,
                                cancelable: true
                            })
                        );

                    }

                }
            );

        }

        addAssistantMessage(
            CONFIG.greeting
        );

        renderSuggestions();

    }


    /* --------------------------------------------------
       CREATE CHATBOT UI
    -------------------------------------------------- */

    function createChatbot() {

        const chatbot =
            document.createElement("div");

        chatbot.id =
            "portfolio-chatbot";

        chatbot.innerHTML = `

            <button
                id="portfolio-chatbot-trigger"
                class="portfolio-chatbot-trigger"
                type="button"
                aria-label="Open portfolio navigator"
                aria-expanded="false"
            >
                <span class="portfolio-chatbot-trigger-icon">
                    ✦
                </span>

                <span class="portfolio-chatbot-trigger-label">
                    Ask about my work
                </span>
            </button>


            <section
                id="portfolio-chatbot-panel"
                class="portfolio-chatbot-panel"
                aria-label="Portfolio navigator"
                aria-hidden="true"
            >

                <header class="portfolio-chatbot-header">

                    <div class="portfolio-chatbot-header-copy">

                        <div class="portfolio-chatbot-eyebrow">
                            PORTFOLIO NAVIGATOR
                        </div>

                        <h2>
                            Ask about my work
                        </h2>

                        <p>
                            Explore my experience, projects,
                            assessment work, and approach.
                        </p>

                    </div>

                    <button
                        id="portfolio-chatbot-close"
                        class="portfolio-chatbot-close"
                        type="button"
                        aria-label="Close portfolio navigator"
                    >
                        ×
                    </button>

                </header>


                <div
                    id="portfolio-chatbot-messages"
                    class="portfolio-chatbot-messages"
                    aria-live="polite"
                ></div>


                <div
                    id="portfolio-chatbot-suggestions"
                    class="portfolio-chatbot-suggestions"
                ></div>


                <div class="portfolio-chatbot-actions">

                    <button
                        id="portfolio-chatbot-reset"
                        class="portfolio-chatbot-action chatbot-reset"
                        type="button"
                    >
                        <span>↻</span>
                        <span>Start over</span>
                    </button>

                    <a
                        class="portfolio-chatbot-action chatbot-contact"
                        href="${CONFIG.contactUrl}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span>Contact Saheli</span>
                        <span>→</span>
                    </a>

                </div>


                <form
                    id="portfolio-chatbot-form"
                    class="portfolio-chatbot-form"
                >

                    <input
                        id="portfolio-chatbot-input"
                        class="portfolio-chatbot-input"
                        type="text"
                        maxlength="${CONFIG.maxInputLength}"
                        placeholder="${CONFIG.placeholder}"
                        autocomplete="off"
                        aria-label="Ask a question"
                    />

                    <button
                        class="portfolio-chatbot-submit"
                        type="submit"
                        aria-label="Send question"
                    >
                        →
                    </button>

                </form>

            </section>

        `;

        document.body.appendChild(chatbot);


        /* Trigger */

        const trigger =
            document.getElementById(
                "portfolio-chatbot-trigger"
            );

        trigger.addEventListener(
            "click",
            toggleChatbot
        );


        /* Close */

        const close =
            document.getElementById(
                "portfolio-chatbot-close"
            );

        close.addEventListener(
            "click",
            closeChatbot
        );


        /* Reset */

        const reset =
            document.getElementById(
                "portfolio-chatbot-reset"
            );

        reset.addEventListener(
            "click",
            resetChatbot
        );

    }


    /* --------------------------------------------------
       OPEN / CLOSE
    -------------------------------------------------- */

    function toggleChatbot() {

        if (state.isOpen) {
            closeChatbot();
        } else {
            openChatbot();
        }

    }


    function openChatbot() {

        state.isOpen = true;

        const panel =
            document.getElementById(
                "portfolio-chatbot-panel"
            );

        const trigger =
            document.getElementById(
                "portfolio-chatbot-trigger"
            );

        if (panel) {

            panel.classList.add("is-open");

            panel.setAttribute(
                "aria-hidden",
                "false"
            );

        }

        if (trigger) {

            trigger.classList.add("is-open");

            trigger.setAttribute(
                "aria-expanded",
                "true"
            );

        }

        const input =
            document.getElementById(
                "portfolio-chatbot-input"
            );

        if (input) {

            setTimeout(
                function () {
                    input.focus();
                },
                150
            );

        }

    }


    function closeChatbot() {

        state.isOpen = false;

        const panel =
            document.getElementById(
                "portfolio-chatbot-panel"
            );

        const trigger =
            document.getElementById(
                "portfolio-chatbot-trigger"
            );

        if (panel) {

            panel.classList.remove("is-open");

            panel.setAttribute(
                "aria-hidden",
                "true"
            );

        }

        if (trigger) {

            trigger.classList.remove("is-open");

            trigger.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }


    /* --------------------------------------------------
       HANDLE QUESTIONS
    -------------------------------------------------- */

    function handleSubmit(event) {

        event.preventDefault();

        const input =
            document.getElementById(
                "portfolio-chatbot-input"
            );

        if (!input) {
            return;
        }

        const question =
            input.value.trim();

        if (!question) {
            return;
        }

        if (
            question.length >
            CONFIG.maxInputLength
        ) {

            addAssistantMessage(
                `Please keep your question under ${CONFIG.maxInputLength} characters.`
            );

            return;

        }


        addUserMessage(question);

        input.value = "";


        /* Find response */

        let response;

        try {

            response =
                findAnswer(question);

        } catch (error) {

            console.error(
                "Portfolio chatbot error:",
                error
            );

            response = {
                text:
                    "I wasn't able to process that question. Try asking about Saheli's learning design, assessment work, quality operations, AI work, projects, or professional journey.",
                section: null
            };

        }


        /* Small response delay */

        setTimeout(
            function () {

                addAssistantMessage(
                    response.text,
                    response.section
                );

            },
            300
        );

    }


    /* --------------------------------------------------
       RESET
    -------------------------------------------------- */

    function resetChatbot() {

        state.history = [];

        const messages =
            document.getElementById(
                "portfolio-chatbot-messages"
            );

        if (messages) {
            messages.innerHTML = "";
        }


        addAssistantMessage(
            CONFIG.greeting
        );

        renderSuggestions();


        const input =
            document.getElementById(
                "portfolio-chatbot-input"
            );

        if (input) {

            input.value = "";

            setTimeout(
                function () {
                    input.focus();
                },
                100
            );

        }

    }


    /* --------------------------------------------------
       ADD USER MESSAGE
    -------------------------------------------------- */

    function addUserMessage(text) {

        addMessage(
            text,
            "user"
        );

        state.history.push({
            role: "user",
            text: text
        });

    }


    /* --------------------------------------------------
       ADD ASSISTANT MESSAGE
    -------------------------------------------------- */

    function addAssistantMessage(
        text,
        section
    ) {

        addMessage(
            text,
            "assistant",
            section
        );

    }


    /* --------------------------------------------------
       ADD MESSAGE
    -------------------------------------------------- */

    function addMessage(
        text,
        type,
        section
    ) {

        const container =
            document.getElementById(
                "portfolio-chatbot-messages"
            );

        if (!container) {
            return;
        }


        const message =
            document.createElement("div");

        message.className =
            `portfolio-chatbot-message ${type}`;


        const bubble =
            document.createElement("div");

        bubble.className =
            "portfolio-chatbot-bubble";


        bubble.innerHTML =
            formatText(text);


        message.appendChild(bubble);


        /* Section navigation */

        if (
            type === "assistant" &&
            section &&
            PORTFOLIO_DATA.navigation &&
            PORTFOLIO_DATA.navigation[section]
        ) {

            const link =
                document.createElement("button");

            link.type = "button";

            link.className =
                "portfolio-chatbot-section-link";

            link.textContent =
                "Explore this section →";


            link.addEventListener(
                "click",
                function () {
                    navigateToSection(section);
                }
            );


            message.appendChild(link);

        }


        container.appendChild(message);

        scrollMessagesToBottom();

    }


    /* --------------------------------------------------
       SCROLL
    -------------------------------------------------- */

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


    /* --------------------------------------------------
       SUGGESTED QUESTIONS
    -------------------------------------------------- */

    function renderSuggestions() {

        const container =
            document.getElementById(
                "portfolio-chatbot-suggestions"
            );

        if (!container) {
            return;
        }


        container.innerHTML = "";


        const heading =
            document.createElement("div");

        heading.className =
            "portfolio-chatbot-suggestions-heading";

        heading.textContent =
            "You can ask me about";

        container.appendChild(heading);


        CONFIG.suggestedQuestions.forEach(
            function (question) {

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

                        if (input) {

                            input.value =
                                question;

                            input.focus();

                            input
                                .closest("form")
                                .dispatchEvent(
                                    new Event("submit", {
                                        bubbles: true,
                                        cancelable: true
                                    })
                                );

                        }

                    }
                );


                container.appendChild(button);

            }
        );

    }


    /* --------------------------------------------------
       ANSWER ENGINE
    -------------------------------------------------- */

    function findAnswer(question) {

        const normalized =
            normalize(question);

        const tokens =
            tokenize(normalized);


        const entries =
            Object.keys(PORTFOLIO_DATA)
                .filter(
                    function (key) {

                        return (
                            PORTFOLIO_DATA[key] &&
                            PORTFOLIO_DATA[key].keywords
                        );

                    }
                );


        let scored =
            entries.map(
                function (key) {

                    const item =
                        PORTFOLIO_DATA[key];

                    let score = 0;


                    item.keywords.forEach(
                        function (keyword) {

                            const normalizedKeyword =
                                normalize(keyword);

                            if (
                                normalized.includes(
                                    normalizedKeyword
                                )
                            ) {

                                score +=
                                    normalizedKeyword.split(" ").length * 3;

                            }


                            const keywordTokens =
                                tokenize(
                                    normalizedKeyword
                                );


                            keywordTokens.forEach(
                                function (token) {

                                    if (
                                        tokens.includes(token)
                                    ) {

                                        score += 1;

                                    }

                                }
                            );

                        }
                    );


                    /* Specific boosts */

                    if (
                        normalized.includes("workera") &&
                        key === "assessment"
                    ) {
                        score += 12;
                    }


                    if (
                        normalized.includes("hawk") &&
                        key === "assessment"
                    ) {
                        score += 15;
                    }


                    if (
                        (
                            normalized.includes("ai") ||
                            normalized.includes("artificial intelligence") ||
                            normalized.includes("llm") ||
                            normalized.includes("mcp") ||
                            normalized.includes("agent")
                        ) &&
                        key === "ai"
                    ) {
                        score += 10;
                    }


                    if (
                        (
                            normalized.includes("career") ||
                            normalized.includes("journey") ||
                            normalized.includes("background")
                        ) &&
                        key === "journey"
                    ) {
                        score += 8;
                    }


                    if (
                        (
                            normalized.includes("project") ||
                            normalized.includes("projects")
                        ) &&
                        key === "projects"
                    ) {
                        score += 8;
                    }


                    return {
                        key: key,
                        item: item,
                        score: score
                    };

                }
            );


        scored.sort(
            function (a, b) {
                return b.score - a.score;
            }
        );


        const best =
            scored[0];


        if (
            !best ||
            best.score <= 0
        ) {

            return {
                text:
                    "I can help you explore Saheli's professional profile, learning design, assessment development, Workera, HAWK, quality operations, applied AI, projects, capabilities, working philosophy, or contact information.",
                section: null
            };

        }


        return buildResponse(
            best.key,
            best.item
        );

    }


    /* --------------------------------------------------
       BUILD RESPONSE
    -------------------------------------------------- */

    function buildResponse(
        key,
        item
    ) {

        switch (key) {


            case "profile":

                return {
                    text:
                        item.answer,

                    section:
                        item.section
                };


            case "journey":

                return {
                    text:
                        item.answer +
                        "\n\n" +
                        item.stages
                            .map(
                                function (stage) {
                                    return (
                                        "• " +
                                        stage.title +
                                        ": " +
                                        stage.description
                                    );
                                }
                            )
                            .join("\n"),

                    section:
                        item.section
                };


            case "learning":

                return {
                    text:
                        item.answer +
                        "\n\n" +
                        item.platforms
                            .map(
                                function (platform) {
                                    return (
                                        "• " +
                                        platform.name +
                                        " — " +
                                        platform.role +
                                        ": " +
                                        platform.work
                                    );
                                }
                            )
                            .join("\n"),

                    section:
                        item.section
                };


            case "assessment":

                return {
                    text:
                        item.answer +
                        "\n\n" +
                        item.workera.summary +
                        "\n\n" +
                        "Key areas included:\n" +
                        item.workera.skills
                            .map(
                                function (skill) {
                                    return "• " + skill;
                                }
                            )
                            .join("\n") +
                        "\n\n" +
                        "HAWK: " +
                        item.workera.hawk +
                        "\n\n" +
                        item.workera.qualityOperations,

                    section:
                        item.section
                };


            case "quality":

                return {
                    text:
                        item.answer +
                        "\n\n" +
                        item.framework.title +
                        ":\n" +
                        item.framework.description +
                        "\n\n" +
                        "Operating flow: " +
                        item.framework.flow.join(
                            " → "
                        ) +
                        "\n\n" +
                        "Key concepts:\n" +
                        item.framework.concepts
                            .map(
                                function (concept) {
                                    return "• " + concept;
                                }
                            )
                            .join("\n"),

                    section:
                        item.section
                };


            case "ai":

                return {
                    text:
                        item.answer +
                        "\n\n" +
                        item.caseStudies
                            .map(
                                function (study) {
                                    return (
                                        "• " +
                                        study.title +
                                        ": " +
                                        study.description
                                    );
                                }
                            )
                            .join("\n") +
                        "\n\n" +
                        "Tools and environments include: " +
                        item.tools.join(", ") +
                        ".",

                    section:
                        item.section
                };


            case "projects":

                return {
                    text:
                        item.answer +
                        "\n\n" +
                        item.projects
                            .map(
                                function (project) {
                                    return (
                                        "• " +
                                        project.title +
                                        " (" +
                                        project.category +
                                        "): " +
                                        project.description
                                    );
                                }
                            )
                            .join("\n"),

                    section:
                        item.section
                };


            case "capabilities":

                return {
                    text:
                        item.answer ||
                        "My capabilities span learning, assessment, quality, operational intelligence, applied AI, analytics, and delivery." +
                        "\n\n" +
                        item.areas
                            .map(
                                function (area) {
                                    return (
                                        "• " +
                                        area.title +
                                        ": " +
                                        area.description
                                    );
                                }
                            )
                            .join("\n"),

                    section:
                        item.section
                };


            case "philosophy":

                return {
                    text:
                        item.answer +
                        "\n\n" +
                        item.stages
                            .map(
                                function (stage) {
                                    return (
                                        "• " +
                                        stage.title +
                                        ": " +
                                        stage.description
                                    );
                                }
                            )
                            .join("\n"),

                    section:
                        item.section
                };


            case "contact":

                return {
                    text:
                        item.answer +
                        "\n\n" +
                        "You can also use the Contact Saheli button below the conversation to go directly to the enquiry portal.",

                    section:
                        item.section
                };


            case "help":

                return {
                    text:
                        item.answer +
                        "\n\n" +
                        CONFIG.suggestedQuestions
                            .map(
                                function (question) {
                                    return "• " + question;
                                }
                            )
                            .join("\n"),

                    section: null
                };


            default:

                return {
                    text:
                        item.answer ||
                        "I can help you explore Saheli's portfolio.",

                    section:
                        item.section || null
                };

        }

    }


    /* --------------------------------------------------
       TEXT UTILITIES
    -------------------------------------------------- */

    function normalize(text) {

        return text
            .toLowerCase()
            .replace(
                /[^\w\s&-]/g,
                " "
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();

    }


    function tokenize(text) {

        return normalize(text)
            .split(" ")
            .filter(Boolean);

    }


    function formatText(text) {

        return escapeHtml(text)
            .replace(
                /\n/g,
                "<br>"
            )
            .replace(
                /•/g,
                "•"
            );

    }


    function escapeHtml(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text;

        return div.innerHTML;

    }


    /* --------------------------------------------------
       NAVIGATION
    -------------------------------------------------- */

    function navigateToSection(section) {

        if (
            !PORTFOLIO_DATA.navigation ||
            !PORTFOLIO_DATA.navigation[section]
        ) {
            return;
        }


        const selector =
            PORTFOLIO_DATA.navigation[section];


        const target =
            document.querySelector(
                selector
            );


        if (!target) {
            return;
        }


        closeChatbot();


        setTimeout(
            function () {

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            },
            100
        );

    }


    /* --------------------------------------------------
       START
    -------------------------------------------------- */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }

})();
