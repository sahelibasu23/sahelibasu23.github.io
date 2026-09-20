(function () {
    "use strict";

    const CONFIG = {
        greeting:
            "Hi — I'm Saheli's portfolio navigator. Ask me about her learning design, assessment work, quality operations, applied AI, projects, or professional journey.",

        placeholder: "Ask about Saheli's work...",

        maxInputLength: 500,

        contactUrl: "https://sahelibasu23.github.io/contact.html",

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

    const state = {
        isOpen: false,
        history: []
    };

    function init() {
        if (document.getElementById("portfolio-chatbot")) return;

        createChatbot();
        bindEvents();
        renderSuggestions();

        addAssistantMessage(CONFIG.greeting);

        // Initial state: show the full question list.
        expandSuggestions();
    }

    /* ---------------------------------------------------------
       CREATE CHATBOT
    --------------------------------------------------------- */

    function createChatbot() {
        const chatbot = document.createElement("div");
        chatbot.id = "portfolio-chatbot";
        chatbot.className = "portfolio-chatbot";

        chatbot.innerHTML = `
            <button
                id="portfolio-chatbot-trigger"
                class="portfolio-chatbot-trigger"
                type="button"
                aria-label="Open portfolio navigator"
                aria-expanded="false"
            >
                <span class="portfolio-chatbot-trigger-icon">✦</span>
                <span class="portfolio-chatbot-trigger-text">Ask about my work</span>
            </button>

            <section
                id="portfolio-chatbot-panel"
                class="portfolio-chatbot-panel"
                aria-hidden="true"
            >
                <div class="portfolio-chatbot-header">
                    <div class="portfolio-chatbot-header-copy">
                        <div class="portfolio-chatbot-eyebrow">
                            PORTFOLIO NAVIGATOR
                        </div>

                        <div class="portfolio-chatbot-title">
                            Ask about Saheli's work
                        </div>
                    </div>

                    <button
                        id="portfolio-chatbot-close"
                        class="portfolio-chatbot-close"
                        type="button"
                        aria-label="Close portfolio navigator"
                    >
                        ×
                    </button>
                </div>

                <div
                    id="portfolio-chatbot-messages"
                    class="portfolio-chatbot-messages"
                    aria-live="polite"
                ></div>

                <div
                    id="portfolio-chatbot-suggestions-wrapper"
                    class="portfolio-chatbot-suggestions-wrapper"
                >
                    <button
                        id="portfolio-chatbot-suggestions-toggle"
                        class="portfolio-chatbot-suggestions-toggle"
                        type="button"
                        aria-expanded="true"
                    >
                        <span>Suggested questions</span>
                        <span
                            id="portfolio-chatbot-suggestions-icon"
                            class="portfolio-chatbot-suggestions-icon"
                        >−</span>
                    </button>

                    <div
                        id="portfolio-chatbot-suggestions"
                        class="portfolio-chatbot-suggestions"
                    ></div>
                </div>

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
                        aria-label="Ask about Saheli's work"
                    />

                    <button
                        class="portfolio-chatbot-send"
                        type="submit"
                        aria-label="Send message"
                    >
                        →
                    </button>
                </form>
            </section>
        `;

        document.body.appendChild(chatbot);
    }

    /* ---------------------------------------------------------
       EVENTS
    --------------------------------------------------------- */

    function bindEvents() {
        const trigger = document.getElementById(
            "portfolio-chatbot-trigger"
        );

        const close = document.getElementById(
            "portfolio-chatbot-close"
        );

        const reset = document.getElementById(
            "portfolio-chatbot-reset"
        );

        const form = document.getElementById(
            "portfolio-chatbot-form"
        );

        const input = document.getElementById(
            "portfolio-chatbot-input"
        );

        const suggestionsToggle = document.getElementById(
            "portfolio-chatbot-suggestions-toggle"
        );

        trigger.addEventListener("click", toggleChatbot);
        close.addEventListener("click", closeChatbot);
        reset.addEventListener("click", resetChatbot);
        suggestionsToggle.addEventListener(
            "click",
            toggleSuggestions
        );

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            handleSubmit();
        });

        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit();
            }
        });
    }

    /* ---------------------------------------------------------
       OPEN / CLOSE
    --------------------------------------------------------- */

    function toggleChatbot() {
        state.isOpen ? closeChatbot() : openChatbot();
    }

    function openChatbot() {
        const panel = document.getElementById(
            "portfolio-chatbot-panel"
        );

        const trigger = document.getElementById(
            "portfolio-chatbot-trigger"
        );

        state.isOpen = true;

        panel.classList.add("is-open");
        panel.setAttribute("aria-hidden", "false");

        trigger.setAttribute("aria-expanded", "true");
        trigger.classList.add("is-active");

        setTimeout(function () {
            const input = document.getElementById(
                "portfolio-chatbot-input"
            );

            if (input) input.focus();
        }, 150);
    }

    function closeChatbot() {
        const panel = document.getElementById(
            "portfolio-chatbot-panel"
        );

        const trigger = document.getElementById(
            "portfolio-chatbot-trigger"
        );

        state.isOpen = false;

        panel.classList.remove("is-open");
        panel.setAttribute("aria-hidden", "true");

        trigger.setAttribute("aria-expanded", "false");
        trigger.classList.remove("is-active");
    }

    /* ---------------------------------------------------------
       MESSAGE HANDLING
    --------------------------------------------------------- */

    function handleSubmit() {
        const input = document.getElementById(
            "portfolio-chatbot-input"
        );

        if (!input) return;

        const question = input.value.trim();

        if (!question) return;

        if (question.length > CONFIG.maxInputLength) {
            return;
        }

        addUserMessage(question);

        input.value = "";

        /*
         * Once someone asks something, hide the long list.
         * But instead of leaving a tiny mysterious bar,
         * change the control to:
         *
         * "Explore more questions +"
         */
        collapseSuggestions(true);

        let response;

        try {
            response = findAnswer(question);
        } catch (error) {
            console.error(
                "Portfolio chatbot error:",
                error
            );

            response =
                "I couldn't process that question right now. You can explore the portfolio directly or contact Saheli.";
        }

        setTimeout(function () {
            addAssistantMessage(response);
        }, 350);
    }

    function addUserMessage(text) {
        addMessage("user", text);

        state.history.push({
            role: "user",
            content: text
        });
    }

    function addAssistantMessage(text) {
        addMessage("assistant", text);

        state.history.push({
            role: "assistant",
            content: text
        });
    }

    function addMessage(role, text) {
        const container = document.getElementById(
            "portfolio-chatbot-messages"
        );

        if (!container) return;

        const message = document.createElement("div");

        message.className =
            "portfolio-chatbot-message portfolio-chatbot-message-" +
            role;

        message.innerHTML = `
            <div class="portfolio-chatbot-message-bubble">
                ${formatText(text)}
            </div>
        `;

        container.appendChild(message);

        scrollMessagesToBottom();
    }

    function scrollMessagesToBottom() {
        const container = document.getElementById(
            "portfolio-chatbot-messages"
        );

        if (!container) return;

        container.scrollTop = container.scrollHeight;
    }

    /* ---------------------------------------------------------
       SUGGESTIONS
    --------------------------------------------------------- */

    function renderSuggestions() {
        const container = document.getElementById(
            "portfolio-chatbot-suggestions"
        );

        if (!container) return;

        container.innerHTML = "";

        CONFIG.suggestedQuestions.forEach(function (question) {
            const button = document.createElement("button");

            button.type = "button";
            button.className =
                "portfolio-chatbot-suggestion";

            button.textContent = question;

            button.addEventListener("click", function () {
                const input = document.getElementById(
                    "portfolio-chatbot-input"
                );

                if (!input) return;

                input.value = question;

                handleSubmit();
            });

            container.appendChild(button);
        });
    }

    function toggleSuggestions() {
        const wrapper = document.getElementById(
            "portfolio-chatbot-suggestions-wrapper"
        );

        if (!wrapper) return;

        if (wrapper.classList.contains("is-collapsed")) {
            expandSuggestions();
        } else {
            collapseSuggestions(false);
        }
    }

    function collapseSuggestions(showExploreLabel) {
        const wrapper = document.getElementById(
            "portfolio-chatbot-suggestions-wrapper"
        );

        if (!wrapper) return;

        wrapper.classList.add("is-collapsed");

        const toggle = document.getElementById(
            "portfolio-chatbot-suggestions-toggle"
        );

        const icon = document.getElementById(
            "portfolio-chatbot-suggestions-icon"
        );

        if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
        }

        if (icon) {
            icon.textContent = "+";
        }

        const label = toggle
            ? toggle.querySelector("span:first-child")
            : null;

        if (label) {
            label.textContent = showExploreLabel
                ? "Explore more questions"
                : "Suggested questions";
        }
    }

    function expandSuggestions() {
        const wrapper = document.getElementById(
            "portfolio-chatbot-suggestions-wrapper"
        );

        if (!wrapper) return;

        wrapper.classList.remove("is-collapsed");

        const toggle = document.getElementById(
            "portfolio-chatbot-suggestions-toggle"
        );

        const icon = document.getElementById(
            "portfolio-chatbot-suggestions-icon"
        );

        if (toggle) {
            toggle.setAttribute("aria-expanded", "true");
        }

        if (icon) {
            icon.textContent = "−";
        }

        const label = toggle
            ? toggle.querySelector("span:first-child")
            : null;

        if (label) {
            label.textContent = "Suggested questions";
        }
    }

    /* ---------------------------------------------------------
       RESET
    --------------------------------------------------------- */

    function resetChatbot() {
        state.history = [];

        const messages = document.getElementById(
            "portfolio-chatbot-messages"
        );

        const input = document.getElementById(
            "portfolio-chatbot-input"
        );

        if (messages) {
            messages.innerHTML = "";
        }

        if (input) {
            input.value = "";
        }

        addAssistantMessage(CONFIG.greeting);

        renderSuggestions();

        // Start-over always returns to the full list.
        expandSuggestions();

        if (input) {
            setTimeout(function () {
                input.focus();
            }, 100);
        }
    }

    /* ---------------------------------------------------------
       ANSWER ENGINE
    --------------------------------------------------------- */

    function findAnswer(question) {
        const normalized = question
            .toLowerCase()
            .trim();

        const data = window.PORTFOLIO_DATA;

        if (!data) {
            return (
                "The portfolio information isn't available right now. " +
                "You can explore the site directly or contact Saheli."
            );
        }

        /*
         * Direct greetings
         */
        if (
            /^(hi|hello|hey|hiya|good morning|good afternoon|good evening)\b/.test(
                normalized
            )
        ) {
            return (
                "Hi! You can ask me about Saheli's learning design, " +
                "assessment work, Workera, HAWK, quality operations, " +
                "applied AI, projects, or professional journey."
            );
        }

        /*
         * Contact
         */
        if (
            containsAny(normalized, [
                "contact",
                "email",
                "reach her",
                "reach saheli",
                "get in touch",
                "hire",
                "work with her"
            ])
        ) {
            return buildResponse("contact");
        }

        /*
         * Workera / HAWK / assessment
         */
        if (
            containsAny(normalized, [
                "workera",
                "hawk",
                "assessment",
                "assessments",
                "assessment design",
                "assessment work",
                "item quality",
                "assessment quality"
            ])
        ) {
            return buildResponse("assessment");
        }

        /*
         * Learning design
         */
        if (
            containsAny(normalized, [
                "learning design",
                "instructional design",
                "learning",
                "curriculum",
                "course design",
                "teaching",
                "learning experience"
            ])
        ) {
            return buildResponse("learning");
        }

        /*
         * Quality / operations
         */
        if (
            containsAny(normalized, [
                "quality",
                "quality operations",
                "quality improvement",
                "operations",
                "operational",
                "process",
                "process improvement",
                "qa",
                "quality assurance"
            ])
        ) {
            return buildResponse("quality");
        }

        /*
         * AI
         */
        if (
            containsAny(normalized, [
                "ai",
                "artificial intelligence",
                "responsible ai",
                "applied ai",
                "automation",
                "generative ai"
            ])
        ) {
            return buildResponse("ai");
        }

        /*
         * Career / journey
         */
        if (
            containsAny(normalized, [
                "journey",
                "career",
                "experience",
                "background",
                "professional journey",
                "worked",
                "work history"
            ])
        ) {
            return buildResponse("journey");
        }

        /*
         * Projects
         */
        if (
            containsAny(normalized, [
                "project",
                "projects",
                "portfolio",
                "built",
                "created",
                "case study",
                "case studies"
            ])
        ) {
            return buildResponse("projects");
        }

        /*
         * Capabilities
         */
        if (
            containsAny(normalized, [
                "capabilities",
                "skills",
                "skill set",
                "what can she do",
                "what does she do",
                "expertise"
            ])
        ) {
            return buildResponse("capabilities");
        }

        /*
         * Profile
         */
        if (
            containsAny(normalized, [
                "about saheli",
                "who is saheli",
                "about her",
                "profile",
                "who is she"
            ])
        ) {
            return buildResponse("profile");
        }

        /*
         * Help
         */
        if (
            containsAny(normalized, [
                "help",
                "what can i ask",
                "what can you tell me"
            ])
        ) {
            return buildResponse("help");
        }

        /*
         * General fallback
         */
        return (
            "I can help you navigate Saheli's portfolio. Try asking about " +
            "her Workera experience, assessment design, learning design, " +
            "quality operations, applied AI, projects, capabilities, or career journey."
        );
    }

    function buildResponse(category) {
        const data = window.PORTFOLIO_DATA;

        if (!data) {
            return "Portfolio data is currently unavailable.";
        }

        const item = data[category];

        if (!item) {
            return (
                "I don't have a detailed answer for that section yet. " +
                "You can explore the portfolio directly or contact Saheli."
            );
        }

        switch (category) {
            case "profile":
                return (
                    item.answer ||
                    data.identity.description ||
                    "Saheli works at the intersection of learning, assessment, operational improvement, and applied AI."
                );

            case "journey":
                return (
                    item.answer ||
                    item.summary ||
                    "Saheli's professional journey brings together learning, assessment, quality operations, and applied AI."
                );

            case "learning":
                return (
                    item.answer ||
                    item.summary ||
                    "Saheli approaches learning design as a systems problem: connecting content, learner needs, delivery environments, and evidence of learning."
                );

            case "assessment":
                return (
                    (item.answer || "") +
                    (
                        item.hawk
                            ? "\n\n" + item.hawk
                            : ""
                    ) +
                    (
                        item.qualityOperations
                            ? "\n\n" + item.qualityOperations
                            : ""
                    )
                ).trim();

            case "quality":
                return (
                    item.answer ||
                    item.qualityOperations ||
                    item.summary ||
                    "Saheli's quality work focuses on the operational systems and processes that make quality more consistent and scalable."
                );

            case "ai":
                return (
                    item.answer ||
                    item.summary ||
                    "Saheli explores applied and responsible AI as a way to support expert judgement, improve workflows, and make good systems more scalable."
                );

            case "projects":
                return (
                    item.answer ||
                    item.summary ||
                    "Saheli's portfolio includes projects spanning learning design, platform adaptation, assessment, systems, and applied AI."
                );

            case "capabilities":
                return (
                    item.answer ||
                    "Her capabilities span learning design, assessment development, quality operations, measurement, systems thinking, and applied AI." +
                    (
                        item.areas
                            ? "\n\n" + formatAreas(item.areas)
                            : ""
                    )
                );

            case "contact":
                return (
                    item.answer ||
                    "If you'd like to discuss a project, collaboration, role, or another opportunity, use the Contact Saheli button below."
                );

            case "help":
                return (
                    item.answer ||
                    "You can ask me about Saheli's learning design, assessment work, Workera, HAWK, quality operations, applied AI, professional journey, projects, or capabilities."
                );

            default:
                return (
                    item.answer ||
                    item.summary ||
                    "You can explore the relevant section of Saheli's portfolio for more information."
                );
        }
    }

    function formatAreas(areas) {
        if (Array.isArray(areas)) {
            return areas
                .map(function (area) {
                    return "• " + area;
                })
                .join("\n");
        }

        return String(areas);
    }

    /* ---------------------------------------------------------
       NAVIGATION
    --------------------------------------------------------- */

    function navigateToSection(section) {
        const data = window.PORTFOLIO_DATA;

        if (!data || !data.navigation) return;

        const selector = data.navigation[section];

        if (!selector) return;

        const target = document.querySelector(selector);

        if (!target) return;

        closeChatbot();

        setTimeout(function () {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 100);
    }

    /* ---------------------------------------------------------
       HELPERS
    --------------------------------------------------------- */

    function containsAny(text, terms) {
        return terms.some(function (term) {
            return text.includes(term);
        });
    }

    function formatText(text) {
        return escapeHtml(String(text))
            .replace(/\n\n/g, "<br><br>")
            .replace(/\n/g, "<br>");
    }

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    /* ---------------------------------------------------------
       START
    --------------------------------------------------------- */

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            init
        );
    } else {
        init();
    }
})();
