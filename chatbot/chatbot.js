/*
 * Saheli Basu Portfolio — Portfolio Navigator
 * ------------------------------------------------
 * Static portfolio chatbot.
 *
 * No external API.
 * No backend.
 * No LLM.
 *
 * Responsibilities:
 * - Create chatbot UI
 * - Match user questions to portfolio data
 * - Generate concise portfolio answers
 * - Provide section navigation after answers
 * - Manage suggested questions
 * - Handle reset / contact actions
 */

(function () {
    "use strict";

    /* =========================================================
       CONFIGURATION
    ========================================================= */

    const CONFIG = {
        contactUrl: "https://sahelibasu23.github.io/contact.html",

        greeting:
            "Hi — I'm Saheli's portfolio navigator. Ask me about her work, experience, assessment practice, quality operations, applied AI, projects, or where to find something on the site.",

        suggestions: [
            "Tell me about Saheli",
            "How did Saheli's career evolve?",
            "What does she do in learning design?",
            "What did she do at Workera?",
            "What is HAWK?",
            "How does she approach assessment quality?",
            "What does her quality operations work involve?",
            "How does she use AI?",
            "Tell me about her projects",
            "What are her core capabilities?",
            "How does she approach complex problems?",
            "How can I contact Saheli?"
        ]
    };


    /* =========================================================
       STATE
    ========================================================= */

    let chatbot = null;
    let panel = null;
    let messages = null;
    let suggestionsWrapper = null;
    let suggestionsContainer = null;
    let suggestionsToggle = null;
    let form = null;
    let input = null;

    let isOpen = false;


    /* =========================================================
       PORTFOLIO DATA
    ========================================================= */

    function getPortfolioData() {
        /*
         * portfolio-data.js should expose:
         *
         * window.PORTFOLIO_DATA = { ... };
         */

        if (
            window.PORTFOLIO_DATA &&
            typeof window.PORTFOLIO_DATA === "object"
        ) {
            return window.PORTFOLIO_DATA;
        }

        return null;
    }


    /* =========================================================
       SECTION NAVIGATION
    ========================================================= */

    const SECTION_LABELS = {
        home: "Home",
        profile: "Profile",
        journey: "Professional Journey",
        learning: "Learning Design",
        assessment: "Assessment & Skills Intelligence",
        quality: "Quality & Improvement",
        impact: "Impact",
        projects: "Projects",
        capabilities: "Capabilities",
        contact: "Contact"
    };


    function getSectionTarget(sectionKey) {
        const data = getPortfolioData();

        if (!data || !data.navigation) {
            return null;
        }

        return data.navigation[sectionKey] || null;
    }


    function getSectionLabel(sectionKey) {
        return SECTION_LABELS[sectionKey] || "Relevant section";
    }


    function navigateToSection(sectionKey) {
        const target = getSectionTarget(sectionKey);

        if (!target) {
            return;
        }

        const element = document.querySelector(target);

        if (!element) {
            /*
             * If the section is not present on the current page,
             * fall back to the contact/portfolio behavior rather
             * than throwing an error.
             */
            return;
        }

        closeChatbot();

        /*
         * Small delay allows the chatbot panel to close cleanly
         * before the page begins scrolling.
         */
        window.setTimeout(function () {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 80);
    }


    /* =========================================================
       CREATE CHATBOT
    ========================================================= */

    function createChatbot() {
        if (document.querySelector(".portfolio-chatbot")) {
            chatbot = document.querySelector(".portfolio-chatbot");
            panel = chatbot.querySelector(".portfolio-chatbot-panel");
            messages = chatbot.querySelector(".portfolio-chatbot-messages");
            suggestionsWrapper = chatbot.querySelector(
                ".portfolio-chatbot-suggestions-wrapper"
            );
            suggestionsContainer = chatbot.querySelector(
                ".portfolio-chatbot-suggestions"
            );
            suggestionsToggle = chatbot.querySelector(
                ".portfolio-chatbot-suggestions-toggle"
            );
            form = chatbot.querySelector(".portfolio-chatbot-form");
            input = chatbot.querySelector(".portfolio-chatbot-input");
            return;
        }

        chatbot = document.createElement("div");

        chatbot.className = "portfolio-chatbot";

        chatbot.innerHTML = `
            <button
                class="portfolio-chatbot-trigger"
                type="button"
                aria-label="Ask about Saheli's work"
                aria-expanded="false"
            >
                <span class="portfolio-chatbot-trigger-label">
                    Ask about my work
                </span>
                <span class="portfolio-chatbot-trigger-icon" aria-hidden="true">
                    ↗
                </span>
            </button>

            <section
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
                            Ask about Saheli's work
                        </h2>
                    </div>

                    <button
                        class="portfolio-chatbot-close"
                        type="button"
                        aria-label="Close portfolio navigator"
                    >
                        ×
                    </button>

                </header>


                <div
                    class="portfolio-chatbot-messages"
                    aria-live="polite"
                    aria-label="Conversation"
                ></div>


                <div class="portfolio-chatbot-suggestions-wrapper">

                    <button
                        class="portfolio-chatbot-suggestions-toggle"
                        type="button"
                        aria-expanded="true"
                    >
                        <span>
                            Suggested questions
                        </span>

                        <span
                            class="portfolio-chatbot-suggestions-icon"
                            aria-hidden="true"
                        >
                            −
                        </span>
                    </button>

                    <div class="portfolio-chatbot-suggestions"></div>

                </div>


                <div class="portfolio-chatbot-actions">

                    <button
                        class="portfolio-chatbot-reset"
                        type="button"
                    >
                        <span aria-hidden="true">↻</span>
                        Start over
                    </button>

                    <a
                        class="portfolio-chatbot-contact"
                        href="${CONFIG.contactUrl}"
                    >
                        Contact Saheli
                        <span aria-hidden="true">→</span>
                    </a>

                </div>


                <form class="portfolio-chatbot-form">

                    <input
                        class="portfolio-chatbot-input"
                        type="text"
                        placeholder="Ask about Saheli's work..."
                        autocomplete="off"
                        aria-label="Ask a question"
                    />

                    <button
                        class="portfolio-chatbot-send"
                        type="submit"
                        aria-label="Send question"
                    >
                        →
                    </button>

                </form>

            </section>
        `;

        document.body.appendChild(chatbot);

        panel = chatbot.querySelector(".portfolio-chatbot-panel");
        messages = chatbot.querySelector(".portfolio-chatbot-messages");
        suggestionsWrapper = chatbot.querySelector(
            ".portfolio-chatbot-suggestions-wrapper"
        );
        suggestionsContainer = chatbot.querySelector(
            ".portfolio-chatbot-suggestions"
        );
        suggestionsToggle = chatbot.querySelector(
            ".portfolio-chatbot-suggestions-toggle"
        );
        form = chatbot.querySelector(".portfolio-chatbot-form");
        input = chatbot.querySelector(".portfolio-chatbot-input");
    }


    /* =========================================================
       EVENT BINDINGS
    ========================================================= */

    function bindEvents() {
        const trigger = chatbot.querySelector(
            ".portfolio-chatbot-trigger"
        );

        const closeButton = chatbot.querySelector(
            ".portfolio-chatbot-close"
        );

        const resetButton = chatbot.querySelector(
            ".portfolio-chatbot-reset"
        );


        trigger.addEventListener("click", function () {
            if (isOpen) {
                closeChatbot();
            } else {
                openChatbot();
            }
        });


        closeButton.addEventListener("click", function () {
            closeChatbot();
        });


        suggestionsToggle.addEventListener("click", function () {
            toggleSuggestions();
        });


        resetButton.addEventListener("click", function () {
            resetChatbot();
        });


        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const question = input.value.trim();

            if (!question) {
                return;
            }

            handleQuestion(question);
        });


        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && isOpen) {
                closeChatbot();
            }
        });
    }


    /* =========================================================
       OPEN / CLOSE
    ========================================================= */

    function openChatbot() {
        isOpen = true;

        chatbot.classList.add("is-open");

        panel.setAttribute("aria-hidden", "false");

        const trigger = chatbot.querySelector(
            ".portfolio-chatbot-trigger"
        );

        trigger.setAttribute("aria-expanded", "true");

        window.setTimeout(function () {
            input.focus();
            scrollMessagesToBottom();
        }, 100);
    }


    function closeChatbot() {
        isOpen = false;

        chatbot.classList.remove("is-open");

        panel.setAttribute("aria-hidden", "true");

        const trigger = chatbot.querySelector(
            ".portfolio-chatbot-trigger"
        );

        trigger.setAttribute("aria-expanded", "false");
    }


    /* =========================================================
       SUGGESTIONS
    ========================================================= */

    function renderSuggestions() {
        if (!suggestionsContainer) {
            return;
        }

        suggestionsContainer.innerHTML = "";

        CONFIG.suggestions.forEach(function (question) {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "portfolio-chatbot-suggestion";
            button.textContent = question;

            button.addEventListener("click", function () {
                handleQuestion(question);
            });

            suggestionsContainer.appendChild(button);
        });
    }


    function expandSuggestions() {
        suggestionsWrapper.classList.remove("is-collapsed");

        suggestionsToggle.setAttribute("aria-expanded", "true");

        suggestionsToggle.querySelector(
            ".portfolio-chatbot-suggestions-toggle span:first-child"
        ).textContent = "Suggested questions";

        suggestionsToggle.querySelector(
            ".portfolio-chatbot-suggestions-icon"
        ).textContent = "−";
    }


    function collapseSuggestions() {
        suggestionsWrapper.classList.add("is-collapsed");

        suggestionsToggle.setAttribute("aria-expanded", "false");

        suggestionsToggle.querySelector(
            ".portfolio-chatbot-suggestions-toggle span:first-child"
        ).textContent = "Explore more questions";

        suggestionsToggle.querySelector(
            ".portfolio-chatbot-suggestions-icon"
        ).textContent = "+";
    }


    function toggleSuggestions() {
        if (suggestionsWrapper.classList.contains("is-collapsed")) {
            expandSuggestions();
        } else {
            collapseSuggestions();
        }
    }


    /* =========================================================
       QUESTION HANDLING
    ========================================================= */

    function handleQuestion(question) {
        const cleanQuestion = question.trim();

        if (!cleanQuestion) {
            return;
        }

        addUserMessage(cleanQuestion);

        input.value = "";

        collapseSuggestions();

        window.setTimeout(function () {
            const result = findAnswer(cleanQuestion);

            addAssistantMessage(
                result.text,
                result.section || null
            );
        }, 180);
    }


    /* =========================================================
       ANSWER ENGINE
    ========================================================= */

    function findAnswer(question) {
        const data = getPortfolioData();

        if (!data) {
            return {
                text:
                    "I couldn't load the portfolio information. Please refresh the page and try again.",
                section: null
            };
        }


        const q = question
            .toLowerCase()
            .replace(/[’']/g, "")
            .trim();


        /* -----------------------------------------------------
           CONTACT
        ----------------------------------------------------- */

        if (
            containsAny(q, [
                "contact",
                "email",
                "hire",
                "work with",
                "opportunity",
                "get in touch",
                "linkedin"
            ])
        ) {
            return {
                text: buildContactResponse(data),
                section: "contact"
            };
        }


        /* -----------------------------------------------------
           ASSESSMENT / WORKERA / HAWK
           Keep this BEFORE generic skills/capabilities.
        ----------------------------------------------------- */

        if (
            containsAny(q, [
                "workera",
                "hawk",
                "assessment",
                "assessment design",
                "assessment development",
                "assessment developer",
                "skills intelligence",
                "skill intelligence",
                "measurement design",
                "competency",
                "competencies",
                "blueprint",
                "assessment blueprint",
                "scenario",
                "item design",
                "item writing",
                "evidence centered design",
                "evidence-centred design",
                "ecd",
                "construct",
                "assessment quality",
                "assessment qa"
            ])
        ) {
            return {
                text: buildAssessmentResponse(data),
                section: "assessment"
            };
        }


        /* -----------------------------------------------------
           LEARNING DESIGN
        ----------------------------------------------------- */

        if (
            containsAny(q, [
                "learning design",
                "instructional design",
                "curriculum",
                "curriculum design",
                "curriculum architecture",
                "teaching",
                "training",
                "facilitation",
                "course design",
                "learning experience",
                "learning development",
                "learning and development",
                "l&d",
                "guided project",
                "learning work"
            ])
        ) {
            return {
                text: buildLearningResponse(data),
                section: "learning"
            };
        }


        /* -----------------------------------------------------
           QUALITY OPERATIONS
        ----------------------------------------------------- */

        if (
            containsAny(q, [
                "quality operations",
                "quality assurance",
                "quality improvement",
                "continuous improvement",
                "governance",
                "quality governance",
                "incident",
                "incident response",
                "operational quality",
                "workflow",
                "escalation",
                "traceability",
                "root cause",
                "root-cause",
                "quality"
            ])
        ) {
            return {
                text: buildQualityResponse(data),
                section: "quality"
            };
        }


        /* -----------------------------------------------------
           APPLIED AI
        ----------------------------------------------------- */

        if (
            containsAny(q, [
                "artificial intelligence",
                "applied ai",
                "ai workflows",
                "ai evaluation",
                "automation",
                "agentic ai",
                "agents",
                "mcp",
                "llm",
                "llms",
                "human in the loop",
                "hitl",
                "responsible ai",
                "ai governance",
                "ai assisted",
                "ai-assisted",
                "prompting",
                "ai operations"
            ])
        ) {
            return {
                text: buildAIResponse(data),
                section: "quality"
            };
        }


        /* -----------------------------------------------------
           JOURNEY
        ----------------------------------------------------- */

        if (
            containsAny(q, [
                "journey",
                "career",
                "career path",
                "career journey",
                "professional journey",
                "how did saheli get here",
                "career progression",
                "experience progression",
                "career evolve",
                "professional path"
            ])
        ) {
            return {
                text: buildJourneyResponse(data),
                section: "journey"
            };
        }


        /* -----------------------------------------------------
           PROJECTS
        ----------------------------------------------------- */

        if (
            containsAny(q, [
                "projects",
                "portfolio projects",
                "analytics",
                "data projects",
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
                "learner segmentation"
            ])
        ) {
            return {
                text: buildProjectsResponse(data),
                section: "projects"
            };
        }


        /* -----------------------------------------------------
           CAPABILITIES
        ----------------------------------------------------- */

        if (
            containsAny(q, [
                "capabilities",
                "what can you do",
                "expertise",
                "professional skills",
                "technical skills",
                "tools",
                "skills"
            ])
        ) {
            return {
                text: buildCapabilitiesResponse(data),
                section: "capabilities"
            };
        }


        /* -----------------------------------------------------
           PHILOSOPHY
        ----------------------------------------------------- */

        if (
            containsAny(q, [
                "philosophy",
                "working philosophy",
                "approach",
                "how do you work",
                "how does saheli work",
                "systems thinking",
                "design approach",
                "method"
            ])
        ) {
            return {
                text: buildPhilosophyResponse(data),
                section: "profile"
            };
        }


        /* -----------------------------------------------------
           HELP
        ----------------------------------------------------- */

        if (
            containsAny(q, [
                "help",
                "what can i ask",
                "what can you tell me",
                "questions",
                "options"
            ])
        ) {
            return {
                text:
                    "You can ask me about Saheli's professional journey, learning design, assessment development, Workera, HAWK, quality operations, applied AI, projects, capabilities, working philosophy, or where to find something on the portfolio.",
                section: null
            };
        }


        /* -----------------------------------------------------
           GENERAL PROFILE
        ----------------------------------------------------- */

        if (
            containsAny(q, [
                "about",
                "who is saheli",
                "who",
                "saheli",
                "background",
                "profile",
                "professional profile",
                "what does saheli do",
                "what do you do",
                "what does she do"
            ])
        ) {
            return {
                text: buildProfileResponse(data),
                section: "profile"
            };
        }


        /* -----------------------------------------------------
           FALLBACK
        ----------------------------------------------------- */

        return {
            text:
                "I can help you explore Saheli's learning and assessment work, quality operations, applied AI, professional journey, projects, capabilities, or contact information. Try asking about one of those areas.",
            section: null
        };
    }


    /* =========================================================
       RESPONSE BUILDERS
    ========================================================= */

    function buildProfileResponse(data) {
        const item = data.profile;

        if (!item) {
            return "Saheli's profile information is available throughout the portfolio.";
        }

        return [
            item.answer,
            "",
            "Her work brings together learning and assessment design, curriculum architecture, quality and governance, operational intelligence, applied AI, and decision support."
        ].join("\n");
    }


    function buildJourneyResponse(data) {
        const item = data.journey;

        if (!item) {
            return "Saheli's professional journey is documented in the portfolio.";
        }

        let response = item.answer || "";

        if (Array.isArray(item.stages) && item.stages.length) {
            response += "\n\n";

            response += item.stages
                .map(function (stage) {
                    return "• " + stage.title + ": " + stage.description;
                })
                .join("\n");
        }

        return response;
    }


    function buildLearningResponse(data) {
        const item = data.learning;

        if (!item) {
            return "Saheli's learning-design work is documented in the portfolio.";
        }

        let response = item.answer || "";

        if (Array.isArray(item.platforms) && item.platforms.length) {
            response += "\n\n";

            response += item.platforms
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


    function buildAssessmentResponse(data) {
        const item = data.assessment;

        if (!item) {
            return "Saheli's assessment-development work is documented in the portfolio.";
        }

        let response = item.answer || "";


        if (item.workera) {
            response += "\n\n";

            response +=
                "At " +
                item.workera.organization +
                ", within the " +
                item.workera.team +
                ", I progressed from " +
                item.workera.progression +
                ".\n\n";

            if (item.workera.summary) {
                response += item.workera.summary;
            }

            if (Array.isArray(item.workera.skills)) {
                response += "\n\nKey areas included:\n";

                response += item.workera.skills
                    .map(function (skill) {
                        return "• " + skill;
                    })
                    .join("\n");
            }

            if (item.workera.hawk) {
                response += "\n\nHAWK:\n";
                response += item.workera.hawk;
            }

            if (item.workera.qualityOperations) {
                response += "\n\nQuality Operations:\n";
                response += item.workera.qualityOperations;
            }
        }


        if (item.designProcess) {
            response += "\n\n" + item.designProcess.title + ":\n";
            response += item.designProcess.description;
        }


        if (item.quality) {
            response += "\n\n" + item.quality.title + ":\n";
            response += item.quality.description;

            if (Array.isArray(item.quality.areas)) {
                response += "\n\n";
                response += item.quality.areas
                    .map(function (area) {
                        return "• " + area;
                    })
                    .join("\n");
            }
        }


        return response;
    }


    function buildQualityResponse(data) {
        const item = data.quality;

        if (!item) {
            return "Saheli's quality and continuous-improvement work is documented in the portfolio.";
        }

        let response = item.answer || "";


        if (item.framework) {
            response += "\n\n";

            response +=
                item.framework.title +
                ": " +
                item.framework.description;


            if (Array.isArray(item.framework.flow)) {
                response += "\n\nFlow: ";
                response += item.framework.flow.join(" → ");
            }


            if (Array.isArray(item.framework.concepts)) {
                response += "\n\nKey concepts:\n";

                response += item.framework.concepts
                    .map(function (concept) {
                        return "• " + concept;
                    })
                    .join("\n");
            }
        }


        if (Array.isArray(item.systems) && item.systems.length) {
            response += "\n\nRelated systems work:\n";

            response += item.systems
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


    function buildAIResponse(data) {
        const item = data.ai;

        if (!item) {
            return "Saheli's applied-AI work is documented in the portfolio.";
        }

        let response = item.answer || "";


        if (Array.isArray(item.caseStudies) && item.caseStudies.length) {
            response += "\n\nCase studies include:\n";

            response += item.caseStudies
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


        if (Array.isArray(item.tools) && item.tools.length) {
            response += "\n\nTools and approaches include:\n";

            response += item.tools
                .map(function (tool) {
                    return "• " + tool;
                })
                .join("\n");
        }


        return response;
    }


    function buildProjectsResponse(data) {
        const item = data.projects;

        if (!item) {
            return "Saheli's applied projects are documented in the portfolio.";
        }

        let response = item.answer || "";


        if (Array.isArray(item.projects) && item.projects.length) {
            response += "\n\n";

            response += item.projects
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


    function buildCapabilitiesResponse(data) {
        const item = data.capabilities;

        if (!item) {
            return "Saheli's core capabilities are documented in the portfolio.";
        }

        if (
            !Array.isArray(item.areas) ||
            item.areas.length === 0
        ) {
            return "Saheli's capabilities span learning, assessment, quality, operational intelligence, applied AI, and analytics.";
        }

        return item.areas
            .map(function (area) {
                return (
                    "• " +
                    area.title +
                    ": " +
                    area.description
                );
            })
            .join("\n");
    }


    function buildPhilosophyResponse(data) {
        const item = data.philosophy;

        if (!item) {
            return "Saheli approaches complex work through systems thinking, structured design, verification, and continuous improvement.";
        }

        let response = item.answer || "";


        if (Array.isArray(item.stages) && item.stages.length) {
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


    function buildContactResponse(data) {
        if (data.contact && data.contact.answer) {
            return data.contact.answer;
        }

        return "I'm open to professional conversations about learning and assessment design, capability development, quality operations, responsible AI approaches, decision support, and SysteMetic Learning.";
    }


    /* =========================================================
       MESSAGE RENDERING
    ========================================================= */

    function addUserMessage(text) {
        addMessage("user", text);
    }


    function addAssistantMessage(text, section) {
        addMessage("assistant", text, section);
    }


    function addMessage(type, text, section) {
        const message = document.createElement("div");

        message.className =
            "portfolio-chatbot-message portfolio-chatbot-message-" +
            type;


        const bubble = document.createElement("div");

        bubble.className =
            "portfolio-chatbot-message-bubble";


        bubble.innerHTML = formatText(text);

        message.appendChild(bubble);


        /*
         * Section navigation appears only on assistant
         * responses that have a known portfolio destination.
         */
        if (type === "assistant" && section) {
            const target = getSectionTarget(section);

            if (target && document.querySelector(target)) {
                const navigation = document.createElement("button");

                navigation.type = "button";

                navigation.className =
                    "portfolio-chatbot-section-link";

                navigation.innerHTML = `
                    <span>
                        Explore ${escapeHTML(getSectionLabel(section))}
                    </span>
                    <span aria-hidden="true">→</span>
                `;

                navigation.addEventListener("click", function () {
                    navigateToSection(section);
                });

                message.appendChild(navigation);
            }
        }


        messages.appendChild(message);

        scrollMessagesToBottom();
    }


    /* =========================================================
       TEXT FORMATTING
    ========================================================= */

    function formatText(text) {
        if (!text) {
            return "";
        }

        return escapeHTML(text)
            .replace(/\n\n/g, "<br><br>")
            .replace(/\n/g, "<br>");
    }


    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =========================================================
       HELPERS
    ========================================================= */

    function containsAny(text, terms) {
        return terms.some(function (term) {
            return text.includes(term);
        });
    }


    function scrollMessagesToBottom() {
        if (!messages) {
            return;
        }

        window.requestAnimationFrame(function () {
            messages.scrollTop = messages.scrollHeight;
        });
    }


    /* =========================================================
       RESET
    ========================================================= */

    function resetChatbot() {
        messages.innerHTML = "";

        input.value = "";

        expandSuggestions();

        addAssistantMessage(CONFIG.greeting);

        scrollMessagesToBottom();

        window.setTimeout(function () {
            input.focus();
        }, 80);
    }


    /* =========================================================
       INITIALIZATION
    ========================================================= */

    function init() {
        createChatbot();

        bindEvents();

        renderSuggestions();

        addAssistantMessage(CONFIG.greeting);

        expandSuggestions();
    }


    /* =========================================================
       START
    ========================================================= */

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
