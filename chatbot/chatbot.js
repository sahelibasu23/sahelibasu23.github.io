(function () {
    "use strict";

    const CONFIG = {
        greeting:
            "Hi — I'm Saheli's portfolio navigator. Ask me about her learning design, assessment work, quality operations, applied AI, projects, or professional journey.",

        placeholder: "Ask about Saheli's work...",

        maxInputLength: 500,

        contactUrl: "https://sahelibasu23.github.io/contact.html",

        /*
         * This is intentionally separate from the portfolio
         * knowledge-base questions.
         *
         * The navigator explains the portfolio.
         * ChatGPT can be used when a visitor wants a
         * more conversational AI exploration.
         */
        aiSuggestion: {
            label: "Want AI to dig a little deeper?",
            text:
                "This navigator keeps things focused. If you want to have a more open-ended AI conversation about the portfolio, try ChatGPT — tell it to explore sahelibasu23.github.io with you.",
            button: "Try ChatGPT ↗",
            url: "https://chatgpt.com/"
        },

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


    /* =========================================================
       DATA
    ========================================================= */

    function getPortfolioData() {
        /*
         * portfolio-data.js should expose:
         *
         * window.PORTFOLIO_DATA = { ... };
         *
         * It must load BEFORE chatbot.js.
         */

        if (
            window.PORTFOLIO_DATA &&
            typeof window.PORTFOLIO_DATA === "object"
        ) {
            return window.PORTFOLIO_DATA;
        }

        /*
         * Backward-compatible fallback in case the data file
         * still uses a global PORTFOLIO_DATA declaration.
         */
        if (typeof PORTFOLIO_DATA !== "undefined") {
            return PORTFOLIO_DATA;
        }

        console.error(
            "Portfolio chatbot: PORTFOLIO_DATA was not found. " +
            "Make sure portfolio-data.js loads before chatbot.js."
        );

        return null;
    }


    /* =========================================================
       SECTION NAVIGATION
    ========================================================= */

    const SECTION_ACTIONS = {
        profile: {
            section: "profile",
            label: "Explore Profile"
        },

        journey: {
            section: "journey",
            label: "Explore Professional Journey"
        },

        learning: {
            section: "learning",
            label: "Explore Learning Design"
        },

        assessment: {
            section: "assessment",
            label: "Explore Assessment & Skills Intelligence"
        },

        quality: {
            section: "quality",
            label: "Explore Quality & Improvement"
        },

        ai: {
            section: "quality",
            label: "Explore Quality & Improvement"
        },

        projects: {
            section: "projects",
            label: "Explore Projects"
        },

        capabilities: {
            section: "capabilities",
            label: "Explore Capabilities"
        },

        philosophy: {
            section: "profile",
            label: "Explore Profile"
        },

        contact: {
            section: "contact",
            label: "Explore Contact"
        }
    };


    function getSectionAction(category) {
        return SECTION_ACTIONS[category] || null;
    }


    function navigateToSection(section) {
        const data = getPortfolioData();

        if (
            !data ||
            !data.navigation
        ) {
            return;
        }

        const selector =
            data.navigation[section];

        if (!selector) {
            return;
        }

        const target =
            document.querySelector(selector);

        if (!target) {
            return;
        }

        closeChatbot();

        setTimeout(function () {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 100);
    }


    /* =========================================================
       INITIALIZE
    ========================================================= */

    function init() {
        if (
            document.getElementById(
                "portfolio-chatbot"
            )
        ) {
            return;
        }

        createChatbot();
        bindEvents();
        renderSuggestions();

        addAssistantMessage(
            CONFIG.greeting
        );

        // Start with the complete question list visible.
        expandSuggestions();
    }


    /* =========================================================
       CREATE CHATBOT
    ========================================================= */

    function createChatbot() {
        const chatbot =
            document.createElement("div");

        chatbot.id =
            "portfolio-chatbot";

        chatbot.className =
            "portfolio-chatbot";


        chatbot.innerHTML = `
            <button
                id="portfolio-chatbot-trigger"
                class="portfolio-chatbot-trigger"
                type="button"
                aria-label="Open portfolio navigator"
                aria-expanded="false"
            >
                <span class="portfolio-chatbot-trigger-icon">✦</span>

                <span class="portfolio-chatbot-trigger-text">
                    Ask about my work
                </span>
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


                <!-- SUGGESTED QUESTIONS -->

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
                        <span>
                            Suggested questions
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


                <!-- ACTIONS -->

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


                <!-- INPUT -->

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


    /* =========================================================
       EVENTS
    ========================================================= */

    function bindEvents() {
        const trigger =
            document.getElementById(
                "portfolio-chatbot-trigger"
            );

        const close =
            document.getElementById(
                "portfolio-chatbot-close"
            );

        const reset =
            document.getElementById(
                "portfolio-chatbot-reset"
            );

        const form =
            document.getElementById(
                "portfolio-chatbot-form"
            );

        const input =
            document.getElementById(
                "portfolio-chatbot-input"
            );

        const suggestionsToggle =
            document.getElementById(
                "portfolio-chatbot-suggestions-toggle"
            );


        trigger.addEventListener(
            "click",
            toggleChatbot
        );


        close.addEventListener(
            "click",
            closeChatbot
        );


        reset.addEventListener(
            "click",
            resetChatbot
        );


        suggestionsToggle.addEventListener(
            "click",
            toggleSuggestions
        );


        form.addEventListener(
            "submit",
            function (event) {
                event.preventDefault();
                handleSubmit();
            }
        );


        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {
                    event.preventDefault();
                    handleSubmit();
                }

            }
        );
    }


    /* =========================================================
       OPEN / CLOSE
    ========================================================= */

    function toggleChatbot() {
        if (state.isOpen) {
            closeChatbot();
        } else {
            openChatbot();
        }
    }


    function openChatbot() {
        const panel =
            document.getElementById(
                "portfolio-chatbot-panel"
            );

        const trigger =
            document.getElementById(
                "portfolio-chatbot-trigger"
            );

        state.isOpen = true;

        panel.classList.add(
            "is-open"
        );

        panel.setAttribute(
            "aria-hidden",
            "false"
        );

        trigger.setAttribute(
            "aria-expanded",
            "true"
        );

        trigger.classList.add(
            "is-active"
        );


        setTimeout(function () {

            const input =
                document.getElementById(
                    "portfolio-chatbot-input"
                );

            if (input) {
                input.focus();
            }

        }, 150);
    }


    function closeChatbot() {
        const panel =
            document.getElementById(
                "portfolio-chatbot-panel"
            );

        const trigger =
            document.getElementById(
                "portfolio-chatbot-trigger"
            );

        state.isOpen = false;

        panel.classList.remove(
            "is-open"
        );

        panel.setAttribute(
            "aria-hidden",
            "true"
        );

        trigger.setAttribute(
            "aria-expanded",
            "false"
        );

        trigger.classList.remove(
            "is-active"
        );
    }


    /* =========================================================
       SUBMIT QUESTION
    ========================================================= */

    function handleSubmit() {
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
            return;
        }


        addUserMessage(
            question
        );

        input.value = "";


        /*
         * After a question is asked, collapse
         * the suggestions into:
         *
         * Explore more questions +
         */

        collapseSuggestions(
            true
        );


        let result;


        try {
            result =
                findAnswer(question);

        } catch (error) {

            console.error(
                "Portfolio chatbot error:",
                error
            );

            result = {
                text:
                    "I couldn't process that question right now. You can explore the portfolio directly or contact Saheli.",

                section: null
            };
        }


        /*
         * Keep the small response delay.
         * It makes the interaction feel less abrupt.
         */

        setTimeout(function () {

            addAssistantMessage(
                result.text,
                result.section
            );

        }, 350);
    }


    /* =========================================================
       MESSAGES
    ========================================================= */

    function addUserMessage(text) {
        addMessage(
            "user",
            text
        );

        state.history.push({
            role: "user",
            content: text
        });
    }


    function addAssistantMessage(
        text,
        section
    ) {
        addMessage(
            "assistant",
            text,
            section
        );

        state.history.push({
            role: "assistant",
            content: text
        });
    }


    function addMessage(
        role,
        text,
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
            document.createElement(
                "div"
            );


        message.className =
            "portfolio-chatbot-message " +
            "portfolio-chatbot-message-" +
            role;


        message.innerHTML = `
            <div class="portfolio-chatbot-message-bubble">
                ${formatText(text)}
            </div>
        `;


        /*
         * Add section navigation only to
         * relevant assistant answers.
         */

        if (
            role === "assistant" &&
            section
        ) {

            const action =
                getSectionAction(
                    section
                );


            if (action) {

                const data =
                    getPortfolioData();


                const selector =
                    data &&
                    data.navigation
                        ? data.navigation[
                            action.section
                        ]
                        : null;


                const target =
                    selector
                        ? document.querySelector(
                            selector
                        )
                        : null;


                /*
                 * Only show the button if the
                 * destination actually exists.
                 */

                if (target) {

                    const sectionLink =
                        document.createElement(
                            "button"
                        );


                    sectionLink.type =
                        "button";


                    sectionLink.className =
                        "portfolio-chatbot-section-link";


                    sectionLink.innerHTML = `
                        <span>
                            ${escapeHtml(
                                action.label
                            )}
                        </span>

                        <span aria-hidden="true">
                            →
                        </span>
                    `;


                    sectionLink.addEventListener(
                        "click",
                        function () {

                            navigateToSection(
                                action.section
                            );

                        }
                    );


                    message.appendChild(
                        sectionLink
                    );
                }
            }
        }


        container.appendChild(
            message
        );


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

    function renderSuggestions() {
        const container =
            document.getElementById(
                "portfolio-chatbot-suggestions"
            );

        if (!container) {
            return;
        }


        container.innerHTML = "";


        /*
         * Standard portfolio questions.
         */

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


                        handleSubmit();

                    }
                );


                container.appendChild(
                    button
                );

            }
        );


        /*
         * -----------------------------------------------------
         * AI / CHATGPT ESCAPE HATCH
         * -----------------------------------------------------
         *
         * Deliberately separated from the normal
         * portfolio questions.
         */

        const aiCard =
            document.createElement(
                "div"
            );


        aiCard.className =
            "portfolio-chatbot-ai-suggestion";


        const aiText =
            document.createElement(
                "div"
            );


        aiText.className =
            "portfolio-chatbot-ai-suggestion-text";


        aiText.innerHTML = `
            <strong>
                ${escapeHtml(
                    CONFIG.aiSuggestion.label
                )}
            </strong>

            <span>
                ${escapeHtml(
                    CONFIG.aiSuggestion.text
                )}
            </span>
        `;


        const aiButton =
            document.createElement(
                "a"
            );


        aiButton.className =
            "portfolio-chatbot-ai-suggestion-button";


        aiButton.href =
            CONFIG.aiSuggestion.url;


        aiButton.target =
            "_blank";


        aiButton.rel =
            "noopener noreferrer";


        aiButton.textContent =
            CONFIG.aiSuggestion.button;


        aiCard.appendChild(
            aiText
        );


        aiCard.appendChild(
            aiButton
        );


        container.appendChild(
            aiCard
        );
    }


    function toggleSuggestions() {
        const wrapper =
            document.getElementById(
                "portfolio-chatbot-suggestions-wrapper"
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

            collapseSuggestions(
                false
            );

        }
    }


    function collapseSuggestions(
        showExploreLabel
    ) {
        const wrapper =
            document.getElementById(
                "portfolio-chatbot-suggestions-wrapper"
            );


        if (!wrapper) {
            return;
        }


        wrapper.classList.add(
            "is-collapsed"
        );


        const toggle =
            document.getElementById(
                "portfolio-chatbot-suggestions-toggle"
            );


        const icon =
            document.getElementById(
                "portfolio-chatbot-suggestions-icon"
            );


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


        const label =
            toggle
                ? toggle.querySelector(
                    "span:first-child"
                )
                : null;


        if (label) {

            label.textContent =
                showExploreLabel
                    ? "Explore more questions"
                    : "Suggested questions";

        }
    }


    function expandSuggestions() {
        const wrapper =
            document.getElementById(
                "portfolio-chatbot-suggestions-wrapper"
            );


        if (!wrapper) {
            return;
        }


        wrapper.classList.remove(
            "is-collapsed"
        );


        const toggle =
            document.getElementById(
                "portfolio-chatbot-suggestions-toggle"
            );


        const icon =
            document.getElementById(
                "portfolio-chatbot-suggestions-icon"
            );


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


        const label =
            toggle
                ? toggle.querySelector(
                    "span:first-child"
                )
                : null;


        if (label) {
            label.textContent =
                "Suggested questions";
        }
    }


    /* =========================================================
       RESET
    ========================================================= */

    function resetChatbot() {
        state.history = [];


        const messages =
            document.getElementById(
                "portfolio-chatbot-messages"
            );


        const input =
            document.getElementById(
                "portfolio-chatbot-input"
            );


        if (messages) {
            messages.innerHTML = "";
        }


        if (input) {
            input.value = "";
        }


        addAssistantMessage(
            CONFIG.greeting
        );


        renderSuggestions();


        /*
         * Reset = full suggestions visible again.
         */

        expandSuggestions();


        if (input) {

            setTimeout(function () {
                input.focus();
            }, 100);

        }
    }


    /* =========================================================
       ANSWER ENGINE
    ========================================================= */

    function findAnswer(question) {

        const normalized =
            question
                .toLowerCase()
                .trim();


        const data =
            getPortfolioData();


        if (!data) {

            return {
                text:
                    "I couldn't load the portfolio information. Please refresh the page and try again.",

                section: null
            };

        }


        /* -----------------------------------------------------
           GREETINGS
        ----------------------------------------------------- */

        if (
            /^(hi|hello|hey|hiya|good morning|good afternoon|good evening)\b/
                .test(normalized)
        ) {

            return {
                text:
                    "Hi! You can ask me about Saheli's learning design, assessment work, Workera, HAWK, quality operations, applied AI, projects, or professional journey.",

                section: null
            };

        }


        /* -----------------------------------------------------
           CONTACT
        ----------------------------------------------------- */

        if (
            containsAny(
                normalized,
                [
                    "contact",
                    "email",
                    "reach her",
                    "reach saheli",
                    "get in touch",
                    "hire",
                    "work with her"
                ]
            )
        ) {

            return {
                text:
                    buildResponse("contact"),

                section:
                    "contact"
            };

        }


        /* -----------------------------------------------------
           WORKERA / HAWK / ASSESSMENT
        ----------------------------------------------------- */

        if (
            containsAny(
                normalized,
                [
                    "workera",
                    "hawk",
                    "assessment",
                    "assessments",
                    "assessment design",
                    "assessment work",
                    "assessment development",
                    "assessment developer",
                    "skills intelligence",
                    "skill intelligence",
                    "measurement",
                    "measurement design",
                    "competency",
                    "competencies",
                    "blueprint",
                    "assessment blueprint",
                    "scenario",
                    "item design",
                    "item writing",
                    "item quality",
                    "assessment quality",
                    "assessment qa",
                    "construct",
                    "evidence centered design",
                    "ecd"
                ]
            )
        ) {

            return {
                text:
                    buildResponse(
                        "assessment"
                    ),

                section:
                    "assessment"
            };

        }


        /* -----------------------------------------------------
           LEARNING DESIGN
        ----------------------------------------------------- */

        if (
            containsAny(
                normalized,
                [
                    "learning design",
                    "instructional design",
                    "learning",
                    "curriculum",
                    "curriculum design",
                    "curriculum architecture",
                    "course design",
                    "teaching",
                    "training",
                    "facilitation",
                    "learning experience",
                    "learning development",
                    "guided project"
                ]
            )
        ) {

            return {
                text:
                    buildResponse(
                        "learning"
                    ),

                section:
                    "learning"
            };

        }


        /* -----------------------------------------------------
           QUALITY / OPERATIONS
        ----------------------------------------------------- */

        if (
            containsAny(
                normalized,
                [
                    "quality operations",
                    "quality",
                    "quality improvement",
                    "continuous improvement",
                    "operations",
                    "operational",
                    "process",
                    "process improvement",
                    "qa",
                    "quality assurance",
                    "governance",
                    "incident",
                    "incident response",
                    "escalation",
                    "traceability",
                    "root cause"
                ]
            )
        ) {

            return {
                text:
                    buildResponse(
                        "quality"
                    ),

                section:
                    "quality"
            };

        }


        /* -----------------------------------------------------
           AI
        ----------------------------------------------------- */

        if (
            containsAny(
                normalized,
                [
                    "ai",
                    "artificial intelligence",
                    "responsible ai",
                    "applied ai",
                    "ai workflow",
                    "ai workflows",
                    "automation",
                    "generative ai",
                    "agentic ai",
                    "agents",
                    "mcp",
                    "llm",
                    "llms",
                    "human in the loop",
                    "hitl"
                ]
            )
        ) {

            return {
                text:
                    buildResponse(
                        "ai"
                    ),

                section:
                    "ai"
            };

        }


        /* -----------------------------------------------------
           JOURNEY
        ----------------------------------------------------- */

        if (
            containsAny(
                normalized,
                [
                    "journey",
                    "career",
                    "career path",
                    "career journey",
                    "professional journey",
                    "experience",
                    "background",
                    "worked",
                    "work history",
                    "career progression"
                ]
            )
        ) {

            return {
                text:
                    buildResponse(
                        "journey"
                    ),

                section:
                    "journey"
            };

        }


        /* -----------------------------------------------------
           PROJECTS
        ----------------------------------------------------- */

        if (
            containsAny(
                normalized,
                [
                    "project",
                    "projects",
                    "portfolio projects",
                    "analytics",
                    "data project",
                    "python",
                    "sql",
                    "dashboard",
                    "forecasting",
                    "risk scoring",
                    "decision support",
                    "capacity planning",
                    "workload",
                    "knowledge flow",
                    "network analysis",
                    "learning analytics",
                    "learner segmentation",
                    "case study",
                    "case studies"
                ]
            )
        ) {

            return {
                text:
                    buildResponse(
                        "projects"
                    ),

                section:
                    "projects"
            };

        }


        /* -----------------------------------------------------
           CAPABILITIES
        ----------------------------------------------------- */

        if (
            containsAny(
                normalized,
                [
                    "capabilities",
                    "skills",
                    "skill set",
                    "what can she do",
                    "what does she do",
                    "expertise",
                    "professional skills",
                    "technical skills",
                    "tools"
                ]
            )
        ) {

            return {
                text:
                    buildResponse(
                        "capabilities"
                    ),

                section:
                    "capabilities"
            };

        }


        /* -----------------------------------------------------
           PHILOSOPHY / APPROACH
        ----------------------------------------------------- */

        if (
            containsAny(
                normalized,
                [
                    "philosophy",
                    "working philosophy",
                    "approach",
                    "how do you work",
                    "how does saheli work",
                    "systems thinking",
                    "design approach",
                    "method"
                ]
            )
        ) {

            return {
                text:
                    buildResponse(
                        "philosophy"
                    ),

                section:
                    "philosophy"
            };

        }


        /* -----------------------------------------------------
           PROFILE
        ----------------------------------------------------- */

        if (
            containsAny(
                normalized,
                [
                    "about saheli",
                    "who is saheli",
                    "about her",
                    "profile",
                    "who is she",
                    "professional profile"
                ]
            )
        ) {

            return {
                text:
                    buildResponse(
                        "profile"
                    ),

                section:
                    "profile"
            };

        }


        /* -----------------------------------------------------
           HELP
        ----------------------------------------------------- */

        if (
            containsAny(
                normalized,
                [
                    "help",
                    "what can i ask",
                    "what can you tell me",
                    "questions",
                    "options"
                ]
            )
        ) {

            return {
                text:
                    buildResponse(
                        "help"
                    ),

                section: null
            };

        }


        /* -----------------------------------------------------
           FALLBACK
        ----------------------------------------------------- */

        return {
            text:
                "I can help you navigate Saheli's portfolio. Try asking about her Workera experience, assessment design, learning design, quality operations, applied AI, projects, capabilities, or career journey.",

            section: null
        };
    }


    /* =========================================================
       BUILD RESPONSE FROM PORTFOLIO DATA
    ========================================================= */

    function buildResponse(category) {

        const data =
            getPortfolioData();


        if (!data) {

            return (
                "I couldn't load the portfolio information. " +
                "Please refresh the page and try again."
            );

        }


        const item =
            data[category];


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
                    data.identity?.description ||
                    "Saheli works at the intersection of learning, assessment, operational improvement, and applied AI."
                );


            case "journey":

                return buildJourneyResponse(
                    item
                );


            case "learning":

                return buildLearningResponse(
                    item
                );


            case "assessment":

                return buildAssessmentResponse(
                    item
                );


            case "quality":

                return buildQualityResponse(
                    item
                );


            case "ai":

                return buildAIResponse(
                    item
                );


            case "projects":

                return buildProjectsResponse(
                    item
                );


            case "capabilities":

                return buildCapabilitiesResponse(
                    item
                );


            case "philosophy":

                return buildPhilosophyResponse(
                    item
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


    /* =========================================================
       RESPONSE BUILDERS
    ========================================================= */

    function buildJourneyResponse(item) {

        let response =
            item.answer ||
            item.summary ||
            "Saheli's professional journey brings together learning, assessment, quality operations, and applied AI.";


        if (
            Array.isArray(item.stages) &&
            item.stages.length
        ) {

            response += "\n\n";

            response += item.stages
                .map(function (stage) {

                    return (
                        "• " +
                        stage.title +
                        ": " +
                        stage.description
                    );

                })
                .join("\n");
        }


        return response;
    }


    function buildLearningResponse(item) {

        let response =
            item.answer ||
            item.summary ||
            "Saheli approaches learning design as a systems problem: connecting content, learner needs, delivery environments, and evidence of learning.";


        if (
            Array.isArray(item.platforms) &&
            item.platforms.length
        ) {

            response +=
                "\n\nHer learning work includes:";


            response += "\n" +
                item.platforms
                    .map(function (platform) {

                        return (
                            "• " +
                            platform.name +
                            " — " +
                            platform.role +
                            ": " +
                            platform.work
                        );

                    })
                    .join("\n");
        }


        return response;
    }


    function buildAssessmentResponse(item) {

        let response =
            item.answer ||
            "Saheli's assessment work focuses on designing meaningful evidence of capability and supporting quality across the assessment lifecycle.";


        /*
         * Workera-specific details.
         */

        if (item.workera) {

            const workera =
                item.workera;


            if (workera.organization) {

                response +=
                    "\n\nAt " +
                    workera.organization +
                    ", within the " +
                    (workera.team || "Learning & Assessment") +
                    ", her progression was " +
                    (workera.progression || "within assessment development") +
                    ".";

            }


            if (workera.summary) {

                response +=
                    "\n\n" +
                    workera.summary;

            }


            if (
                Array.isArray(
                    workera.skills
                ) &&
                workera.skills.length
            ) {

                response +=
                    "\n\nKey areas included:\n" +
                    workera.skills
                        .map(function (skill) {
                            return "• " + skill;
                        })
                        .join("\n");
            }


            /*
             * IMPORTANT:
             * HAWK is nested under workera in
             * portfolio-data.js.
             */

            if (workera.hawk) {

                response +=
                    "\n\nHAWK:\n" +
                    workera.hawk;

            }


            if (
                workera.qualityOperations
            ) {

                response +=
                    "\n\nQuality Operations:\n" +
                    workera.qualityOperations;

            }
        }


        /*
         * Skills → evidence process.
         */

        if (item.designProcess) {

            response +=
                "\n\n" +
                item.designProcess.title +
                ":\n" +
                item.designProcess.description;

        }


        /*
         * Assessment quality.
         */

        if (item.quality) {

            response +=
                "\n\n" +
                item.quality.title +
                ":\n" +
                item.quality.description;


            if (
                Array.isArray(
                    item.quality.areas
                ) &&
                item.quality.areas.length
            ) {

                response +=
                    "\n\n" +
                    item.quality.areas
                        .map(function (area) {
                            return "• " + area;
                        })
                        .join("\n");

            }
        }


        return response;
    }


    function buildQualityResponse(item) {

        let response =
            item.answer ||
            item.summary ||
            "Saheli's quality work focuses on the operational systems and processes that make quality more consistent and scalable.";


        if (item.framework) {

            response +=
                "\n\n" +
                item.framework.title +
                ":\n" +
                item.framework.description;


            if (
                Array.isArray(
                    item.framework.flow
                ) &&
                item.framework.flow.length
            ) {

                response +=
                    "\n\nFlow: " +
                    item.framework.flow.join(
                        " → "
                    );

            }


            if (
                Array.isArray(
                    item.framework.concepts
                ) &&
                item.framework.concepts.length
            ) {

                response +=
                    "\n\nKey concepts:\n" +
                    item.framework.concepts
                        .map(function (concept) {
                            return "• " + concept;
                        })
                        .join("\n");

            }
        }


        if (
            Array.isArray(item.systems) &&
            item.systems.length
        ) {

            response +=
                "\n\nRelated systems work:\n" +
                item.systems
                    .map(function (system) {

                        return (
                            "• " +
                            system.title +
                            ": " +
                            system.description
                        );

                    })
                    .join("\n");

        }


        return response;
    }


    function buildAIResponse(item) {

        let response =
            item.answer ||
            item.summary ||
            "Saheli explores applied and responsible AI as a way to support expert judgement, improve workflows, and make good systems more scalable.";


        if (
            Array.isArray(
                item.caseStudies
            ) &&
            item.caseStudies.length
        ) {

            response +=
                "\n\nCase studies include:\n" +
                item.caseStudies
                    .map(function (study) {

                        return (
                            "• " +
                            study.title +
                            ": " +
                            study.description
                        );

                    })
                    .join("\n");

        }


        if (
            Array.isArray(item.tools) &&
            item.tools.length
        ) {

            response +=
                "\n\nTools and approaches include:\n" +
                item.tools
                    .map(function (tool) {
                        return "• " + tool;
                    })
                    .join("\n");

        }


        return response;
    }


    function buildProjectsResponse(item) {

        let response =
            item.answer ||
            item.summary ||
            "Saheli's portfolio includes applied projects spanning analytics, decision support, learning, assessment, and operational systems.";


        if (
            Array.isArray(item.projects) &&
            item.projects.length
        ) {

            response +=
                "\n\nProjects include:\n" +
                item.projects
                    .map(function (project) {

                        return (
                            "• " +
                            project.title +
                            " — " +
                            project.category +
                            ": " +
                            project.description
                        );

                    })
                    .join("\n");

        }


        return response;
    }


    function buildCapabilitiesResponse(item) {

        let response =
            item.answer ||
            "Her capabilities span learning design, assessment development, quality operations, measurement, systems thinking, and applied AI.";


        if (
            Array.isArray(item.areas) &&
            item.areas.length
        ) {

            response +=
                "\n\n" +
                item.areas
                    .map(function (area) {

                        /*
                         * capabilities.areas contains
                         * objects, not strings.
                         */

                        if (
                            area &&
                            typeof area === "object"
                        ) {

                            return (
                                "• " +
                                area.title +
                                ": " +
                                area.description
                            );

                        }

                        return "• " + area;

                    })
                    .join("\n");
        }


        return response;
    }


    function buildPhilosophyResponse(item) {

        let response =
            item.answer ||
            "Saheli approaches complex work through systems thinking, structured design, verification, and continuous improvement.";


        if (
            Array.isArray(item.stages) &&
            item.stages.length
        ) {

            response +=
                "\n\n" +
                item.stages
                    .map(function (stage) {

                        return (
                            "• " +
                            stage.title +
                            ": " +
                            stage.description
                        );

                    })
                    .join("\n");

        }


        return response;
    }


    /* =========================================================
       TEXT FORMATTING
    ========================================================= */

    function formatText(text) {

        return escapeHtml(
            String(text)
        )
            .replace(
                /\n\n/g,
                "<br><br>"
            )
            .replace(
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


    /* =========================================================
       HELPERS
    ========================================================= */

    function containsAny(
        text,
        terms
    ) {

        return terms.some(
            function (term) {
                return text.includes(term);
            }
        );
    }


    /* =========================================================
       START
    ========================================================= */

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
