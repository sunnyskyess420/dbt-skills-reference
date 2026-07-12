// DBT Skills Reference Database
// Content paraphrased educationally from Marsha M. Linehan's
// "DBT Skills Training Handouts and Worksheets, Second Edition" (Guilford Press, 2014).
// References point back to the printed book by handout/worksheet number so the user
// can find the original handouts/worksheets for printing or filling out.

export type Module =
  | "general"
  | "mindfulness"
  | "interpersonal"
  | "emotion-regulation"
  | "distress-tolerance";

export interface Skill {
  id: string;
  module: Module;
  category: string;
  name: string;
  acronym?: string;
  oneLiner: string;
  description: string;
  whenToUse?: string[];
  steps?: string[];
  tips?: string[];
  examples?: string[];
  tags: string[];
  reference: string; // handout / worksheet number(s) in the printed book
}

export const MODULES: {
  id: Module;
  name: string;
  short: string;
  color: string; // tailwind text color class for accents
  description: string;
}[] = [
  {
    id: "general",
    name: "General Skills",
    short: "General",
    color: "text-slate-600 dark:text-slate-300",
    description:
      "Orientation to DBT, the biosocial theory behind emotion dysregulation, and the two core behavior-analysis skills: chain analysis and missing-links analysis.",
  },
  {
    id: "mindfulness",
    name: "Mindfulness Skills",
    short: "Mindfulness",
    color: "text-emerald-600 dark:text-emerald-400",
    description:
      "Core skills for observing, describing, and participating in experience with nonjudgmentalness, one-mindfulness, and effectiveness. Foundation for every other DBT module.",
  },
  {
    id: "interpersonal",
    name: "Interpersonal Effectiveness Skills",
    short: "Interpersonal",
    color: "text-amber-600 dark:text-amber-400",
    description:
      "Skills for asking for what you need, saying no, keeping relationships, maintaining self-respect, navigating conflict, and walking the middle path.",
  },
  {
    id: "emotion-regulation",
    name: "Emotion Regulation Skills",
    short: "Emotion",
    color: "text-rose-600 dark:text-rose-400",
    description:
      "Skills for understanding and naming emotions, changing unwanted emotional responses, reducing vulnerability to emotion mind, and managing really difficult emotions.",
  },
  {
    id: "distress-tolerance",
    name: "Distress Tolerance Skills",
    short: "Distress",
    color: "text-sky-600 dark:text-sky-400",
    description:
      "Crisis survival skills for tolerating painful events and urges without making things worse, plus reality acceptance skills for reducing suffering.",
  },
];

export const SKILLS: Skill[] = [
  // =================== GENERAL SKILLS ===================
  {
    id: "goals-of-skills-training",
    module: "general",
    category: "Orientation",
    name: "Goals of Skills Training",
    oneLiner:
      "The overarching aim of DBT: build a life experienced as worth living by combining acceptance and change.",
    description:
      "DBT skills training aims to increase resilience and help you build a life worth living. The skills teach a synthesis of how to change what is and how to accept what is. You learn both how to change unwanted behaviors, emotions, thoughts, and situations that cause misery, and how to live in the moment, accepting reality as it is.",
    whenToUse: [
      "At the start of skills training, to clarify what you are working toward",
      "Whenever you feel lost and need to reconnect with the bigger 'why' of practice",
      "When reviewing your pros/cons of using skills (see General Worksheet 1)",
    ],
    tips: [
      "A life worth living means different things to different people — define it for yourself",
      "Skills training is not just about reducing pain; it is about increasing what is meaningful",
      "Acceptance and change are both happening at the same time, not in sequence",
    ],
    tags: ["goals", "orientation", "life worth living", "acceptance and change", "overview"],
    reference: "General Handout 1 / General Worksheet 1",
  },
  {
    id: "options-for-solving-any-problem",
    module: "general",
    category: "Orientation",
    name: "Options for Solving Any Problem",
    oneLiner:
      "Four universal options for any problem: solve it, feel better about it, accept it, or stay miserable.",
    description:
      "When you face any problem, you have essentially four options. (1) Solve the problem — change the situation or your reaction. (2) Feel better about the problem — change how you feel without changing the situation. (3) Accept the problem — radically accept the situation as it is, with no goal of changing it. (4) Stay miserable — keep doing what you are doing now. DBT skills map onto options 1, 2, and 3.",
    whenToUse: [
      "Whenever you feel stuck and unsure which skill to reach for",
      "To clarify your goal before picking a specific skill",
    ],
    steps: [
      "Name the problem clearly",
      "Ask: which option am I choosing right now?",
      "If option 4 (stay miserable) — pause and ask if that's really what you want",
      "Match the option to a skill family: problem-solving skills, emotion-regulation skills, or acceptance skills",
    ],
    tags: ["problem solving", "options", "overview", "framework"],
    reference: "General Handout 1a",
  },
  {
    id: "biosocial-theory",
    module: "general",
    category: "Orientation",
    name: "Biosocial Theory",
    oneLiner:
      "Emotion dysregulation develops from the transaction between biological emotional sensitivity and an invalidating environment.",
    description:
      "Biosocial theory is DBT's explanation of why some people find it hard to manage their emotions and actions. The 'bio' part is emotional sensitivity — some people are biologically predisposed to react more quickly, more intensely, and more slowly to return to baseline. The 'social' part is an invalidating environment — one that dismisses, punishes, or trivializes the person's emotional experiences, often teaching them to distrust their own feelings. The transaction between the two over time produces the patterns DBT targets: emotional vulnerability, self-invalidation, and difficulty regulating intense emotions.",
    whenToUse: [
      "To understand (without blame) where your patterns came from",
      "When you catch yourself invalidating your own emotions",
      "When explaining DBT to family or supportive others",
    ],
    tips: [
      "Biosocial theory is descriptive, not diagnostic — it does not require a specific diagnosis",
      "It is not about fault. Both factors are transactions, not causes by themselves",
    ],
    tags: ["biosocial", "theory", "invalidation", "emotional sensitivity", "framework"],
    reference: "General Handout 5",
  },
  {
    id: "chain-analysis",
    module: "general",
    category: "Analyzing Behavior",
    name: "Chain Analysis",
    oneLiner:
      "A step-by-step map of everything that led up to and followed a specific problem behavior — to find the links you can change.",
    description:
      "Chain analysis is the core DBT tool for understanding a specific instance of a problem behavior (e.g., self-harm, a binge, an outburst, drinking). You trace the sequence of events, thoughts, feelings, body sensations, and environmental factors that led up to the behavior, the behavior itself, and the consequences that followed. The goal is to identify the 'links' in the chain where you could have used a different skill — and to plan what you will do differently next time.",
    whenToUse: [
      "After any target behavior you want to reduce (the sooner the better)",
      "When you keep repeating a behavior and don't fully understand why",
      "When your therapist asks you to fill one out between sessions",
    ],
    steps: [
      "Describe the specific problem behavior precisely (what, when, where, how)",
      "Describe the prompting event — what started the chain (the 'first link')",
      "Describe vulnerabilities: were you tired, hungry, sick, intoxicated, stressed, lonely?",
      "List each link in order: events, thoughts, feelings, body sensations, actions",
      "Describe the consequences of the behavior (both immediate and longer-term)",
      "Identify the links where a DBT skill could have changed the chain",
      "Plan what skill you will use at each key link next time",
    ],
    tips: [
      "Be specific — 'I felt bad' is too vague; 'I felt a tightness in my chest and the thought that nobody cares' is a link",
      "Don't judge yourself while doing it; this is mapping, not blaming",
      "Look for the earliest link you can intervene on — that's your highest-leverage point",
    ],
    tags: ["chain analysis", "behavior analysis", "worksheet", "problem behavior", "awareness"],
    reference: "General Handouts 7, 7a / General Worksheets 2, 2a",
  },
  {
    id: "missing-links-analysis",
    module: "general",
    category: "Analyzing Behavior",
    name: "Missing-Links Analysis",
    oneLiner:
      "Figuring out why you didn't use a skill you already know — what got in the way between knowing and doing.",
    description:
      "Missing-links analysis is used when you knew a skill that would have helped, but you didn't use it. Instead of analyzing the problem behavior (like chain analysis does), you analyze the gap between knowing the skill and using it. The goal is to identify what got in the way — was it forgetting in the moment, not recognizing the cue, believing the skill wouldn't work, fear of the skill working, or something else? Once the missing link is named, you can plan a strategy to close that specific gap.",
    whenToUse: [
      "When you 'knew better' but didn't do better",
      "When you keep forgetting to use a skill you've already learned",
      "When a skill 'doesn't work for you' — to find out whether it truly didn't work or whether it was never tried",
    ],
    steps: [
      "Name the skill you intended to use",
      "Name the situation where it should have been used",
      "Walk through what actually happened — find the precise point where the skill dropped out",
      "Identify the missing link: forgetting? not noticing? not believing it would work? fear? not knowing how to start?",
      "Plan a specific strategy to address that missing link (e.g., a reminder, a cue, an opposite action to the fear)",
    ],
    tips: [
      "The missing link is usually one specific thing — keep digging until you find it",
      "This is more useful than 'I should have tried harder' — it gives you a place to intervene",
    ],
    tags: ["missing links", "behavior analysis", "worksheet", "knowing vs doing"],
    reference: "General Handout 8 / General Worksheet 3",
  },

  // =================== MINDFULNESS SKILLS ===================
  {
    id: "wise-mind",
    module: "mindfulness",
    category: "Core Mindfulness Skills",
    name: "Wise Mind",
    oneLiner:
      "The integrated knowing that comes from combining reasonable mind and emotion mind — your deep, quiet inner wisdom.",
    description:
      "Wise Mind is the state of mind that integrates your reasonable mind (logical, fact-based, cool) and your emotion mind (hot, passion-driven, mood-based). It is the part of you that 'just knows' — the deep, quiet voice that speaks with both feeling and reason. Everyone has a Wise Mind, but accessing it takes practice, especially when emotions are intense. Wise Mind is not a compromise between emotion and reason; it is the synthesis that includes both.",
    whenToUse: [
      "When emotion mind and reasonable mind are in conflict",
      "Before making an important decision",
      "When you feel 'stuck' between acting on an urge and resisting it",
      "As the entry point to almost every other DBT skill",
    ],
    steps: [
      "Breathe in deeply, exhale slowly — several times",
      "Drop your attention to your belly or your center",
      "Ask yourself quietly: 'What does my Wise Mind say about this?'",
      "Don't rush — wait for the answer that feels like 'yes', not the first loud thought",
    ],
    tips: [
      "Wise Mind is often quiet; emotion mind is loud. Give it time to surface",
      "Practice when you don't need it — small daily decisions — so it's available when you do",
      "If you can't find it, you may be in pure emotion mind or pure reasonable mind; the goal is integration",
    ],
    examples: [
      "You're angry at a friend and want to send a harsh text. Wise Mind says: wait until tomorrow; you can still be honest",
      "You feel like quitting a job on a bad day. Wise Mind says: this job has problems, but quitting today isn't the move",
    ],
    tags: ["wise mind", "states of mind", "reason mind", "emotion mind", "core mindfulness"],
    reference: "Mindfulness Handouts 3, 3a / Mindfulness Worksheet 3",
  },
  {
    id: "what-skills",
    module: "mindfulness",
    category: "Core Mindfulness Skills",
    name: "What Skills: Observe, Describe, Participate",
    oneLiner:
      "Three things you can DO with your attention — observe (just notice), describe (put words on it), participate (throw yourself in fully).",
    description:
      "The 'What' skills are what you actually do with your mind in the present moment. You can only do ONE at a time. Observe is noticing experience without putting words on it. Describe is putting non-judgmental words on what you observed. Participate is entering fully into the activity without self-consciousness — like a skilled athlete or musician 'in the zone.' Together these skills train the capacity to be present, which underlies every other DBT skill.",
    whenToUse: [
      "To ground yourself when overwhelmed",
      "To build the foundational capacity for all other mindfulness practice",
      "Observe: when you need to step back from an emotion without acting on it",
      "Describe: when you need to communicate experience (to yourself or others) precisely",
      "Participate: when rumination or self-consciousness is getting in your way",
    ],
    steps: [
      "Observe: notice the experience (sensation, thought, feeling) without labeling it. Just let it come and go",
      "Describe: put words on what you observed, as a scientist would ('a thought that I am worthless arose', 'tightness in chest')",
      "Participate: throw yourself fully into the activity, no narration, no watching yourself",
    ],
    tips: [
      "Only do one at a time — they cannot be combined",
      "Observe is the hardest — most of us jump straight to describing or judging",
      "Describe is nonjudgmental: 'a feeling of sadness', not 'a stupid feeling I shouldn't have'",
      "Participate is like a child at play — fully absorbed, no inner narrator",
    ],
    tags: ["what skills", "observe", "describe", "participate", "core mindfulness", "present moment"],
    reference: "Mindfulness Handouts 4, 4a, 4b, 4c / Mindfulness Worksheets 4, 4a, 4b",
  },
  {
    id: "how-skills",
    module: "mindfulness",
    category: "Core Mindfulness Skills",
    name: "How Skills: Nonjudgmentalness, One-Mindfulness, Effectiveness",
    oneLiner:
      "HOW to do the What skills: without judgment, one thing at a time, focused on what works (not what's 'right').",
    description:
      "The 'How' skills describe the QUALITY you bring to the What skills (Observe, Describe, Participate). Nonjudgmentalness means sticking to the facts without adding 'good' or 'bad'. One-Mindfulness means doing one thing at a time, with your full attention. Effectiveness means doing what works in the situation rather than what's 'right' or 'should' be done. All three are needed for mindfulness to actually function.",
    whenToUse: [
      "Whenever you practice observe, describe, or participate",
      "Nonjudgmentalness: when you catch yourself labeling things as 'good/bad' or 'should/shouldn't'",
      "One-Mindfulness: when you're multitasking, distracted, or splitting attention",
      "Effectiveness: when you're being rigid about 'being right' instead of solving the problem",
    ],
    steps: [
      "Nonjudgmentalness: state the facts without evaluation. Replace 'I'm so stupid' with 'I made a mistake on this task'",
      "One-Mindfulness: do one thing at a time. When eating, eat. When listening, listen. When you notice you've drifted, come back",
      "Effectiveness: ask 'what will actually work here?' Let go of needing to be right",
    ],
    tips: [
      "Nonjudgmentalness does not equal approval — you can still act on what you observe, you just stop adding judgment",
      "One-mindfulness is not anti-multitasking as a rule — it's about being present with what's in front of you",
      "Effectiveness is the antidote to perfectionism — keep your eye on the goal",
    ],
    tags: ["how skills", "nonjudgmentalness", "one-mindfulness", "effectiveness", "core mindfulness"],
    reference: "Mindfulness Handouts 5, 5a, 5b, 5c / Mindfulness Worksheets 5, 5a, 5b, 5c",
  },
  {
    id: "loving-kindness",
    module: "mindfulness",
    category: "Other Perspectives",
    name: "Loving Kindness",
    oneLiner:
      "A practice of intentionally wishing well — to yourself, to loved ones, to neutral people, to difficult people, to all beings.",
    description:
      "Loving Kindness (metta) is a contemplative practice that cultivates love and compassion. You silently repeat phrases of well-wishing, starting with yourself and gradually extending outward to others, including people you find difficult. The goal is not to feel a particular way, but to repeatedly orient your attention toward goodwill — which over time builds the capacity for connection and reduces resentment.",
    whenToUse: [
      "When you're stuck in resentment or harsh self-criticism",
      "When you feel disconnected from others",
      "As a regular contemplative practice (e.g., daily or weekly)",
      "When you want to soften a relationship that has become adversarial",
    ],
    steps: [
      "Find a comfortable, quiet position",
      "Begin with yourself: silently repeat 'May I be happy. May I be healthy. May I be safe. May I live with ease.'",
      "Extend to a loved one: 'May you be happy...'",
      "Extend to a neutral person: 'May you be happy...'",
      "Extend to a difficult person: 'May you be happy...'",
      "Extend to all beings: 'May all beings be happy...'",
      "When the mind wanders, gently return to the phrases",
    ],
    tips: [
      "You don't have to feel love — the practice is the repetition",
      "If the difficult person feels impossible, pick a less-charged one and come back later",
      "Start small — even a few minutes counts",
    ],
    tags: ["loving kindness", "metta", "compassion", "spiritual", "other perspectives"],
    reference: "Mindfulness Handout 8 / Mindfulness Worksheet 6",
  },
  {
    id: "balancing-doing-and-being-mind",
    module: "mindfulness",
    category: "Other Perspectives",
    name: "Balancing Doing Mind and Being Mind",
    oneLiner:
      "Doing mind is goal-focused and future-oriented; Being mind is present-focused and accepting. Both are needed.",
    description:
      "Doing Mind is the state of being focused on goals, tasks, and outcomes — it's necessary, but when it dominates, life becomes a treadmill of striving and dissatisfaction. Being Mind is the state of resting in the present moment without needing to change anything — also necessary, but when it dominates, life becomes passive. The skill is to recognize which mode you're in and shift toward balance: working without attachment to outcomes, resting without guilt.",
    whenToUse: [
      "When you feel driven and exhausted, unable to rest",
      "When you feel passive and stuck, unable to engage",
      "When you've lost the sense of meaning in your activities",
    ],
    tips: [
      "Notice the mode, then make a small shift — not a complete reversal",
      "Doing mind often has a background narrative of 'not enough yet'",
      "Being mind is not laziness — it's a different relationship to the present",
    ],
    tags: ["doing mind", "being mind", "balance", "skillful means", "other perspectives"],
    reference: "Mindfulness Handouts 9, 9a / Mindfulness Worksheets 7, 7a",
  },
  {
    id: "walking-the-middle-path",
    module: "mindfulness",
    category: "Other Perspectives",
    name: "Walking the Middle Path",
    oneLiner:
      "Finding the synthesis between two opposites — not a compromise, but a third option that integrates both truths.",
    description:
      "Walking the Middle Path is the skill of dialectics applied to your own inner conflicts and to conflicts with others. Instead of either/or thinking ('I'm right and they're wrong' or 'I'm broken and need to change'), you look for the synthesis: both things can be true. You can accept yourself AND work to change. You can hold your position AND acknowledge the other person's valid point. The middle path is not splitting the difference — it's a higher-order integration.",
    whenToUse: [
      "When you're stuck in either/or thinking",
      "When you and another person are polarized",
      "When you feel pulled between acceptance and change",
    ],
    steps: [
      "Name the two opposing positions",
      "Look for what is true in each",
      "Ask: what would a synthesis look like that honors both?",
      "Practice moving — when you notice you've collapsed back into one side, turn the mind back toward the synthesis",
    ],
    tags: ["middle path", "dialectics", "synthesis", "opposites", "other perspectives"],
    reference: "Mindfulness Handout 10 / Mindfulness Worksheets 10, 10a, 10b",
  },

  // =================== INTERPERSONAL EFFECTIVENESS ===================
  {
    id: "dear-man",
    module: "interpersonal",
    category: "Obtaining Objectives Skillfully",
    name: "DEAR MAN",
    acronym: "DEAR MAN",
    oneLiner:
      "Objectives effectiveness — how to ask for what you want or say no in a way that actually gets results.",
    description:
      "DEAR MAN is the core DBT skill for obtaining your objectives in interpersonal situations: asking for what you want, saying no to what you don't want, and doing this effectively enough that the other person is more likely to say yes. Each letter is a step.",
    whenToUse: [
      "When you need to make a request",
      "When you need to say no or set a limit",
      "When you've been hinting and the other person isn't getting it",
    ],
    steps: [
      "D — Describe the situation factually (just the facts, no judgments). 'Three times this week, you canceled plans at the last minute.'",
      "E — Express your feeling or opinion about the situation. 'I feel hurt when that happens.'",
      "A — Assert yourself by asking for what you want or saying no. Be clear and direct. 'I'd like you to give me at least 24 hours notice if you need to cancel.'",
      "R — Reinforce the other person by pointing out the positive effect of giving you what you want. 'That would help me feel like I can count on you.'",
      "M — stay Mindful of your objective. Don't get derailed by attacks, changes of subject, or distractions. Use the broken-record technique if needed",
      "A — Appear confident (eye contact, tone, posture) — even if you don't feel it",
      "N — Negotiate if needed. Be willing to give something to get something. 'If 24 hours is too much, what would work for you?'",
    ],
    tips: [
      "Describe and Express are the warm-up; Assert is the main event — don't skip to it without context, but don't bury it either",
      "Reinforce is often skipped — don't. People are more likely to do things that have a payoff",
      "Mindfulness is the hardest part — distractions and counter-attacks will come",
    ],
    examples: [
      "Returning a defective product: 'This charger doesn't work after one use [D]. I'd like a refund [A]. I shop here a lot and want to keep doing so [R].'",
      "Setting a boundary with family: 'When you comment on my weight at dinner [D], I feel embarrassed and angry [E]. Please don't comment on my body [A]. It would make family dinners much easier for me [R].'",
    ],
    tags: ["dear man", "assertiveness", "asking", "saying no", "objectives", "interpersonal", "acronym"],
    reference: "Interpersonal Effectiveness Handouts 5, 5a / Interpersonal Effectiveness Worksheets 4, 5",
  },
  {
    id: "give",
    module: "interpersonal",
    category: "Obtaining Objectives Skillfully",
    name: "GIVE",
    acronym: "GIVE",
    oneLiner:
      "Relationship effectiveness — how to ask for what you want while keeping (or improving) the relationship.",
    description:
      "GIVE is the skill for relationship effectiveness: getting what you want in a way that the other person still likes you and wants to keep the relationship strong. Use GIVE alongside DEAR MAN when the relationship matters.",
    whenToUse: [
      "When you want to maintain or improve the relationship while making a request",
      "When the relationship is more important than getting exactly what you want",
      "When you're working through a conflict with someone you care about",
    ],
    steps: [
      "G — be Gentle: no attacks, no threats, no judging. Don't be contemptuous",
      "I — act Interested: listen to the other person's side. Don't interrupt. Take their perspective seriously",
      "V — Validate: acknowledge the other person's feelings, concerns, or difficulties. 'I know this is hard for you too.'",
      "E — use an Easy manner: smile, lighten the mood, use a little humor. Soften your approach",
    ],
    tips: [
      "Validation is the most powerful and most-skipped step — even one acknowledgment of their side can change the whole conversation",
      "Easy manner does not mean being unserious — it means being approachable, not antagonistic",
      "Threats and contempt damage the relationship more than the original conflict",
    ],
    tags: ["give", "relationship", "validation", "gentle", "interpersonal", "acronym"],
    reference: "Interpersonal Effectiveness Handouts 6, 6a / Interpersonal Effectiveness Worksheets 4, 5",
  },
  {
    id: "fast",
    module: "interpersonal",
    category: "Obtaining Objectives Skillfully",
    name: "FAST",
    acronym: "FAST",
    oneLiner:
      "Self-respect effectiveness — how to ask for what you want while keeping your self-respect and your values intact.",
    description:
      "FAST is the skill for self-respect effectiveness. While DEAR MAN gets you what you want and GIVE keeps the relationship, FAST keeps your self-respect. It is especially important when you have a pattern of giving in too much, over-apologizing, or compromising your values to keep the peace.",
    whenToUse: [
      "When you tend to give in too quickly or over-apologize",
      "When the request involves your values or dignity",
      "When you've been betraying yourself to keep the relationship smooth",
    ],
    steps: [
      "F — be Fair: to yourself AND to the other person. No double standards",
      "A — no Apologies: don't over-apologize for existing, for asking, for having needs. Don't apologize for being who you are",
      "S — Stick to your values: don't sell out your principles for approval or to avoid conflict",
      "T — be Truthful: don't lie, exaggerate, or make up excuses. Don't act helpless when you're not",
    ],
    tips: [
      "FAST is often in tension with GIVE — sometimes keeping self-respect costs something in the relationship",
      "Notice your apology habit — many people apologize for things that need no apology",
      "Sticking to values doesn't mean being rigid; it means knowing what you won't trade away",
    ],
    tags: ["fast", "self-respect", "values", "interpersonal", "acronym"],
    reference: "Interpersonal Effectiveness Handout 7 / Interpersonal Effectiveness Worksheets 4, 5",
  },
  {
    id: "dime-game",
    module: "interpersonal",
    category: "Obtaining Objectives Skillfully",
    name: "The Dime Game (Figuring Out How Strongly to Ask or Say No)",
    oneLiner:
      "A decision tool: tally factors to decide how intensely to ask for something or how firmly to say no.",
    description:
      "The Dime Game is a worksheet-style decision aid for figuring out HOW hard to push. You weigh factors (capability, priorities, timeliness, relationship, goals, harm) — each tilted toward asking firmly, asking softly, or not asking at all. Add up the factors and use the total to choose your intensity level. The point is not the exact number, but the structured weighing that prevents you from over- or under-asking.",
    whenToUse: [
      "When you're unsure whether to ask at all",
      "When you're unsure whether to push hard or back off",
      "When you keep over-asking or under-asking in similar situations",
    ],
    steps: [
      "Ask: is the person capable of giving me what I want? Yes — ask harder; No — ask softer",
      "Ask: is this a high priority for me right now? Yes — ask harder",
      "Ask: is now a good time? Yes — ask harder",
      "Ask: am I willing to give something to get something? Yes — ask harder",
      "Ask: is what I want appropriate to the relationship? Yes — ask harder",
      "Ask: am I clear and specific? Yes — ask harder",
      "Total the score — use it to choose your intensity",
    ],
    tags: ["dime game", "decision", "intensity", "asking", "interpersonal"],
    reference: "Interpersonal Effectiveness Handout 8 / Interpersonal Effectiveness Worksheet 6",
  },
  {
    id: "troubleshooting-interpersonal",
    module: "interpersonal",
    category: "Obtaining Objectives Skillfully",
    name: "Troubleshooting Interpersonal Effectiveness",
    oneLiner:
      "When DEAR MAN, GIVE, FAST aren't working — diagnose what's getting in the way and what to do about it.",
    description:
      "When you've tried the interpersonal skills and they didn't work, troubleshoot systematically. Common problems: skills were used but inconsistently; the relationship wasn't there to begin with; the goal was unrealistic; emotions hijacked the conversation; the situation itself is the problem (not your skills).",
    whenToUse: [
      "After a conversation where you used skills and it still didn't go well",
      "When you keep hitting the same wall with the same person",
      "When you're considering giving up on a relationship or a goal",
    ],
    tips: [
      "Sometimes the problem is that you're using skills perfectly but the other person is unable to respond — that's information, not failure",
      "Sometimes the issue is the situation itself: poverty, oppression, or chronic invalidation can't be skills'd away",
      "Consider whether your goal needs to shift from 'get what I want' to 'maintain self-respect' or 'end the relationship'",
    ],
    tags: ["troubleshooting", "interpersonal", "problem solving", "review"],
    reference: "Interpersonal Effectiveness Handout 9 / Interpersonal Effectiveness Worksheet 7",
  },
  {
    id: "finding-people-to-like-you",
    module: "interpersonal",
    category: "Building Relationships",
    name: "Finding and Getting People to Like You",
    oneLiner:
      "Skills for building new relationships: where to find people, how to start conversations, how to be likable.",
    description:
      "A set of practical skills for the early stages of relationships: identifying where to meet people who share your interests, starting and maintaining conversations, showing interest in others, and being the kind of person others enjoy being around. Often used when loneliness or social isolation is a target.",
    whenToUse: [
      "When you want to make new friends",
      "When you've been socially isolated",
      "When you keep starting relationships that don't go anywhere",
    ],
    tips: [
      "Show genuine interest in others — people like people who are curious about them",
      "Where you look matters: go where your interests are, not just where there are people",
      "Frequency of contact matters more than intensity — casual repeated contact builds friendship",
    ],
    tags: ["relationships", "friendship", "loneliness", "social skills"],
    reference: "Interpersonal Effectiveness Handouts 11, 11a / Interpersonal Effectiveness Worksheet 8",
  },
  {
    id: "mindfulness-of-others",
    module: "interpersonal",
    category: "Building Relationships",
    name: "Mindfulness of Others",
    oneLiner:
      "Paying attention to other people — their needs, feelings, and reactions — without losing yourself.",
    description:
      "Mindfulness of Others is the practice of being present with another person: noticing their mood, body language, words, and what they might need. It is not the same as self-abandonment — you stay aware of your own experience too. The skill builds attunement, which is the foundation of every healthy relationship.",
    whenToUse: [
      "When you've been self-focused and missing what's happening for the other person",
      "When conversations feel disconnected or one-sided",
      "Before making a request, to time it well",
    ],
    tips: [
      "Notice before you ask: is the other person in a state where they can hear me?",
      "Attunement is not agreement — you can be present with someone and still disagree",
      "Reactions are data — if the other person looks hurt, that's information regardless of intent",
    ],
    tags: ["mindfulness of others", "attunement", "relationships", "presence"],
    reference: "Interpersonal Effectiveness Handouts 12, 12a / Interpersonal Effectiveness Worksheet 9",
  },
  {
    id: "ending-relationships",
    module: "interpersonal",
    category: "Building Relationships",
    name: "Ending Relationships",
    oneLiner:
      "Skills for ending destructive relationships while preserving learning, self-respect, and safety.",
    description:
      "Ending a relationship is itself a skill. The goals are typically: to be clear about the decision, to communicate it appropriately (or sometimes not at all, for safety), to preserve the learning from the relationship, and to maintain self-respect. In cases of abuse, the priority is safety, not skillful communication.",
    whenToUse: [
      "When a relationship is destructive and can't be repaired",
      "When you've been avoiding ending a relationship that needs to end",
      "When ending a relationship but wanting to preserve your self-respect and the learning",
    ],
    tips: [
      "Ending destructively is not the same as ending cleanly. Aim for clarity without cruelty",
      "If safety is at risk, skip skillful communication and get support",
      "Sometimes the skill is to let the relationship fade rather than have a dramatic ending",
    ],
    tags: ["ending relationships", "breakups", "boundaries", "safety"],
    reference: "Interpersonal Effectiveness Handouts 13, 13a / Interpersonal Effectiveness Worksheet 10",
  },
  {
    id: "dialectics",
    module: "interpersonal",
    category: "Walking the Middle Path",
    name: "Dialectics",
    oneLiner:
      "The core stance of DBT: truth is not either/or. Two seemingly opposite things can both be true. Look for the synthesis.",
    description:
      "Dialectics is the philosophical foundation of DBT. Three core principles: (1) reality is interconnected and constantly changing, not static; (2) opposites can both be true at the same time (no single viewpoint captures the whole truth); (3) truth evolves through the tension between thesis and antithesis, leading to synthesis. In everyday terms: 'I am doing my best AND I need to do better.' 'I am right AND so are they.'",
    whenToUse: [
      "When you find yourself in either/or thinking",
      "When you're locked in conflict with another person",
      "When you're torn between acceptance and change",
    ],
    tips: [
      "Replace 'but' with 'and' — small change, big shift in thinking",
      "When you find yourself saying 'I'm right and they're wrong', look for what's true in their position",
      "Synthesis is not compromise — it's a new option that includes both truths",
    ],
    tags: ["dialectics", "middle path", "synthesis", "both-and", "framework"],
    reference: "Interpersonal Effectiveness Handouts 15, 16, 16a, 16b, 16c / Interpersonal Effectiveness Worksheet 11",
  },
  {
    id: "validation",
    module: "interpersonal",
    category: "Walking the Middle Path",
    name: "Validation",
    oneLiner:
      "Communicating that another person's experience makes sense and is understandable — without necessarily agreeing with it.",
    description:
      "Validation is the act of communicating that what another person (or you yourself) is feeling, thinking, or doing makes sense in context. It is NOT the same as agreeing or approving. There are six levels of validation in DBT, from basic listening on up to recognizing the person's behavior as a reasonable response given their history and current context. Validation is one of the most powerful relationship skills.",
    whenToUse: [
      "When someone is upset and you want to help them feel heard",
      "When a conversation is escalating and you want to de-escalate",
      "When you want to deepen intimacy in any relationship",
      "Self-validation: when you're being harsh with yourself about a feeling you're having",
    ],
    steps: [
      "Level 1: Be present — actually listen, give your full attention",
      "Level 2: Accurate reflection — summarize what they said, not what you assume",
      "Level 3: Mind-reading (carefully) — articulate what they may be feeling but haven't said: 'You seem really hurt by that'",
      "Level 4: Validate based on history or biology — 'Given what happened to you before, it makes sense that this would trigger you'",
      "Level 5: Validate that the behavior makes sense in the current context — 'Anyone would be scared in that situation'",
      "Level 6: Treat the person as fundamentally equal — not broken, not lesser",
    ],
    tips: [
      "Validation is not agreement — you can validate someone's pain without endorsing their action",
      "Most people stop at level 1 or 2 — going higher is where it really lands",
      "Self-validation works the same way: 'Given my history, it makes sense that I reacted that way'",
    ],
    tags: ["validation", "levels of validation", "listening", "relationships", "self-validation"],
    reference: "Interpersonal Effectiveness Handouts 17, 18, 18a, 19, 19a / Interpersonal Effectiveness Worksheets 12, 13",
  },
  {
    id: "behavior-change-strategies",
    module: "interpersonal",
    category: "Walking the Middle Path",
    name: "Behavior Change Strategies",
    oneLiner:
      "How to increase behaviors you want from others (reinforcement) and decrease behaviors you don't (extinction/punishment).",
    description:
      "These skills come from behavioral psychology. To INCREASE a behavior: reinforce it (provide a desirable consequence, ideally positive, immediately after). To DECREASE a behavior: extinguish it (don't reinforce it — easier said than done) or, with caution, use a negative consequence. The skill is in being deliberate, consistent, and aware of the unintended reinforcement patterns you may have set up.",
    whenToUse: [
      "When you want to change a behavior pattern in a relationship (yours or someone else's)",
      "When you've been accidentally rewarding behaviors you don't want",
      "When you've been accidentally punishing behaviors you do want",
    ],
    tips: [
      "Positive reinforcement (adding something pleasant) is more powerful and less damaging than punishment",
      "Reinforcement must be immediate to work — a thank-you days later has less impact",
      "Watch for accidental reinforcement: attention (even angry attention) reinforces behavior",
    ],
    tags: ["behavior change", "reinforcement", "extinction", "punishment", "operant"],
    reference: "Interpersonal Effectiveness Handouts 20, 21, 22, 22a / Interpersonal Effectiveness Worksheets 14, 15",
  },

  // =================== EMOTION REGULATION ===================
  {
    id: "what-emotions-do",
    module: "emotion-regulation",
    category: "Understanding and Naming Emotions",
    name: "What Emotions Do for You",
    oneLiner:
      "Emotions are not noise — they are functional. They communicate, organize action, and signal what matters.",
    description:
      "Emotions serve important functions. They communicate to others (and to ourselves) what matters. They organize the body and mind for action — fear prepares flight, anger prepares defense, sadness prepares withdrawal and connection-seeking. Understanding what a specific emotion is doing for you is the first step in deciding whether to keep it, change it, or amplify it.",
    whenToUse: [
      "Before trying to change an emotion, to understand what it's doing for you",
      "When you believe an emotion is 'useless' — check whether it actually has a function",
      "When emotions seem to come from nowhere",
    ],
    tips: [
      "Ask: what is this emotion trying to communicate? What action is it preparing me for?",
      "Some emotions are 'secondary' — anger about sadness, shame about anger. The primary emotion often matters more",
      "Even 'negative' emotions have functions — the goal isn't to eliminate them but to regulate them",
    ],
    tags: ["functions of emotions", "understanding emotions", "naming emotions"],
    reference: "Emotion Regulation Handout 3 / Emotion Regulation Worksheets 2, 2a, 2b, 2c",
  },
  {
    id: "myths-about-emotions",
    module: "emotion-regulation",
    category: "Understanding and Naming Emotions",
    name: "Myths About Emotions",
    oneLiner:
      "Common false beliefs about emotions ('there's a right way to feel', 'negative emotions are bad') that get in the way of regulation.",
    description:
      "Myths about emotions are beliefs that interfere with healthy emotion regulation. Examples: 'There's a right way to feel in every situation.' 'Negative emotions are bad and destructive.' 'If I feel it, I have to act on it.' 'Some emotions are stupid.' These myths often drive self-invalidation and avoidance. Identifying and challenging them is a foundational emotion regulation skill.",
    whenToUse: [
      "When you're invalidating your own emotional experience",
      "When you believe you 'shouldn't' be feeling what you're feeling",
      "When emotions are driving rigid behavior patterns",
    ],
    tips: [
      "Notice the word 'should' about feelings — it's often a myth talking",
      "Replace 'I shouldn't feel this way' with 'I do feel this way, and that makes sense because...'",
    ],
    tags: ["myths", "emotions", "shoulds", "self-invalidation"],
    reference: "Emotion Regulation Handout 4a / Emotion Regulation Worksheet 3",
  },
  {
    id: "model-for-describing-emotions",
    module: "emotion-regulation",
    category: "Understanding and Naming Emotions",
    name: "Model for Describing Emotions",
    oneLiner:
      "An emotion is a sequence: prompting event → interpretation → biological changes → expressions → aftereffects.",
    description:
      "DBT teaches a model of emotions as a multi-component process: (1) a prompting event (internal or external), (2) interpretation of the event, (3) biological changes (heart rate, posture, facial expression), (4) expressions and action urges (what you do or want to do), (5) aftereffects (longer-lasting changes in mood or sensitivity). Naming each component helps you locate where you can intervene — you can change the interpretation, change the biological state, or change the expression.",
    whenToUse: [
      "When an emotion seems 'stuck' and you don't know why",
      "When you want to find the leverage point to change an emotion",
      "When communicating about emotions with a therapist",
    ],
    tags: ["emotion model", "components of emotion", "naming emotions"],
    reference: "Emotion Regulation Handouts 5, 6 / Emotion Regulation Worksheets 4, 4a",
  },
  {
    id: "check-the-facts",
    module: "emotion-regulation",
    category: "Changing Emotional Responses",
    name: "Check the Facts",
    oneLiner:
      "Ask whether your emotion and its intensity fit the actual facts of the situation — and if not, modify it.",
    description:
      "Check the Facts is the core cognitive skill in DBT emotion regulation. You ask: (a) Is what I'm interpreting actually true? Are there other plausible interpretations? (b) Am I assuming a threat where there isn't one? (c) Is the emotion's intensity proportionate to the actual threat or loss? (d) Would anyone feel this way, or is this based on my history specifically? If the facts don't support the emotion (or its intensity), you can revise the interpretation, which often changes the emotion.",
    whenToUse: [
      "When your emotion feels bigger than the situation warrants",
      "When you suspect you may be misinterpreting someone's behavior",
      "When you're rehearsing a story about what happened and not checking it",
    ],
    steps: [
      "Name the emotion and its intensity (0-100)",
      "Name the prompting event — just the facts",
      "Identify your interpretation — what does the event mean to you?",
      "Ask: is this interpretation definitely true? What evidence supports it? What evidence contradicts it?",
      "Ask: are there other plausible interpretations?",
      "Ask: am I assuming a threat? Is the threat real?",
      "Ask: does the emotion's intensity fit the facts?",
      "If the answer to any of these is 'no' — modify the interpretation, the intensity, or the emotion itself",
    ],
    tips: [
      "Checking the facts does not mean invalidating yourself — sometimes the emotion fits and you should keep it",
      "If the emotion fits the facts but the intensity is too high, opposite action may also be needed",
      "Watch for catastrophizing, mind-reading, and personalizing",
    ],
    examples: [
      "Friend didn't text back. Initial interpretation: 'They're mad at me.' Check the facts: maybe they're busy, maybe they didn't see it, maybe they're overwhelmed. The interpretation 'they're mad' is one possibility among many.",
      "Boss gave short feedback. Initial: 'I'm going to be fired.' Check the facts: was the feedback substantive? Have there been warnings? Is the company doing layoffs? Often the threat is much smaller than the fear suggests.",
    ],
    tags: ["check the facts", "cognitive", "interpretation", "intensity", "thinking"],
    reference: "Emotion Regulation Handouts 8, 8a / Emotion Regulation Worksheet 5",
  },
  {
    id: "opposite-action",
    module: "emotion-regulation",
    category: "Changing Emotional Responses",
    name: "Opposite Action",
    oneLiner:
      "If an emotion doesn't fit the facts (or its intensity is too high), do the opposite of what the emotion urges you to do.",
    description:
      "Every emotion comes with an action urge — fear urges escape, anger urges attack, sadness urges withdrawal, shame urges hiding. If the emotion doesn't fit the facts, or its intensity is too high, doing the OPPOSITE of the urge will, over time, change the emotion. The action must be all-the-way opposite (not halfway), done more than once, and done with full engagement.",
    whenToUse: [
      "When an emotion doesn't fit the facts (verified by Check the Facts)",
      "When the emotion's intensity is too high for the situation",
      "When the emotion's action urge would make things worse",
    ],
    steps: [
      "Name the emotion and its action urge",
      "Ask: does this emotion fit the facts? Is the intensity appropriate?",
      "If no — identify the opposite action (fear: approach; anger: gentleness/de-escalation; sadness: activity/connection; shame: engage rather than hide)",
      "Do the opposite action ALL THE WAY — not halfheartedly",
      "Repeat — once may not be enough",
      "Engage fully: body language, facial expression, tone all need to align",
    ],
    tips: [
      "Opposite action works on emotions, not on situations — if the threat is real, opposite action is not the skill",
      "Body matters: posture, facial expression, and breath are part of the action. Half-smiling while approaching is not all-the-way opposite",
      "Acting opposite is not the same as suppression — you're not denying the emotion, you're changing it through action",
    ],
    examples: [
      "Fear of public speaking that doesn't fit the facts (no real threat): approach, speak up, maintain eye contact — repeatedly, across multiple situations",
      "Shame that doesn't fit the facts: instead of hiding, tell someone trustworthy what happened. Often the shame dissolves on contact",
      "Sadness about a small disappointment that's become overwhelming: instead of withdrawing, do something pleasant or connect with someone",
    ],
    tags: ["opposite action", "exposure", "changing emotions", "action urge", "behavior"],
    reference: "Emotion Regulation Handouts 9, 10, 11, 13 / Emotion Regulation Worksheets 6, 7",
  },
  {
    id: "problem-solving",
    module: "emotion-regulation",
    category: "Changing Emotional Responses",
    name: "Problem Solving",
    oneLiner:
      "When the emotion DOES fit the facts, change the situation that's causing it — using a structured problem-solving process.",
    description:
      "If Check the Facts shows the emotion fits (the threat is real, the loss is real, the injustice is real), the skill is problem solving: change the situation itself. The steps are: define the problem, brainstorm solutions, choose one, plan it, do it, evaluate. Opposite action changes the emotion; problem solving changes the situation.",
    whenToUse: [
      "When the emotion fits the facts — there really is a problem to solve",
      "When opposite action would be inappropriate (because the threat is real)",
      "When you've been venting about a problem for a long time without acting",
    ],
    steps: [
      "Define the problem precisely and factually",
      "Brainstorm possible solutions — quantity over quality at this stage",
      "Evaluate pros and cons of each option",
      "Choose one",
      "Plan the steps to implement it",
      "Do it",
      "Evaluate the result — did it work? What would you do differently?",
    ],
    tips: [
      "Don't skip brainstorming — most people jump to the first solution that comes to mind",
      "If you can't solve the problem, radical acceptance may be the next skill",
    ],
    tags: ["problem solving", "changing situation", "decision"],
    reference: "Emotion Regulation Handout 12 / Emotion Regulation Worksheet 8",
  },
  {
    id: "accumulate-positive-emotions-short-term",
    module: "emotion-regulation",
    category: "Reducing Vulnerability to Emotion Mind",
    name: "Accumulate Positive Emotions — Short Term",
    oneLiner:
      "Do pleasant things now. Build positive moments into your day, even small ones.",
    description:
      "In the short term, the skill is to intentionally do pleasant activities — even small ones. The point is not to manufacture happiness but to accumulate moments of positive emotion, which builds resilience against future negative emotions. The brain is biased to remember negative experiences, so positive ones need to be deliberately created and noticed.",
    whenToUse: [
      "When your life has few pleasant moments",
      "When you're building toward longer-term resilience",
      "When you're in a low mood and waiting for motivation that won't come",
    ],
    steps: [
      "Identify a pleasant activity — small is fine (a cup of tea, a walk, a song)",
      "Do it — don't wait until you 'feel like it'",
      "While doing it, be present. Notice the pleasure. Don't multitask it away",
    ],
    tips: [
      "Motivation follows action, not the other way around — do the thing first",
      "Build a personal list of pleasant activities you can pull from (see Pleasant Events List)",
      "Avoid numbing activities (scrolling, drinking) which don't truly accumulate positive emotion",
    ],
    tags: ["positive emotions", "pleasant events", "short term", "build mastery", "vulnerability"],
    reference: "Emotion Regulation Handouts 15, 16 / Emotion Regulation Worksheets 9, 10, 13",
  },
  {
    id: "accumulate-positive-emotions-long-term",
    module: "emotion-regulation",
    category: "Reducing Vulnerability to Emotion Mind",
    name: "Accumulating Positive Emotions — Long Term",
    oneLiner:
      "Live according to your values, work toward long-term goals, build a life worth living.",
    description:
      "Long-term positive emotion comes from living according to your values and working toward meaningful goals. Identify your values, set specific goals connected to them, take small actions toward them daily. Over time, this builds the kind of life that generates sustainable positive emotion — not just momentary pleasure.",
    whenToUse: [
      "When short-term pleasant activities aren't enough",
      "When life feels meaningless or disconnected from what matters",
      "When you're designing weekly and monthly goals",
    ],
    steps: [
      "Identify your values — what matters most to you? (Use the Values and Priorities List)",
      "Choose one value to focus on",
      "Set a specific, concrete goal connected to that value",
      "Identify small action steps toward the goal",
      "Take one small action step daily or weekly",
      "Track and reflect",
    ],
    tips: [
      "Values are directions, not destinations — you can always keep moving toward them",
      "Small actions consistently beat large actions occasionally",
    ],
    tags: ["positive emotions", "long term", "values", "goals", "life worth living"],
    reference: "Emotion Regulation Handouts 17, 18 / Emotion Regulation Worksheets 11, 11a, 11b",
  },
  {
    id: "build-mastery",
    module: "emotion-regulation",
    category: "Reducing Vulnerability to Emotion Mind",
    name: "Build Mastery",
    oneLiner:
      "Do at least one thing each day that gives you a sense of competence and accomplishment.",
    description:
      "Build Mastery means intentionally doing things that give you a sense of competence — something you can get better at. It doesn't have to be big; it does have to push slightly past your comfort zone without overwhelming you. Building mastery increases self-respect and resilience against despair.",
    whenToUse: [
      "Daily, as a preventive practice",
      "When you've been feeling helpless or incompetent",
      "When you're building a new skill or habit",
    ],
    tips: [
      "Start small — too hard, and you set yourself up to fail; too easy, and there's no mastery",
      "Don't sabotage yourself — don't do the task and then tell yourself it was meaningless",
      "Combine with coping ahead when anticipating something hard",
    ],
    tags: ["build mastery", "competence", "self-respect", "vulnerability", "daily practice"],
    reference: "Emotion Regulation Handout 19 / Emotion Regulation Worksheets 12, 13",
  },
  {
    id: "cope-ahead",
    module: "emotion-regulation",
    category: "Reducing Vulnerability to Emotion Mind",
    name: "Cope Ahead",
    oneLiner:
      "Rehearse a difficult situation in detail, including the skill you'll use — so it's ready when the situation arrives.",
    description:
      "Cope Ahead is a mental rehearsal skill. You pick a situation you anticipate will be hard, imagine it vividly (including the emotions you expect to feel), and rehearse using specific DBT skills in the situation. When the situation actually arrives, your brain has already practiced the response, which makes it more accessible under pressure.",
    whenToUse: [
      "Before a known difficult event (a hard conversation, a stressful meeting, a triggering situation)",
      "When you know a particular skill would help but you tend to forget it in the moment",
      "When anticipatory anxiety is itself a problem",
    ],
    steps: [
      "Describe the situation that's likely to trigger a problem emotion or behavior",
      "Decide what skill you'll use in the situation",
      "Vividly imagine the situation — see it, feel it, including the emotions you expect",
      "Rehearse using the skill in the imagined situation — see yourself doing it",
      "Practice relaxing your body while imagining (paired relaxation)",
    ],
    tips: [
      "Vividness matters — a vague rehearsal won't transfer to the real moment",
      "Don't use cope ahead to catastrophize — rehearse the SKILL, not just the disaster",
    ],
    tags: ["cope ahead", "rehearsal", "anticipatory", "preparation"],
    reference: "Emotion Regulation Handout 19 / Emotion Regulation Worksheets 12, 13",
  },
  {
    id: "please",
    module: "emotion-regulation",
    category: "Reducing Vulnerability to Emotion Mind",
    name: "PLEASE",
    acronym: "PLEASE",
    oneLiner:
      "Take care of your body to take care of your mind: treat Physical iLLness, balanced Eating, avoid mood-Altering drugs, balanced Sleep, get Exercise.",
    description:
      "PLEASE is the DBT skill for reducing physical vulnerability to emotion mind. Physical state powerfully affects emotional state — tired, hungry, sick, or intoxicated people are more emotionally reactive. The skill is to address the physical basics, which makes emotional regulation more possible. (The full DBT acronym is 'PLEASE' — treat Physical iLLness, balanced Eating, avoid mood-Altering drugs, balanced Sleep, get Exercise.)",
    whenToUse: [
      "Whenever you notice you're more emotionally reactive than the situation warrants",
      "Before difficult situations, as a preventive measure",
      "When emotions feel impossible to regulate — check the physical basics first",
    ],
    steps: [
      "P L — treat Physical iLLness: take meds, see a doctor, rest when sick",
      "E A — balanced Eating: not too much, not too little; regular meals; mind your blood sugar",
      "A — avoid mood-Altering drugs: caffeine, alcohol, recreational substances affect mood",
      "S — balanced Sleep: protect sleep hours; consistent rhythm; address sleep problems",
      "E — get Exercise: even small amounts; daily is better than occasional intense",
    ],
    tips: [
      "Don't underestimate the basics — when sleep or food is off, no other skill will fully work",
      "Caffeine and alcohol have delayed effects — track your mood a day or two after",
      "Build these into daily routine so they don't require willpower in the moment",
    ],
    tags: ["please", "body", "sleep", "food", "exercise", "physical", "vulnerability", "acronym"],
    reference: "Emotion Regulation Handout 20 / Emotion Regulation Worksheet 14",
  },
  {
    id: "nightmare-protocol",
    module: "emotion-regulation",
    category: "Reducing Vulnerability to Emotion Mind",
    name: "Nightmare Protocol",
    oneLiner:
      "A step-by-step method for working with recurring nightmares: rewrite the dream with a different, mastery-ending.",
    description:
      "Nightmare Protocol (Image Rehearsal Therapy) is used for recurring nightmares. The steps: write down the nightmare in detail, then rewrite the ending — making it less threatening, with you mastering the situation. Rehearse the new version before sleep. Over repetitions, the new ending tends to replace the old nightmare.",
    whenToUse: [
      "When recurring nightmares are disrupting sleep",
      "When nightmares are PTSD-related",
      "When sleep problems are increasing vulnerability to emotion mind",
    ],
    tips: [
      "Consistency matters — rehearse the new ending every night before sleep",
      "You don't have to make the dream 'happy' — just less threatening and ending in mastery",
      "Pair with sleep hygiene",
    ],
    tags: ["nightmares", "sleep", "ptsd", "image rehearsal", "dreams"],
    reference: "Emotion Regulation Handout 20a / Emotion Regulation Worksheet 14a",
  },
  {
    id: "sleep-hygiene",
    module: "emotion-regulation",
    category: "Reducing Vulnerability to Emotion Mind",
    name: "Sleep Hygiene",
    oneLiner:
      "Behavioral practices that protect sleep quality: consistent schedule, dark/cool room, no screens before bed, no stimulants late in day.",
    description:
      "Sleep Hygiene is a set of practices that support healthy sleep: a consistent sleep schedule, a dark and cool bedroom, avoiding screens and stimulants before bed, regular exercise, and limiting time in bed when not sleeping. Good sleep is foundational to emotion regulation — without it, no other skill fully works.",
    whenToUse: [
      "Whenever sleep is poor",
      "As a daily preventive practice",
      "Before and during periods of high stress",
    ],
    tips: [
      "Consistency beats duration — same bedtime/wake time is more important than total hours",
      "The bed is for sleep (and sex); don't work, watch TV, or scroll in bed",
    ],
    tags: ["sleep", "hygiene", "vulnerability", "self-care"],
    reference: "Emotion Regulation Handout 20b / Emotion Regulation Worksheet 14b",
  },
  {
    id: "mindfulness-of-current-emotions",
    module: "emotion-regulation",
    category: "Managing Really Difficult Emotions",
    name: "Mindfulness of Current Emotions (Letting Go of Emotional Suffering)",
    oneLiner:
      "Stay with the emotion as a wave, without acting on it or pushing it away — and watch it crest and pass.",
    description:
      "When an emotion is intense and you can neither solve the problem nor act opposite, the skill is to observe the emotion as a wave: notice where you feel it in your body, name it, let it be there without acting on it or suppressing it. Emotions, like waves, crest and fall — they don't stay at peak intensity forever. Mindfulness of the emotion itself reduces the suffering that comes from fighting it.",
    whenToUse: [
      "When an emotion is too intense for opposite action or problem solving",
      "When the situation can't be changed and acceptance is the only path",
      "When pushing the emotion away is making it stronger",
    ],
    steps: [
      "Notice where you feel the emotion in your body",
      "Name the emotion",
      "Imagine the emotion as a wave — let it rise and fall without trying to stop it",
      "Breathe with the emotion",
      "Don't act on the urge the emotion brings — just observe",
      "Notice that the intensity changes — it is not constant",
    ],
    tips: [
      "Suffering equals pain multiplied by resistance. Reduce the resistance and you reduce the suffering",
      "Observing is not the same as wallowing — staying mindful, not getting lost in story",
      "This is a hard skill — start with smaller emotions and build up",
    ],
    tags: ["mindfulness of emotions", "letting go", "suffering", "wave", "observing"],
    reference: "Emotion Regulation Handout 22 / Emotion Regulation Worksheet 15",
  },
  {
    id: "managing-extreme-emotions",
    module: "emotion-regulation",
    category: "Managing Really Difficult Emotions",
    name: "Managing Extreme Emotions",
    oneLiner:
      "When emotions are at peak intensity: combine distress tolerance with emotion regulation skills.",
    description:
      "When emotions are at their most extreme, you generally need distress tolerance skills first (to survive the moment without making things worse) before emotion regulation skills can work. The skill is to recognize when you've crossed into extreme territory and switch modules: STOP, TIPP, or other crisis survival skills first; then return to Check the Facts, Opposite Action, etc., when intensity has dropped.",
    whenToUse: [
      "When emotion intensity is 8/10 or higher",
      "When you're in crisis and at risk of acting on dangerous urges",
      "When 'normal' emotion regulation skills aren't landing",
    ],
    tips: [
      "Have a plan in advance — at extreme intensity, you won't be reasoning out which skill to use",
      "If you've reached extreme emotion, working the PLEASE basics afterward is critical to prevent recurrence",
    ],
    tags: ["extreme emotions", "crisis", "distress tolerance", "intensity"],
    reference: "Emotion Regulation Handout 23",
  },

  // =================== DISTRESS TOLERANCE ===================
  {
    id: "when-to-use-crisis-survival-skills",
    module: "distress-tolerance",
    category: "Crisis Survival Skills",
    name: "When to Use Crisis Survival Skills",
    oneLiner:
      "Use crisis survival skills when: (1) you're in a crisis, (2) you can't solve the problem right now, AND (3) intense emotions will make things worse.",
    description:
      "Crisis survival skills (STOP, TIPP, Pros/Cons, Distract, Self-Soothe, IMPROVE) are designed for specific situations. They are NOT for everyday stress. Use them when ALL three conditions are met: (1) you're in a crisis (high stress, intense emotion, urgent situation), (2) you cannot solve the problem immediately, AND (3) acting on the emotion will make things worse. If any of these aren't met, regular problem-solving or emotion regulation skills are more appropriate.",
    whenToUse: [
      "When all three conditions are met: crisis + unsolvable now + emotion will worsen things",
      "NOT for everyday stress — overusing these skills prevents you from building other skills",
      "NOT for problems that can be solved right now — solve them instead",
    ],
    tips: [
      "Crisis survival skills buy time — they don't solve the underlying problem",
      "After the crisis, return to the emotion regulation or problem-solving module",
      "If you're using crisis skills constantly, the issue is likely elsewhere (chronic crisis, missing skills, unaddressed problem)",
    ],
    tags: ["crisis survival", "when to use", "framework", "distress tolerance"],
    reference: "Distress Tolerance Handout 3",
  },
  {
    id: "stop",
    module: "distress-tolerance",
    category: "Crisis Survival Skills",
    name: "STOP Skill",
    acronym: "STOP",
    oneLiner:
      "When in crisis: Stop, Take a step back, Observe, Proceed mindfully.",
    description:
      "STOP is the first crisis survival skill to reach for. It interrupts the autopilot of an emotional reaction by forcing a pause. Stop physically and mentally. Take a step back (literally, if possible — and take a breath). Observe what's happening internally and externally. Then proceed mindfully, with your goal in mind, not your impulse.",
    whenToUse: [
      "The instant you notice you're about to do something you'll regret",
      "When emotions are escalating quickly",
      "When you're about to act on an urge you've identified as a target behavior",
    ],
    steps: [
      "S — Stop. Literally freeze. Don't move, don't act, don't speak",
      "T — Take a step back. Physically if possible. Take a breath. Let go of the immediate situation for a moment",
      "O — Observe. What am I feeling? What is the situation? What do I actually want here?",
      "P — Proceed mindfully. Choose an action that serves your goal, not your impulse. Use other skills as needed",
    ],
    tips: [
      "STOP is fast — it takes a few seconds and can save you hours of cleanup",
      "Practice STOP on small things so it's accessible on big things",
      "If you can't physically step back, mentally step back — close your eyes for a moment if you can",
    ],
    tags: ["stop", "crisis", "pause", "interrupt", "distress tolerance", "acronym"],
    reference: "Distress Tolerance Handout 4 / Distress Tolerance Worksheets 2, 2a",
  },
  {
    id: "pros-and-cons",
    module: "distress-tolerance",
    category: "Crisis Survival Skills",
    name: "Pros and Cons (of Acting on Crisis Urges)",
    oneLiner:
      "Before acting on a crisis urge, weigh the pros and cons — of acting on the urge AND of resisting it — short and long term.",
    description:
      "Pros and Cons in DBT is specifically about crisis urges. You list the pros and cons of acting on the urge (e.g., self-harm, drinking, sending the text), AND the pros and cons of NOT acting on it. The key insight is to focus on long-term consequences, not just short-term relief. The short-term pros of acting on the urge are usually obvious; the long-term cons are what change the decision.",
    whenToUse: [
      "When you're considering acting on a target behavior (urge)",
      "Before acting on any impulse that gives short-term relief but causes long-term harm",
      "When in crisis and deciding whether to use other crisis skills or give in to the urge",
    ],
    steps: [
      "List the pros of acting on the urge (yes, write them — don't pretend they don't exist)",
      "List the cons of acting on the urge",
      "List the pros of NOT acting on the urge (resisting)",
      "List the cons of NOT acting on the urge",
      "Pay special attention to long-term consequences on each side",
      "Make the decision based on the full picture, not the loudest short-term relief",
    ],
    tips: [
      "Pre-write your pros and cons BEFORE a crisis, when you're calm — keep it accessible",
      "Long-term consequences carry more weight than short-term relief",
      "Don't be moralistic about it — be honest. The pros of acting on the urge are real; the cons just outweigh them",
    ],
    tags: ["pros and cons", "decision", "crisis", "urge surfing", "distress tolerance"],
    reference: "Distress Tolerance Handout 5 / Distress Tolerance Worksheets 3, 3a",
  },
  {
    id: "tipp",
    module: "distress-tolerance",
    category: "Crisis Survival Skills",
    name: "TIPP",
    acronym: "TIPP",
    oneLiner:
      "Change your body chemistry fast: Temperature, Intense exercise, Paced breathing, Paired muscle relaxation.",
    description:
      "TIPP is the most powerful DBT skill for rapidly reducing extreme emotional arousal. It works through the body's physiology, not through thinking (which is often impossible in extreme emotion). Each letter is a different body-based intervention that activates the parasympathetic nervous system or burns off stress hormones. The effects are usually felt within 30 seconds to a few minutes.",
    whenToUse: [
      "When emotional intensity is extreme (8/10 or higher)",
      "When you can't think clearly enough for cognitive skills",
      "When you need to bring intensity down FAST",
      "T: especially effective for anger and panic",
    ],
    steps: [
      "T — Temperature: cold water on the face, or an ice pack on the eyes/cheeks, triggers the dive reflex and rapidly lowers heart rate. (Caution with cardiac conditions.)",
      "I — Intense exercise: a brief burst (sprinting, jumping jacks, stairs) burns off stress hormones and matches the body's arousal to action",
      "P — Paced breathing: slow your breath, ideally to about 5-6 breaths per minute, with longer exhale than inhale. Activates the parasympathetic system",
      "P — Paired muscle relaxation: tense and release each muscle group, pairing the release with the exhale. (See separate skill entry for step-by-step.)",
    ],
    tips: [
      "Cold water is the fastest-acting — keep ice packs in your freezer if you're prone to crisis",
      "Cardiac caution: very cold water on the face slows the heart — check with a doctor if you have heart conditions",
      "Paced breathing is the most portable — can be done anywhere",
      "You don't have to do all four — pick what fits the situation",
    ],
    examples: [
      "Panic attack at work: head to the restroom, splash cold water on your face (T) and do 4-7-8 breathing (P)",
      "Anger spiking at home: do 50 jumping jacks (I) followed by paced breathing (P)",
    ],
    tags: ["tipp", "body chemistry", "cold water", "intense exercise", "paced breathing", "muscle relaxation", "physiology", "crisis", "acronym"],
    reference: "Distress Tolerance Handouts 6, 6a, 6b, 6c / Distress Tolerance Worksheets 4, 4a, 4b",
  },
  {
    id: "using-cold-water",
    module: "distress-tolerance",
    category: "Crisis Survival Skills",
    name: "Using Cold Water, Step by Step",
    oneLiner:
      "Cold water on the face (or ice pack on eyes/cheeks) triggers the dive reflex — rapid heart-rate drop, intense calming.",
    description:
      "Submerging the face in cold water (or applying an ice pack to eyes and cheeks) activates the mammalian dive reflex, which slows the heart rate and shifts blood toward the brain. This produces a rapid, often dramatic calming effect — useful for high-intensity panic, rage, or urges. The effect is temporary (60-90 seconds) but can break the spike enough to use other skills.",
    whenToUse: [
      "When panic, rage, or another extreme emotion is spiking fast",
      "When you need to drop the intensity in under a minute",
      "When other skills aren't accessible in the moment",
    ],
    steps: [
      "Get cold water — a bowl, or splash directly. Ice packs work too",
      "Hold your breath (this matters — the dive reflex needs breath-hold)",
      "Submerge your face (forehead to cheekbones, around the eyes) in cold water for 10-30 seconds",
      "OR: hold an ice pack against eyes and cheeks",
      "Come up, breathe normally, notice the shift",
      "Use a follow-up skill (paced breathing, distraction) to maintain the lower intensity",
    ],
    tips: [
      "Cardiac caution — if you have heart conditions, especially bradycardia, talk to a doctor before using this",
      "Don't use ice directly on skin for long — risk of cold injury",
      "Effect is temporary — use the window of calm to apply another skill",
    ],
    tags: ["cold water", "dive reflex", "tipp", "physiology", "crisis"],
    reference: "Distress Tolerance Handout 6a / Distress Tolerance Worksheet 4",
  },
  {
    id: "paired-muscle-relaxation",
    module: "distress-tolerance",
    category: "Crisis Survival Skills",
    name: "Paired Muscle Relaxation, Step by Step",
    oneLiner:
      "Tense each muscle group, then release while exhaling — pairing relaxation with the breath to calm the nervous system.",
    description:
      "Paired Muscle Relaxation is a body-based skill that combines progressive muscle relaxation with breath. By deliberately tensing and then releasing each muscle group, you train your body to recognize and discharge tension. Pairing the release with an exhale activates the parasympathetic nervous system, producing a calming effect that builds with practice.",
    whenToUse: [
      "When you're physically tense from stress",
      "Before sleep, to wind down",
      "As a follow-up to TIPP",
      "As a daily practice, to lower baseline arousal",
    ],
    steps: [
      "Sit or lie comfortably",
      "Take a few normal breaths",
      "For each muscle group (hands, arms, shoulders, face, chest, belly, legs, feet):",
      "  1. Tense the muscle on the inhale — about 5 seconds",
      "  2. Release the tension on the exhale — let it go completely",
      "  3. Notice the contrast between tension and relaxation",
      "  4. Say 'relax' silently as you release",
      "Move through all major muscle groups",
      "Notice the overall state of your body at the end",
    ],
    tips: [
      "Don't tense so hard you cramp — moderate tension, full release",
      "Pairs especially well with paced breathing",
      "Practice daily even when calm — the calm-from-practice transfers to crisis use",
    ],
    tags: ["muscle relaxation", "tipp", "body", "breath", "physiology"],
    reference: "Distress Tolerance Handout 6b / Distress Tolerance Worksheet 4a",
  },
  {
    id: "distracting-accepts",
    module: "distress-tolerance",
    category: "Crisis Survival Skills",
    name: "Distracting with ACCEPTS",
    acronym: "ACCEPTS",
    oneLiner:
      "Seven ways to distract from a crisis urge: Activities, Contributing, Comparisons, Emotions, Pushing away, Thoughts, Sensations.",
    description:
      "ACCEPTS is a menu of distraction strategies for crisis situations. Distraction doesn't solve the problem, but it can prevent you from acting on an urge long enough for the intensity to drop. The seven strategies provide multiple options so you can pick what fits the moment.",
    whenToUse: [
      "When you need to not act on an urge, but the intensity is too high for acceptance or problem-solving",
      "When you need a bridge between the urge and the moment when skills can work",
    ],
    steps: [
      "A — Activities: do something engaging — work, hobby, exercise, game, errand",
      "C — Contributing: do something for someone else — volunteer, help a friend, send a kind message",
      "C — Comparisons: compare to a worse time you survived, or to those less fortunate (use with care)",
      "E — Emotions: do something that creates a different emotion — funny video, sad movie, uplifting music",
      "P — Pushing away: mentally put the situation in a box and set it aside for now. Not denial — temporary",
      "T — Thoughts: count, recite, do puzzles, repeat a meaningful phrase — fill the mind with something else",
      "S — Sensations: intense sensations to redirect attention — sour candy, hot shower, loud music, ice",
    ],
    tips: [
      "Distraction is a stopgap, not a solution — it buys time, doesn't resolve",
      "Have your list of go-to distractions ready before a crisis (you won't be creative during one)",
      "Sensations are often the most effective for very high intensity",
    ],
    tags: ["accepts", "distract", "crisis", "distress tolerance", "acronym"],
    reference: "Distress Tolerance Handout 7 / Distress Tolerance Worksheets 5, 5a, 5b",
  },
  {
    id: "self-soothing",
    module: "distress-tolerance",
    category: "Crisis Survival Skills",
    name: "Self-Soothing with the Five Senses",
    oneLiner:
      "Soothe yourself through each sense: Vision, Hearing, Smell, Taste, Touch.",
    description:
      "Self-Soothing is the crisis skill of comforting yourself through the five senses. While distraction fills the mind with something else, self-soothing directly calms the nervous system through sensory comfort. The skill builds the capacity to nurture yourself in distress, which is itself therapeutic.",
    whenToUse: [
      "When you're distressed and need comfort, not just distraction",
      "When you're exhausted and other skills feel too effortful",
      "When you want to build self-nurturing as a capacity",
    ],
    steps: [
      "Vision: look at something beautiful — art, nature, photos of loved ones, a candle",
      "Hearing: listen to calming music, nature sounds, a loved one's voice",
      "Smell: a favorite scent — flowers, coffee, essential oils, baking",
      "Taste: savor something slowly — tea, chocolate, a favorite meal (mindful eating)",
      "Touch: soft fabric, warm bath, pet an animal, weighted blanket, a hug",
    ],
    tips: [
      "Build a 'self-soothing kit' — a box with items for each sense — so it's ready in crisis",
      "Savoring matters — don't rush. Be present with the sensation",
      "Self-soothing is not weakness — it's a learnable skill that builds resilience",
    ],
    tags: ["self-soothe", "five senses", "comfort", "crisis", "distress tolerance"],
    reference: "Distress Tolerance Handout 8 / Distress Tolerance Worksheets 6, 6a, 6b",
  },
  {
    id: "improve-the-moment",
    module: "distress-tolerance",
    category: "Crisis Survival Skills",
    name: "IMPROVE the Moment",
    acronym: "IMPROVE",
    oneLiner:
      "Seven ways to make the moment more bearable: Imagery, Meaning, Prayer, Relaxation, One thing at a time, Vacation, Encouragement.",
    description:
      "IMPROVE the Moment is a set of cognitive and behavioral strategies for making a difficult moment more tolerable. Where distraction takes you out of the moment and self-soothing comforts you in it, IMPROVE reshapes how you relate to the moment itself.",
    whenToUse: [
      "When you can't leave or change the situation but need to tolerate it",
      "When distraction and self-soothing aren't enough",
      "When you're facing an extended difficult period (not just a brief crisis)",
    ],
    steps: [
      "I — Imagery: imagine a safe place, a successful outcome, or a comforting scene",
      "M — Meaning: find or create meaning in the situation — what does it teach? How does it connect to your values?",
      "P — Prayer: open to something greater (defined however fits you) — not necessarily religious",
      "R — Relaxation: stretch, breathe, yawn, smile — release physical tension",
      "O — One thing at a time: don't project the whole future; just this one moment",
      "V — Vacation: take a brief 'vacation' from responsibility — a few minutes off, within healthy limits (not avoidance)",
      "E — Encouragement: talk to yourself the way you'd talk to a friend — 'You can do this. You've survived worse.'",
    ],
    tips: [
      "'Vacation' has a time limit — it's not permission to check out for days",
      "Encouragement is the opposite of the inner critic — practice the words you'd actually use for someone you love",
      "Meaning-making is not the same as justification — finding meaning doesn't mean the situation is OK",
    ],
    tags: ["improve", "crisis", "distress tolerance", "imagery", "meaning", "acronym"],
    reference: "Distress Tolerance Handout 9 / Distress Tolerance Worksheets 7, 7a, 7b",
  },
  {
    id: "radical-acceptance",
    module: "distress-tolerance",
    category: "Reality Acceptance Skills",
    name: "Radical Acceptance",
    oneLiner:
      "Accepting reality completely, exactly as it is — without fighting it. Not approval; just acknowledging what is true.",
    description:
      "Radical Acceptance is the foundational reality acceptance skill. It means accepting reality from the bottom of your soul, with your mind, body, and heart — completely, not just intellectually. Suffering equals pain multiplied by non-acceptance. When you cannot change the situation, your only leverage is on the non-acceptance. Radical acceptance doesn't mean approval, agreement, or passivity; it means acknowledging what is true so you can respond effectively rather than react against what isn't.",
    whenToUse: [
      "When you cannot change the situation (loss, injustice, history, other people's choices)",
      "When fighting reality is the main source of your suffering",
      "When you're stuck in 'this shouldn't be happening'",
      "After you've established that crisis survival skills aren't needed (you're not in immediate danger)",
    ],
    steps: [
      "Notice when you're fighting reality ('it shouldn't be', 'this isn't fair', 'why me')",
      "Make the choice to accept — radical acceptance is a choice, repeated many times",
      "Accept from your body, not just your mind. Use willing hands (open posture), half-smile",
      "Acknowledge what you're accepting — name it specifically: 'I am accepting that...'",
      "When you notice you've slipped back into non-acceptance, use Turning the Mind to come back",
      "Repeat. Radical acceptance is not a one-time event",
    ],
    tips: [
      "Acceptance is not approval. You can accept that something happened AND work to change similar things in the future",
      "You can accept reality AND feel grief about it — they coexist",
      "If you can't fully accept, accept that you can't accept, and start there",
      "Watch for 'shoulds' — they almost always signal non-acceptance",
    ],
    examples: [
      "A painful medical diagnosis: radical acceptance doesn't mean not treating it. It means not wasting energy fighting the fact that you have it",
      "A breakup: radical acceptance is acknowledging the relationship has ended, not that ending it was right",
      "Childhood trauma: radical acceptance is acknowledging what happened, not excusing it",
    ],
    tags: ["radical acceptance", "acceptance", "reality", "suffering", "distress tolerance"],
    reference: "Distress Tolerance Handouts 11, 11a, 11b / Distress Tolerance Worksheets 9, 9a",
  },
  {
    id: "turning-the-mind",
    module: "distress-tolerance",
    category: "Reality Acceptance Skills",
    name: "Turning the Mind",
    oneLiner:
      "Acceptance isn't a one-time decision. When you slip back, you turn the mind back to acceptance — over and over.",
    description:
      "Turning the Mind is the skill that maintains Radical Acceptance. Acceptance isn't a switch you flip once; you'll keep sliding back into non-acceptance. Turning the Mind is the act of noticing you've slipped and making the choice to come back to acceptance. It's a fork in the road: every time you notice non-acceptance, you have a choice — accept or reject. Turn the mind toward acceptance, again and again.",
    whenToUse: [
      "When you've tried radical acceptance and keep falling out of it",
      "Whenever you notice 'should' thoughts returning",
      "Multiple times per day, when working with a hard reality",
    ],
    steps: [
      "Notice you've slipped back into non-acceptance",
      "Recognize the fork in the road: you have a choice right now",
      "Make an inner commitment to turn toward acceptance",
      "Return to radical acceptance skills (willing hands, half-smile, naming what you accept)",
      "Expect to slip again — and turn again. That's the practice",
    ],
    tips: [
      "Slipping back is not failure — it's just what the mind does. Turning back is the skill",
      "You may turn the mind dozens of times in a single day. That's normal",
      "Turning the mind gets easier with practice — the path becomes more familiar",
    ],
    tags: ["turning the mind", "acceptance", "commitment", "repeated choice"],
    reference: "Distress Tolerance Handout 12 / Distress Tolerance Worksheets 8, 8a, 10",
  },
  {
    id: "willingness",
    module: "distress-tolerance",
    category: "Reality Acceptance Skills",
    name: "Willingness (vs. Willfulness)",
    oneLiner:
      "Willingness is doing just what is needed, in the situation, with full engagement. Willfulness is refusing reality or sitting on your hands.",
    description:
      "Willingness is the active counterpart to Radical Acceptance. Once you've accepted reality, willingness means doing what the situation requires — fully, without resistance. Willfulness is its opposite: refusing to do what's needed, sitting on your hands, insisting reality should be different before you act. Both are options in every moment.",
    whenToUse: [
      "After radical acceptance, to translate acceptance into action",
      "When you notice you're refusing to do something the situation requires",
      "When you're stuck in 'I shouldn't have to' or 'I won't'",
    ],
    tips: [
      "Willingness does not mean doing more than is needed — it means doing just what's needed",
      "Willfulness often hides behind 'fairness' — 'it's not fair, so I won't' sounds noble but is often unhelpful",
      "If you're stuck, ask: what is the next right action in this moment?",
    ],
    tags: ["willingness", "willfulness", "acceptance", "action", "distress tolerance"],
    reference: "Distress Tolerance Handout 13 / Distress Tolerance Worksheets 8, 8a, 10",
  },
  {
    id: "half-smiling-willing-hands",
    module: "distress-tolerance",
    category: "Reality Acceptance Skills",
    name: "Half-Smiling and Willing Hands",
    oneLiner:
      "Body postures of acceptance: a slight half-smile and open, palms-up hands communicate acceptance to your own nervous system.",
    description:
      "Half-Smiling and Willing Hands are somatic (body-based) cues that support radical acceptance. A half-smile (slight upturn of the lips, relaxed face) and willing hands (open palms, unclenched) communicate to your nervous system that you are not in fight mode. The body posture reinforces the mental state of acceptance — and conversely, clenched fists and a tight jaw reinforce non-acceptance. Used together with radical acceptance practice.",
    whenToUse: [
      "Whenever you're practicing radical acceptance",
      "When you notice physical tension that signals resistance",
      "In any difficult moment as a quick somatic cue",
    ],
    steps: [
      "Relax your face from forehead to jaw",
      "Allow a slight upturn at the corners of your mouth — not a grin, just a soft half-smile",
      "Open your hands, palms up or relaxed on your lap",
      "Breathe and notice any shift in your internal state",
      "Hold the posture for at least 30 seconds to a few minutes",
    ],
    tips: [
      "The smile is internal as much as external — half-smiling with the eyes",
      "Willing hands is the opposite of clenched fists — which signal resistance",
      "You don't have to feel accepting to do it; the posture helps create the state",
    ],
    tags: ["half-smile", "willing hands", "body", "somatic", "acceptance"],
    reference: "Distress Tolerance Handouts 14, 14a / Distress Tolerance Worksheets 11, 11a",
  },
  {
    id: "mindfulness-of-current-thoughts",
    module: "distress-tolerance",
    category: "Reality Acceptance Skills",
    name: "Mindfulness of Current Thoughts",
    oneLiner:
      "Observe thoughts as passing events in the mind — not as truth, not as you. Let them come and go without acting.",
    description:
      "Mindfulness of Current Thoughts is the application of mindfulness skills to thoughts themselves. Instead of getting tangled in thoughts (believing them, arguing with them, acting on them), you observe them as mental events — like leaves on a stream, like clouds in the sky. The thought 'I'm worthless' becomes 'a thought is arising that I'm worthless' — observed, not identified with. This creates space between you and your thoughts, reducing their grip.",
    whenToUse: [
      "When you're caught in rumination or repetitive negative thinking",
      "When thoughts are driving urges you're trying not to act on",
      "When you're fused with thoughts as if they were facts",
    ],
    steps: [
      "Observe the thought as it arises — don't push it away, don't follow it",
      "Name it as a thought: 'a thought is arising that...'",
      "Notice it as a mental event, not as truth",
      "Imagine the thought on a leaf floating down a stream, or as a cloud passing",
      "Let it pass. Don't engage. Don't argue. Don't analyze.",
      "When another thought arises, repeat",
    ],
    tips: [
      "Noticing thoughts as thoughts is a skill that takes practice — start with shorter sessions",
      "You are not your thoughts. The awareness that notices the thought — that's closer to you",
      "Don't try to make thoughts stop — that's resistance. Just observe them coming and going",
    ],
    tags: ["mindfulness of thoughts", "defusion", "observing thoughts", "acceptance"],
    reference: "Distress Tolerance Handouts 15, 15a / Distress Tolerance Worksheets 12, 12a",
  },
  {
    id: "dialectical-abstinence",
    module: "distress-tolerance",
    category: "When the Crisis Is Addiction",
    name: "Dialectical Abstinence",
    oneLiner:
      "For addiction crises: the synthesis between absolute abstinence (the goal) and harm reduction (the fallback when slips happen).",
    description:
      "Dialectical Abstinence is the DBT approach to addiction crises. The thesis is absolute abstinence — the only safe goal with addiction is no use, full stop. The antithesis is harm reduction — if you do slip, do everything possible to reduce harm and prevent a slip from becoming a relapse. The synthesis: aim for absolute abstinence, AND have a detailed plan for what to do if you slip, so a slip doesn't turn into a full collapse.",
    whenToUse: [
      "When addiction is the crisis",
      "After a slip — to prevent a slip from becoming a relapse",
      "When planning recovery",
    ],
    tips: [
      "A slip is not a failure — it's a moment to apply the harm-reduction side of the dialectic",
      "Have the plan written down BEFORE the slip — during the slip is too late",
    ],
    tags: ["addiction", "abstinence", "harm reduction", "dialectics", "crisis"],
    reference: "Distress Tolerance Handouts 17, 17a / Distress Tolerance Worksheet 14",
  },
  {
    id: "clear-mind",
    module: "distress-tolerance",
    category: "When the Crisis Is Addiction",
    name: "Clear Mind",
    oneLiner:
      "The synthesis between Addict Mind (active addiction) and Clean Mind (abstinence without awareness of risk).",
    description:
      "Clear Mind is a state for addiction recovery. Addict Mind is the state of active addiction. Clean Mind is the state of abstinence, but with a danger: it can become complacent, forgetting how easily addiction returns. Clear Mind is the synthesis — abstinent AND aware of the vulnerability, prepared, and engaged in ongoing recovery practices.",
    whenToUse: [
      "In addiction recovery",
      "When Clean Mind has led to complacency",
      "When Addict Mind is active and you're working to return",
    ],
    tags: ["addiction", "clear mind", "addict mind", "clean mind", "recovery"],
    reference: "Distress Tolerance Handouts 18, 18a / Distress Tolerance Worksheet 15",
  },
];

// Helper: filter skills by module
export function skillsByModule(moduleId: Module): Skill[] {
  return SKILLS.filter((s) => s.module === moduleId);
}

// Helper: simple fuzzy search across all searchable text
export function searchSkills(query: string): Skill[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  return SKILLS.map((skill) => {
    const haystack = [
      skill.name,
      skill.acronym ?? "",
      skill.oneLiner,
      skill.description,
      skill.category,
      ...skill.tags,
      ...(skill.whenToUse ?? []),
      ...(skill.steps ?? []),
      ...(skill.tips ?? []),
      ...(skill.examples ?? []),
    ]
      .join(" ")
      .toLowerCase();

    // Score: how many query terms appear, plus bonus for acronym/name match
    let score = 0;
    for (const term of terms) {
      if (haystack.includes(term)) score += 1;
      if (skill.name.toLowerCase().includes(term)) score += 2;
      if (skill.acronym && skill.acronym.toLowerCase().includes(term)) score += 3;
    }

    return { skill, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.skill);
}
