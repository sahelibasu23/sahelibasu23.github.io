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


    /* ==================================================
       CONFIGURATION
    ================================================== */

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


    /* ==================================================
       STATE
    ================================================== */

    const state = {

        isOpen: false,

        history: []

    };


    /* ==================================================
       INITIALIZATION
    ================================================== */

    function init() {

        if (
            document.getElementById(
                "portfolio-chatbot"
            )
        ) {
            return;
        }


        createChatbot();


        const form =
            document.getElementById(
                "portfolio-chatbot-form"
            );


        const input =
            document.getElementById(
                "portfolio-chatbot-input"
            );


        /* Form submission */

        if (form) {

            form.addEventListener(
                "submit",
                handleSubmit
            );

        }


        /* Enter key */

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
                            new Event(
                                "submit",
                                {
                                    bubbles: true,
                                    cancelable: true
                                }
                            )
                        );

                    }

                }
            );

        }


        /* Initial greeting */

        addAssistantMessage(
            CONFIG.greeting
        );


        /* Initial suggestions */

        renderSuggestions();

    }


    /* ==================================================
       CREATE CHATBOT
    ================================================== */

    function createChatbot() {

        const chatbot =
            document.createElement("div");


        chatbot.id =
            "portfolio-chatbot";


        chatbot.innerHTML = `

            <!-- Floating trigger -->

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


            <!-- Chat panel -->

            <section
                id="portfolio-chatbot-panel"
                class="portfolio-chatbot-panel"
                aria-label="Portfolio navigator"
                aria-hidden="true"
            >


                <!-- Header -->

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


                <!-- Messages -->

                <div
                    id="portfolio-chatbot-messages"
                    class="portfolio-chatbot-messages"
                    aria-live="polite"
                ></div>


                <!-- Collapsible suggestions -->

                <div
                    class="portfolio-chatbot-suggestions-wrapper"
                >

                    <button
                        id="portfolio-chatbot-suggestions-toggle"
                        class="portfolio-chatbot-suggestions-toggle"
                        type="button"
                        aria-expanded="true"
                    >

                        <span>
                            You can ask me about
                        </span>

                        <span
                            id="portfolio-chatbot-suggestions-icon"
                            class="portfolio-chatbot-suggestions-icon"
                        >
                            −
                        </span>

                    </button>


                    <div
                        id="portfolio-chatbot-suggestions"
                        class="portfolio-chatbot-suggestions"
                    ></div>

                </div>


                <!-- Utility actions -->

                <div class="portfolio-chatbot-actions">

                    <button
                        id="portfolio-chatbot-reset"
                        class="portfolio-chatbot-action chatbot-reset"
                        type="button"
                    >

                        <span>
                            ↻
                        </span>

                        <span>
                            Start over
                        </span>

                    </button>


                    <a
                        class="portfolio-chatbot-action chatbot-contact"
                        href="${CONFIG.contactUrl}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        <span>
                            Contact Saheli
                        </span>

                        <span>
                            →
                        </span>

                    </a>

                </div>


                <!-- Input -->

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


        document.body.appendChild(
            chatbot
        );


        /* ==================================================
           EVENT LISTENERS
        ================================================== */

        const trigger =
            document.getElementById(
                "portfolio-chatbot-trigger"
            );


        if (trigger) {

            trigger.addEventListener(
                "click",
                toggleChatbot
            );

        }


        const close =
            document.getElementById(
                "portfolio-chatbot-close"
            );


        if (close) {

            close.addEventListener(
                "click",
                closeChatbot
            );

        }


        const reset =
            document.getElementById(
                "portfolio-chatbot-reset"
            );


        if (reset) {

            reset.addEventListener(
                "click",
                resetChatbot
            );

        }


        const suggestionsToggle =
            document.getElementById(
                "portfolio-chatbot-suggestions-toggle"
            );


        if (suggestionsToggle) {

            suggestionsToggle.addEventListener(
                "click",
                toggleSuggestions
            );

        }

    }


    /* ==================================================
       OPEN / CLOSE CHATBOT
    ================================================== */

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

            panel.classList.add(
                "is-open"
            );

            panel.setAttribute(
                "aria-hidden",
                "false"
            );

        }


        if (trigger) {

            trigger.classList.add(
                "is-open"
            );

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

            panel.classList.remove(
                "is-open"
            );

            panel.setAttribute(
                "aria-hidden",
                "true"
            );

        }


        if (trigger) {

            trigger.classList.remove(
                "is-open"
            );

            trigger.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }


    /* ==================================================
       HANDLE USER QUESTIONS
    ================================================== */

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


        /* Add user message */

        addUserMessage(
            question
        );


        /* Clear input */

        input.value = "";


        /* Collapse suggestions after a question */

        collapseSuggestions();


        let response;


        try {

            response =
                findAnswer(
                    question
                );

        } catch (error) {

            console.error(
                "Portfolio chatbot error:",
                error
            );


            response = {

                text:
                    "I wasn't able to process that question. Try asking about Saheli's learning design, assessment work, quality operations, applied AI, projects, or professional journey.",

                section:
                    null

            };

        }


        /* Slight response delay */

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


    /* ==================================================
       RESET CHATBOT
    ================================================== */

    function resetChatbot() {

        state.history = [];


        const messages =
            document.getElementById(
                "portfolio-chatbot-messages"
            );


        if (messages) {

            messages.innerHTML = "";

        }


        const input =
            document.getElementById(
                "portfolio-chatbot-input"
            );


        if (input) {

            input.value = "";

        }


        /* Restore suggestions */

        expandSuggestions();


        /* Restore greeting */

        addAssistantMessage(
            CONFIG.greeting
        );


        renderSuggestions();


        if (input) {

            setTimeout(
                function () {

                    input.focus();

                },
                100
            );

        }

    }


    /* ==================================================
       ADD USER MESSAGE
    ================================================== */

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


    /* ==================================================
       ADD ASSISTANT MESSAGE
    ================================================== */

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


    /* ==================================================
       ADD MESSAGE TO DOM
    ================================================== */

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


        message.appendChild(
            bubble
        );


        /* Section navigation button */

        if (
            type === "assistant" &&
            section &&
            PORTFOLIO_DATA.navigation &&
            PORTFOLIO_DATA.navigation[section]
        ) {

            const link =
                document.createElement(
                    "button"
                );


            link.type = "button";


            link.className =
                "portfolio-chatbot-section-link";


            link.textContent =
                "Explore this section →";


            link.addEventListener(
                "click",
                function () {

                    navigateToSection(
                        section
                    );

                }
            );


            message.appendChild(
                link
            );

        }


        container.appendChild(
            message
        );


        scrollMessagesToBottom();

    }


    /* ==================================================
       SCROLL MESSAGE AREA
    ================================================== */

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


    /* ==================================================
       COLLAPSIBLE SUGGESTIONS
    ================================================== */

    function toggleSuggestions() {

        const wrapper =
            document.querySelector(
                ".portfolio-chatbot-suggestions-wrapper"
            );


        if (!wrapper) {
            return;
        }


        if (
            wrapper.classList.contains(
                "is-collapsed"
            )
        ) {

            expandSuggestions();

        } else {

            collapseSuggestions();

        }

    }


    function collapseSuggestions() {

        const wrapper =
            document.querySelector(
                ".portfolio-chatbot-suggestions-wrapper"
            );


        const toggle =
            document.getElementById(
                "portfolio-chatbot-suggestions-toggle"
            );


        const icon =
            document.getElementById(
                "portfolio-chatbot-suggestions-icon"
            );


        if (wrapper) {

            wrapper.classList.add(
                "is-collapsed"
            );

        }


        if (toggle) {

            toggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }


        if (icon) {

            icon.textContent =
                "+";

        }

    }


    function expandSuggestions() {

        const wrapper =
            document.querySelector(
                ".portfolio-chatbot-suggestions-wrapper"
            );


        const toggle =
            document.getElementById(
                "portfolio-chatbot-suggestions-toggle"
            );


        const icon =
            document.getElementById(
                "portfolio-chatbot-suggestions-icon"
            );


        if (wrapper) {

            wrapper.classList.remove(
                "is-collapsed"
            );

        }


        if (toggle) {

            toggle.setAttribute(
                "aria-expanded",
                "true"
            );

        }


        if (icon) {

            icon.textContent =
                "−";

        }

    }


    /* ==================================================
       RENDER SUGGESTIONS
    ================================================== */

    function renderSuggestions() {

        const container =
            document.getElementById(
                "portfolio-chatbot-suggestions"
            );


        if (!container) {
            return;
        }


        container.innerHTML = "";


        CONFIG.suggestedQuestions.forEach(
            function (question) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


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


                        if (!input) {
                            return;
                        }


                        input.value =
                            question;


                        input.focus();


                        const form =
                            input.closest(
                                "form"
                            );


                        if (form) {

                            form.dispatchEvent(
                                new Event(
                                    "submit",
                                    {
                                        bubbles: true,
                                        cancelable: true
                                    }
                                )
                            );

                        }

                    }
                );


                container.appendChild(
                    button
                );

            }
        );

    }


    /* ==================================================
       ANSWER ENGINE
    ================================================== */

    function findAnswer(question) {

        const normalized =
            normalize(
                question
            );


        const tokens =
            tokenize(
                normalized
            );


        const entries =
            Object.keys(
                PORTFOLIO_DATA
            )
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
                                normalize(
                                    keyword
                                );


                            /*
                             * Exact phrase match
                             */

                            if (
                                normalized.includes(
                                    normalizedKeyword
                                )
                            ) {

                                score +=
                                    normalizedKeyword
                                        .split(" ")
                                        .length * 3;

                            }


                            /*
                             * Individual token matches
                             */

                            const keywordTokens =
                                tokenize(
                                    normalizedKeyword
                                );


                            keywordTokens.forEach(
                                function (token) {

                                    if (
                                        tokens.includes(
                                            token
                                        )
                                    ) {

                                        score += 1;

                                    }

                                }
                            );

                        }
                    );


                    /* ----------------------------------
                       Specific boosts
                    ---------------------------------- */


                    if (
                        normalized.includes(
                            "workera"
                        ) &&
                        key === "assessment"
                    ) {

                        score += 12;

                    }


                    if (
                        normalized.includes(
                            "hawk"
                        ) &&
                        key === "assessment"
                    ) {

                        score += 15;

                    }


                    if (
                        (
                            normalized.includes(
                                "ai"
                            ) ||
                            normalized.includes(
                                "artificial intelligence"
                            ) ||
                            normalized.includes(
                                "llm"
                            ) ||
                            normalized.includes(
                                "mcp"
                            ) ||
                            normalized.includes(
                                "agent"
                            )
                        ) &&
                        key === "ai"
                    ) {

                        score += 10;

                    }


                    if (
                        (
                            normalized.includes(
                                "career"
                            ) ||
                            normalized.includes(
                                "journey"
                            ) ||
                            normalized.includes(
                                "background"
                            )
                        ) &&
                        key === "journey"
                    ) {

                        score += 8;

                    }


                    if (
                        (
                            normalized.includes(
                                "project"
                            ) ||
                            normalized.includes(
                                "projects"
                            )
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

                return (
                    b.score -
                    a.score
                );

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

                section:
                    null

            };

        }


        return buildResponse(
            best.key,
            best.item
        );

    }


    /* ==================================================
       BUILD RESPONSE
    ================================================== */

    function buildResponse(
        key,
        item
    ) {

        switch (key) {


            /* ------------------------------------------
               PROFILE
            ------------------------------------------ */

            case "profile":

                return {

                    text:
                        item.answer,

                    section:
                        item.section

                };


            /* ------------------------------------------
               JOURNEY
            ------------------------------------------ */

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


            /* ------------------------------------------
               LEARNING
            ------------------------------------------ */

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


            /* ------------------------------------------
               ASSESSMENT
            ------------------------------------------ */

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

                                    return (
                                        "• " +
                                        skill
                                    );

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


            /* ------------------------------------------
               QUALITY
            ------------------------------------------ */

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

                                    return (
                                        "• " +
                                        concept
                                    );

                                }
                            )
                            .join("\n"),

                    section:
                        item.section

                };


            /* ------------------------------------------
               AI
            ------------------------------------------ */

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
                        item.tools.join(
                            ", "
                        ) +
                        ".",

                    section:
                        item.section

                };


            /* ------------------------------------------
               PROJECTS
            ------------------------------------------ */

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


            /* ------------------------------------------
               CAPABILITIES
            ------------------------------------------ */

            case "capabilities":

                return {

                    text:
                        item.answer +
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


            /* ------------------------------------------
               PHILOSOPHY
            ------------------------------------------ */

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


            /* ------------------------------------------
               CONTACT
            ------------------------------------------ */

            case "contact":

                return {

                    text:
                        item.answer +
                        "\n\n" +
                        "You can also use the Contact Saheli button below the conversation to go directly to the enquiry portal.",

                    section:
                        item.section

                };


            /* ------------------------------------------
               HELP
            ------------------------------------------ */

            case "help":

                return {

                    text:
                        item.answer +
                        "\n\n" +
                        CONFIG.suggestedQuestions
                            .map(
                                function (question) {

                                    return (
                                        "• " +
                                        question
                                    );

                                }
                            )
                            .join("\n"),

                    section:
                        null

                };


            /* ------------------------------------------
               FALLBACK
            ------------------------------------------ */

            default:

                return {

                    text:
                        item.answer ||
                        "I can help you explore Saheli's portfolio.",

                    section:
                        item.section ||
                        null

                };

        }

    }


    /* ==================================================
       TEXT NORMALIZATION
    ================================================== */

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

        return normalize(
            text
        )
            .split(" ")
            .filter(
                Boolean
            );

    }


    /* ==================================================
       SAFE TEXT FORMATTING
    ================================================== */

    function formatText(text) {

        return escapeHtml(
            text
        ).replace(
            /\n/g,
            "<br>"
        );

    }


    function escapeHtml(text) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            text;


        return div.innerHTML;

    }


    /* ==================================================
       PORTFOLIO SECTION NAVIGATION
    ================================================== */

    function navigateToSection(
        section
    ) {

        if (
            !PORTFOLIO_DATA.navigation ||
            !PORTFOLIO_DATA.navigation[section]
        ) {

            return;

        }


        const selector =
            PORTFOLIO_DATA.navigation[
                section
            ];


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


    /* ==================================================
       START APPLICATION
    ================================================== */

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
