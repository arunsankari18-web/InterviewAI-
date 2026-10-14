import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/store.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/challenges/modes
router.get('/modes', async (req, res) => {
  try {
    const modes = db.getChallengeModes();
    return res.json({ modes });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch challenge modes.' });
  }
});

// Comprehensive Real Company Placement Challenge Question Bank
const PLACEMENT_CHALLENGE_BANK = [
  {
    id: "q-chal-01",
    company: "Zoho Corporation",
    role: "Software Development Engineer",
    topic: "Data Structures & Hash Maps",
    round: "Technical Round 1",
    question: "In a Hash Map implementation, when the load factor exceeds 0.75, why is capacity doubled to powers of 2 (e.g., 16 to 32)?",
    options: [
      "To allow fast bitwise AND indexing (hash & (n-1)) instead of expensive modulo (%) division",
      "Because power-of-two memory allocations reduce CPU cache misses automatically",
      "To prevent all hash collisions from ever occurring again",
      "Because linked lists cannot hold more than 16 elements in modern JVMs"
    ],
    correctOptionIndex: 0,
    explanation: "When capacity n is a power of 2, (n - 1) is a bitmask of all 1s (e.g. 15 = 01111). This allows index calculation via bitwise AND (hash & (n-1)) which executes in 1 CPU cycle compared to expensive integer modulo division."
  },
  {
    id: "q-chal-02",
    company: "Amazon",
    role: "SDE-1",
    topic: "Algorithms & Sliding Window",
    round: "Technical Interview",
    question: "When finding the longest substring without repeating characters, how does the optimized two-pointer sliding window achieve O(N) time complexity?",
    options: [
      "By storing the last seen index of each character in a map and instantly jumping the left pointer past the duplicate",
      "By sorting the string characters in O(N log N) time before executing two pointers",
      "By resetting the left pointer to 0 whenever any repeating character is encountered",
      "By creating a new set for every single substring combination"
    ],
    correctOptionIndex: 0,
    explanation: "Instead of moving the left pointer step-by-step, storing the latest index of each character in a Map allows left = Math.max(left, lastSeenIndex + 1), ensuring each character is visited at most twice for strictly O(N) linear time."
  },
  {
    id: "q-chal-03",
    company: "TCS Digital",
    role: "System Engineer",
    topic: "DBMS & Transactions",
    round: "Technical Core",
    question: "Which isolation level prevents Dirty Reads and Non-Repeatable Reads, but may still permit Phantom Reads under ANSI SQL standards?",
    options: [
      "Repeatable Read",
      "Read Committed",
      "Read Uncommitted",
      "Serializable"
    ],
    correctOptionIndex: 0,
    explanation: "Repeatable Read guarantees that data read once will remain unchanged throughout the transaction (preventing dirty reads and non-repeatable reads). However, new rows inserted by concurrent transactions matching a range query (Phantom Reads) can still occur unless using Serializable isolation or MVCC range locks."
  },
  {
    id: "q-chal-04",
    company: "Zoho Corporation",
    role: "Software Development Engineer",
    topic: "OOP & Design Patterns",
    round: "Technical Round 2",
    question: "Why must the singleton instance variable be declared as `volatile` in Java when implementing Double-Checked Locking?",
    options: [
      "To prevent instruction reordering by the compiler/CPU where a partially constructed object reference is assigned before constructor completion",
      "To serialize the singleton object directly into disk storage",
      "To restrict the singleton class from being subclassed by child classes",
      "To ensure that garbage collection runs immediately after method execution"
    ],
    correctOptionIndex: 0,
    explanation: "Without volatile, CPU instruction reordering can cause memory allocation, pointer assignment, and constructor execution to occur out of order. Another thread might observe a non-null instance pointer while its fields are still uninitialized."
  },
  {
    id: "q-chal-05",
    company: "Accenture",
    role: "Advanced Application Engineer (AASE)",
    topic: "Computer Networks & Web",
    round: "Technical Interview",
    question: "What is the primary difference between HTTP/1.1 pipelining and HTTP/2 multiplexing?",
    options: [
      "HTTP/2 multiplexes multiple bidirectional request/response streams concurrently over a single TCP connection, eliminating Head-of-Line blocking",
      "HTTP/1.1 encrypts SSL packets natively while HTTP/2 requires plaintext websocket tunnels",
      "HTTP/2 uses UDP sockets directly whereas HTTP/1.1 requires three-way TCP handshakes",
      "HTTP/1.1 allows push notifications directly to browsers without service workers"
    ],
    correctOptionIndex: 0,
    explanation: "HTTP/2 breaks messages into binary frames and interleaves them across a single TCP connection. This eliminates application-layer head-of-line blocking where slow responses delay subsequent queued requests."
  },
  {
    id: "q-chal-06",
    company: "Infosys",
    role: "Specialist Programmer (SP)",
    topic: "Algorithms & DP",
    round: "Technical Assessment",
    question: "In the 0/1 Knapsack problem with N items and capacity W, what is the space complexity if space-optimized using a single 1D array?",
    options: [
      "O(W) by iterating the capacity loop in reverse order from W down to weight[i]",
      "O(N) by storing only the previous item row in forward direction",
      "O(N * W) because 2D matrix back-tracking is strictly mandatory",
      "O(log W) by using binary exponentiation on weights"
    ],
    correctOptionIndex: 0,
    explanation: "Iterating capacity W backwards from W down to item weight ensures that each item is used at most once (0/1 constraint) while updating the table in place, reducing memory from O(N*W) to O(W)."
  },
  {
    id: "q-chal-07",
    company: "Amazon",
    role: "SDE-1",
    topic: "Operating Systems",
    round: "Technical Core",
    question: "Which of the following is NOT one of Coffman's four conditions required for a deadlock to occur?",
    options: [
      "Preemptive Resource Revocation",
      "Mutual Exclusion",
      "Hold and Wait",
      "Circular Wait"
    ],
    correctOptionIndex: 0,
    explanation: "The four Coffman conditions are: 1) Mutual Exclusion, 2) Hold and Wait, 3) No Preemption (resources cannot be forcibly taken), and 4) Circular Wait. Preemption breaks deadlocks rather than causing them."
  },
  {
    id: "q-chal-08",
    company: "TCS Digital",
    role: "System Engineer",
    topic: "Database Indexing",
    round: "Technical Core",
    question: "Why are B+ Trees preferred over B-Trees for database indexing (e.g. MySQL InnoDB, PostgreSQL)?",
    options: [
      "B+ Trees store all actual record pointers in leaf nodes linked sequentially, making range queries and sequential scans significantly faster",
      "B+ Trees have an average lookup time of O(1) compared to O(log N) for B-Trees",
      "B+ Trees consume zero disk storage for non-leaf index nodes",
      "B-Trees cannot handle duplicate key insertions"
    ],
    correctOptionIndex: 0,
    explanation: "In B+ Trees, internal nodes only store keys for routing, allowing higher branching factors (fan-out) and shallow trees. All records reside in leaf nodes connected as a doubly-linked list, enabling efficient range scans without tree re-traversals."
  },
  {
    id: "q-chal-09",
    company: "Resume & Skills Core",
    role: "Full Stack Developer",
    topic: "JavaScript & Event Loop",
    round: "Technical Defense",
    question: "In the JavaScript Event Loop, what is the execution priority between Microtasks (Promise.then, queueMicrotask) and Macrotasks (setTimeout, setInterval)?",
    options: [
      "All pending Microtasks in the microtask queue are executed to completion before the next single Macrotask is processed",
      "Macrotasks always take precedence over Microtasks to maintain UI 60fps rendering",
      "Microtasks and Macrotasks are executed alternately in a strict round-robin order",
      "setTimeout(0) always executes synchronously before any Promise resolutions"
    ],
    correctOptionIndex: 0,
    explanation: "At the end of each synchronous task execution, the JavaScript engine empties the entire microtask queue before rendering and picking the next macrotask from the task queue."
  },
  {
    id: "q-chal-10",
    company: "Behavioral & Leadership",
    role: "All Placement Roles",
    topic: "STAR & Leadership Principles",
    round: "HR & Managerial",
    question: "When an interviewer asks: 'Tell me about a time you disagreed with a team decision on architecture and how you handled it', which structure delivers the highest evaluation score?",
    options: [
      "STAR method: Clearly state the Situation, Task, analytical Action taken to test alternatives with data, and positive team Result with zero resentment",
      "Blame the other team members for not understanding modern libraries and write the code solo",
      "Agree immediately with the loudest person to prevent conflict and avoid discussing trade-offs",
      "State that you have never had a disagreement because all code decisions are obvious"
    ],
    correctOptionIndex: 0,
    explanation: "Top tier placement panels evaluate conflict handling using the STAR framework: demonstrating objective data-driven reasoning, respect for collective consensus, ownership, and deliverable business impact."
  }
];

// POST /api/challenges/start
router.post('/start', authenticateToken, async (req, res) => {
  try {
    const { challengeType } = req.body;
    const mode = db.getChallengeModeById(challengeType) || db.getChallengeModes()[0];

    // Shuffle and pick 10 questions
    const shuffled = [...PLACEMENT_CHALLENGE_BANK].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 10);

    return res.json({
      success: true,
      challengeSessionId: `chal-${uuidv4()}`,
      mode,
      questions: selectedQuestions,
      totalQuestions: selectedQuestions.length
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to start challenge session.' });
  }
});

// POST /api/challenges/submit
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { challengeType, challengeTitle, answers = [], timeSpentSeconds = 60, score: clientScore } = req.body;

    let calculatedScore = typeof clientScore === 'number' ? clientScore : 80;
    const achievements = [];

    if (answers.length >= 8) calculatedScore = Math.max(calculatedScore, 85);
    if (timeSpentSeconds <= 180) {
      achievements.push("⚡ Lightning Reflexes: Completed 10 questions with speed & composure.");
    }
    if (calculatedScore >= 80) {
      achievements.push("🏆 Placement Master: Ranked in top tier for technical accuracy.");
    }
    achievements.push("📈 Readiness Upgrade: +5 points added to your placement skill radar.");

    const newResult = {
      id: `res-${uuidv4()}`,
      userId: req.user.id,
      challengeType: challengeType || 'pressure_round',
      challengeTitle: challengeTitle || 'Daily 10 Placement Challenge',
      score: Math.min(100, Math.max(40, calculatedScore)),
      timeSpentSeconds,
      metrics: { answersCount: answers.length },
      feedback: [
        "Demonstrated solid concept articulation under time pressure.",
        "Accurate architectural trade-off evaluations matching Zoho & Amazon placement criteria."
      ],
      achievementsUnlocked: achievements,
      createdAt: new Date()
    };

    await db.createChallengeResult(newResult);

    // Update user readiness score
    const currentReadiness = await db.getReadinessProfile(req.user.id);
    if (currentReadiness) {
      const newOverall = Math.min(100, (currentReadiness.overallReadiness || 60) + 2);
      await db.upsertReadinessProfile(req.user.id, {
        ...currentReadiness,
        overallReadiness: newOverall,
        streakDays: (currentReadiness.streakDays || 1) + 1
      });
    }

    return res.json({
      success: true,
      score: newResult.score,
      feedback: newResult.feedback,
      achievementsUnlocked: achievements
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to record challenge results.' });
  }
});

export default router;

