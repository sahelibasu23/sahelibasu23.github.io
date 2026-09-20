/*
 * Saheli Basu Portfolio — Chatbot Knowledge Base
 * ------------------------------------------------
 * This file contains the public-safe information the
 * portfolio navigator is allowed to use.
 *
 * No external API.
 * No private information.
 * No backend.
 */

const PORTFOLIO_DATA = {

    identity: {
        name: "Saheli Basu",
        title: "Learning & Assessment • Quality Operations • Responsible AI",
        description:
            "I work at the intersection of learning, assessment, operational improvement, and applied AI.",
        philosophy:
            "The best systems, practices, and technologies do not replace expert judgement; they make good judgement easier, more consistent, and more scalable."
    },

    navigation: {
        home: "#home",
        profile: "#profile",
        journey: "#journey",
        learning: "#teaching",
        assessment: "#assessment-design",
        quality: "#systems",
        impact: "#impact",
        projects: "#projects",
        capabilities: "#capabilities",
        contact: "#contact"

    }, 

    profile: {
        keywords: [
            "about",
            "who",
            "saheli",
            "background",
            "profile",
            "professional profile",
            "experience",
            "what does saheli do",
            "what do you do"
        ],

        title: "Professional profile",

        answer:
            "I work at the intersection of learning, assessment, operational improvement, and applied AI. My approach brings together learning expertise, assessment practice, systems thinking, and responsible technology to strengthen capability development, improve quality, and support better decisions.",

        details: [
            "Learning and assessment design",
            "Curriculum architecture",
            "Assessment development",
            "Quality and governance",
            "Operational intelligence",
            "Applied AI workflows",
            "Decision support",
            "Learning analytics and delivery"
        ],

        section: "profile"
    },

    journey: {
        keywords: [
            "journey",
            "career",
            "career path",
            "career journey",
            "professional journey",
            "how did saheli get here",
            "background",
            "career progression",
            "experience progression"
        ],

        title: "Professional journey",

        answer:
            "My professional path moved from service operations into applied learning design, then into assessment development and the systems that keep learning and measurement trustworthy at scale. Quality operations, operational intelligence, and applied AI added new ways to strengthen the same core practice: turning complex information into usable capability, reliable evidence, and better decisions.",

        stages: [
            {
                title: "Telecommunications operations",
                description:
                    "Creating service visibility through coordination, documentation, follow-up, and customer communication."
            },
            {
                title: "Applied learning design",
                description:
                    "Building capability through guided, project-based learning, instructional content, practical assessments, learner communities, and platform feedback."
            },
            {
                title: "Learning & assessment development",
                description:
                    "Designing learning and measuring capability through competencies, skills frameworks, taxonomies, blueprints, scenarios, assessments, and lifecycle quality."
            },
            {
                title: "Quality operations",
                description:
                    "Building accountable workflows through governance, ownership, escalation, incident response, and traceability."
            },
            {
                title: "Operational intelligence",
                description:
                    "Turning signals into action through pattern recognition, prioritization, capacity insight, and decision support."
            },
            {
                title: "Applied AI",
                description:
                    "Using AI-native products, LLMs, agent and MCP workflows, verification, source boundaries, and human-in-the-loop controls responsibly."
            }
        ],

        section: "journey"
    },

    learning: {
        keywords: [
            "learning",
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
            "l&d"
        ],

        title: "Learning design, teaching & curriculum architecture",

        answer:
            "Learning design and hands-on instruction have stayed at the center of my work since 2020. I design guided projects, workforce-oriented learning experiences, instructor-led content, learner communities, and structured professional learning. I also work across curriculum architecture, assessment alignment, platform evaluation, product feedback, and learning-outcome measurement.",

        platforms: [
            {
                name: "Coursera",
                role: "Guided Project Instructor, Community Guided Project Author & Group Leader",
                work:
                    "Project-based learning, learner-community support, platform usability feedback, learner-flow analysis, product evaluation, and guided project design."
            },
            {
                name: "Alison",
                role: "Course Instructor & Publisher",
                work:
                    "Workforce-oriented learning experiences connecting instructional content, practical assessments, and measurable learning outcomes."
            },
            {
                name: "Payhip | SysteMetic Learning",
                role: "Curriculum Architect & Operations Designer",
                work:
                    "End-to-end professional learning ecosystem design spanning curriculum architecture, instructional design, learning-product design, content development, platform operations, and workflow/process design."
            }
        ],

        section: "learning-design"
    },

    assessment: {
        keywords: [
            "assessment",
            "assessment design",
            "assessment development",
            "assessment developer",
            "assessment developer",
            "workera",
            "skills intelligence",
            "measurement",
            "measurement design",
            "skills",
            "skill intelligence",
            "competency",
            "competencies",
            "blueprint",
            "assessment blueprint",
            "scenario",
            "item design",
            "item writing",
            "evidence",
            "evidence centered design",
            "ecd",
            "construct",
            "assessment qa",
            "assessment quality",
            "hawk"
        ],

        title: "Assessment Development · Skills Intelligence · Measurement Design",

        answer:
            "My assessment-development work extends learning design into measurement: defining what a skill means, identifying what competent performance should look like, and designing assessment experiences that can produce meaningful evidence of capability.",

        workera: {
            organization: "Workera",
            team: "Learning & Assessment",
            progression: "Assessment Developer → Senior Assessment Developer",

            summary:
                "At Workera, I contributed to skills-based assessments across professional, analytical, behavioral, and technical domains. The work began before item writing: interpreting domains, structuring capabilities into measurable skills, defining evidence for proficiency claims, and translating that architecture into coherent assessment experiences.",

            skills: [
                "Skills architecture",
                "Competency modeling",
                "Construct definition",
                "Assessment blueprinting",
                "Observable-skill definition",
                "Skills-to-item alignment",
                "Taxonomy thinking",
                "Assessment design"
            ],

            hawk:
                "I also took on functional leadership across HAWK, the assessment product's quality layer, coordinating item-quality triage and contributing to quality assurance across the assessment lifecycle.",

            qualityOperations:
                "I led Quality Operations within the assessment team, supporting the operational systems and processes used to maintain assessment quality."
        },

        designProcess: {
            title: "From skills to evidence",

            stages: [
                "Framework",
                "Blueprint",
                "Scenario",
                "Assessment"
            ],

            description:
                "I translated skill frameworks into assessment plans connecting target skills to observable evidence and suitable interaction types. This included contextual scenario design, format selection, cognitive-demand considerations, coverage and traceability, and review of whether an item measured the intended capability rather than incidental knowledge."
        },

        quality: {
            title: "Assessment quality & iteration",

            description:
                "Assessment development continued beyond initial authoring. I worked with assessment metadata, learner-performance signals, feedback, and review evidence to support item and assessment maintenance.",

            areas: [
                "Construct alignment",
                "Clarity",
                "Accessibility and fairness",
                "Scoring logic",
                "Coverage",
                "Governance",
                "Versioning",
                "Evidence-informed iteration"
            ]
        },

        section: "assessment-design"
    },

    quality: {
        keywords: [
            "quality",
            "quality assurance",
            "qa",
            "quality operations",
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
            "root-cause analysis"
        ],

        title: "Quality & Continuous Improvement",

        answer:
            "My quality work extends beyond designing learning and assessments to improving how they perform in practice and evolve over time. This includes quality frameworks, review and governance, assessment and operational evidence, recurring-pattern analysis, and workflows that make improvement more consistent and actionable.",

        framework: {
            title: "Quality Monitoring & Incident Response Framework",

            description:
                "A governance-led operating model for detecting, validating, classifying, routing, tracking, and resolving high-priority quality issues across multiple signal channels.",

            flow: [
                "Signals",
                "Validation",
                "Decision",
                "Action",
                "Learning"
            ],

            concepts: [
                "Multi-channel intake",
                "Incident hierarchy",
                "Ownership and escalation",
                "Auditability",
                "Institutional memory",
                "Continuous improvement"
            ]
        },

        systems: [
            {
                title: "Designing and Maintaining Competency-Based Assessment Systems",
                description:
                    "Frameworks, taxonomies, blueprints, item quality, validation, calibration, and lifecycle maintenance."
            },
            {
                title: "Operationalizing Assessment Quality at Scale",
                description:
                    "Capacity, cadence, ownership, assignment models, backlog control, and sustained quality execution."
            },
            {
                title: "Evaluating AI-Assisted Workflows for Assessment Operations",
                description:
                    "Agent, MCP, source-boundary, verification, governance, and implementation-readiness testing."
            },
            {
                title: "Designing Human-in-the-Loop Automation for Assessment Appeals",
                description:
                    "Appeals classification, confidence separation, recurring patterns, calibration, and safety boundaries."
            },
            {
                title: "Turning Distributed Quality Signals into Operational Intelligence",
                description:
                    "Signal validation, recurrence detection, historical context, prioritization, and action-oriented interpretation."
            }
        ],

        section: "quality-improvement"
    },

    ai: {
        keywords: [
            "ai",
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
        ],

        title: "Applied AI & responsible automation",

        answer:
            "I use AI-native products and LLMs for research, synthesis, learning and assessment content development, workflow acceleration, and evaluation. My approach emphasizes verification, source boundaries, governance, implementation readiness, and human-in-the-loop controls rather than treating AI as a replacement for expert judgement.",

        caseStudies: [
            {
                title: "Evidence-Grounded AI Operations Workflow",
                description:
                    "A retrospective case study documenting how an agentic AI workflow extended an established quality-operations framework through evidence retrieval, classification, recurring analysis, reporting, and decision preparation while preserving accountable human judgement."
            },
            {
                title: "From AI Assistant to Connected Operations Skill",
                description:
                    "A retrospective case study documenting the evolution of a quality-triage workflow from manual operations, through AI-assisted analysis and documentation, to connector-assisted execution with verification and human accountability."
            },
            {
                title: "Evaluating AI-Assisted Workflows for Assessment Operations",
                description:
                    "Structured testing of agent, MCP, source-boundary, verification, governance, and implementation-readiness considerations."
            }
        ],

        tools: [
            "Claude",
            "ChatGPT",
            "Gemini",
            "Copilot",
            "Agent workflows",
            "MCP workflows"
        ],

        section: "quality-improvement"
    },

    projects: {
        keywords: [
            "projects",
            "project",
            "portfolio projects",
            "analytics",
            "data",
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
        ],

        title: "Applied decision-support projects",

        answer:
            "I build independent tools that turn analysis into practical decisions. These projects use analytical methods, explainable models, and accessible interfaces to structure decisions, make assumptions visible, and give users a practical next step.",

        projects: [
            {
                title: "Capacity & Workload Planning Intelligence",
                category: "Operations analytics",
                description:
                    "A tool for forecasting workload demand, surfacing capacity pressure, and comparing staffing scenarios."
            },
            {
                title: "Organizational Knowledge Flow Intelligence",
                category: "Process intelligence",
                description:
                    "A graph-based project for mapping handoffs, identifying bottlenecks, and examining how knowledge moves across teams."
            },
            {
                title: "Quality Escalation Intelligence System",
                category: "Assessment analytics",
                description:
                    "A system combining quality signals, operational context, and explainable scoring into a structured escalation view."
            },
            {
                title: "Learning Path Optimization Studio",
                category: "Learning analytics",
                description:
                    "A project analyzing learner progression, identifying pathway patterns, and supporting transparent next-action recommendations."
            }
        ],

        section: "projects"
    },

    capabilities: {
        keywords: [
            "capabilities",
            "skills",
            "what can you do",
            "expertise",
            "competencies",
            "professional skills",
            "tools",
            "technical skills"
        ],

        title: "Capabilities",

        areas: [
            {
                title: "Learning & Facilitation",
                description:
                    "Learner and stakeholder needs analysis, learning objectives, instructional design, guided projects, workforce-oriented courses, curriculum architecture, scenario-based projects, learner communities, platform evaluation, product feedback, and outcome measurement."
            },
            {
                title: "Assessment Development",
                description:
                    "Competencies, skills taxonomies, blueprints, item banks, expected-answer models, calibration practices, and lifecycle review."
            },
            {
                title: "Quality & Governance",
                description:
                    "Incident classification, escalation paths, operating models, SOPs, issue hierarchies, traceability, root-cause analysis, and continuous improvement."
            },
            {
                title: "Operational Intelligence",
                description:
                    "Pattern analysis, prioritization, capacity insight, operational reporting, historical context, and action-oriented interpretation."
            },
            {
                title: "Applied AI Evaluation",
                description:
                    "Structured experimentation, source-boundary testing, failure analysis, verification controls, implementation-readiness assessment, and human-in-the-loop design."
            },
            {
                title: "Analytics & Delivery",
                description:
                    "Python, SQL, dashboards, forecasting, risk scoring, Linear, Slack, Slab, GitHub, Google Workspace, Microsoft 365, web-based and proprietary LMS platforms, and AI tools for research and drafting support."
            }
        ],

        section: "capabilities"
    },

    philosophy: {
        keywords: [
            "philosophy",
            "working philosophy",
            "approach",
            "how do you work",
            "how does saheli work",
            "systems thinking",
            "design approach",
            "method"
        ],

        title: "Working philosophy",

        answer:
            "I approach complex learning and operational challenges as connected systems: clarifying signals, preserving context, defining decision paths, and identifying where technology can support better outcomes without weakening expert accountability.",

        stages: [
            {
                title: "Analyze",
                description:
                    "Understand the gap between current and desired performance, who is affected, what constraints exist, and what evidence is available."
            },
            {
                title: "Design",
                description:
                    "Shape the analyzed need into objectives, blueprints, storyboards, workflow maps, or other structures before building."
            },
            {
                title: "Develop & Implement",
                description:
                    "Turn the structure into learning content, assessments, or operational systems with verification and safeguards."
            },
            {
                title: "Evaluate & Sustain",
                description:
                    "Use ongoing monitoring, traceable decisions, consistent states, and usable records to support continuous improvement."
            }
        ],

        section: "profile"
    },

    contact: {
        keywords: [
            "contact",
            "email",
            "hire",
            "work with",
            "opportunity",
            "professional inquiry",
            "get in touch",
            "linkedin"
        ],

        title: "Professional inquiries",

        answer:
            "I'm open to conversations about learning and assessment design, capability development, quality operations, responsible AI approaches, decision support, and SysteMetic Learning.",

        section: "contact"
    },

    help: {
        keywords: [
            "help",
            "what can i ask",
            "what can you tell me",
            "questions",
            "options"
        ],

        title: "What you can ask",

        answer:
            "You can ask me about Saheli's professional journey, learning design, assessment development, Workera, HAWK, quality operations, applied AI, projects, capabilities, working philosophy, or where to find something on the portfolio."
    }
};