export const seedCompanies = [
  {
    id: "comp-zoho",
    name: "Zoho Corporation",
    slug: "zoho",
    tier: "Product Elite",
    logo: "🏢",
    overview: "Global software company known for its comprehensive suite of cloud applications, deep problem-solving tests, and strict evaluation of algorithmic problem solving and low-level system design without standard library shortcuts.",
    difficulty: "Hard",
    roles: ["Software Development Engineer", "Product Developer", "Frontend Engineer", "Technical Support Engineer"],
    hiringFocus: "Core problem solving, pure data structures, recursion, pattern-based algorithms, low-level design, and high focus on clean algorithmic thinking.",
    interviewRounds: [
      { roundNumber: 1, name: "Round 1: Basic Programming / Aptitude", type: "Coding & Logic", description: "C/Java/Python fundamentals, loops, pointers/memory, pattern printing, numerical puzzles, and basic time complexity.", durationMinutes: 60, eliminationRate: "70%" },
      { roundNumber: 2, name: "Round 2: Advanced Programming", type: "Problem Solving", description: "Complex string parsing, matrix manipulation, multi-dimensional array transforms, recursion, and custom stack/queue operations.", durationMinutes: 90, eliminationRate: "60%" },
      { roundNumber: 3, name: "Round 3: Design & Implementation", type: "Low-Level Design", description: "Designing an end-to-end console application (e.g. Railway Reservation, Toll Gate, Taxi Booking, Invoice System) with OOP design.", durationMinutes: 120, eliminationRate: "50%" },
      { roundNumber: 4, name: "Round 4: Technical HR / Deep Dive", type: "Core CS", description: "DBMS transaction isolation, OS process synchronization, computer networks, and in-depth defense of code written in earlier rounds.", durationMinutes: 45, eliminationRate: "20%" },
      { roundNumber: 5, name: "Round 5: General HR", type: "Behavioral", description: "Cultural alignment, long-term career aspirations, resilience, problem-solving mindset, and teamwork scenarios.", durationMinutes: 30, eliminationRate: "10%" }
    ],
    blueprint: {
      codingIntensity: 90,
      technicalDepth: 85,
      systemDesignDepth: 75,
      problemSolvingWeight: 95,
      csCoreWeight: 70,
      behavioralWeight: 50,
      topFocusAreas: ["Custom Data Structures", "Low-Level Design (LLD)", "Recursion & Backtracking", "String & Matrix Puzzles", "OOP Modeling"]
    },
    reportedExperiences: [
      { candidateRole: "Product Developer", year: "2025 Placement Drive", outcome: "Selected", difficultyRating: "Hard", summary: "Focus heavily on edge cases. In Round 3, I was asked to build a dynamic Splitwise/Expense Manager from scratch without using any built-in data structure libraries.", roundsDetailed: ["Cleared 5 string logic questions in Round 1", "Built recursive maze solver in Round 2", "Designed Train Reservation System with RAC and Waiting List logic in Round 3"] },
      { candidateRole: "Software Engineer", year: "2024 Off-Campus", outcome: "Selected", difficultyRating: "Medium-Hard", summary: "Interviewer focused on memory efficiency, recursion depth, and asked why I didn't use bit manipulation.", roundsDetailed: ["2D Matrix search and spiral traversal", "Custom Expression Parser with operator precedence"] }
    ],
    placementTips: [
      "Avoid relying on built-in language sorting or parsing libraries; practice writing raw algorithms.",
      "In the design round, write modular classes with single-responsibility principles.",
      "Be prepared to defend every line of code you wrote in earlier rounds."
    ]
  },
  {
    id: "comp-tcs",
    name: "Tata Consultancy Services (TCS Digital / Prime)",
    slug: "tcs",
    tier: "Tier 1 Enterprise",
    logo: "🌐",
    overview: "Global IT service and consulting powerhouse. Digital and Prime cadres test advanced algorithmic coding, SQL database optimization, cloud fundamentals, and full-stack project architecture.",
    difficulty: "Medium",
    roles: ["System Engineer (Digital)", "Full Stack Developer (Prime)", "Cloud Engineer", "Data Analyst"],
    hiringFocus: "Data structures, DBMS SQL queries and normalization, OOP principles, real-world project contributions, and structured STAR-method communication.",
    interviewRounds: [
      { roundNumber: 1, name: "Round 1: National Qualifier (TCS NQT)", type: "Online Assessment", description: "Advanced coding (2 questions: DP/Greedy/Graphs), numerical ability, verbal reasoning, and CS foundation.", durationMinutes: 90, eliminationRate: "65%" },
      { roundNumber: 2, name: "Round 2: Technical Interview (TR)", type: "Technical Core", description: "Deep dive into OOP, SQL joins and indexing, REST APIs, resume project defense, and live coding of a standard DSA problem.", durationMinutes: 45, eliminationRate: "40%" },
      { roundNumber: 3, name: "Round 3: Managerial Interview (MR)", type: "Scenario & Situational", description: "Handling client deadlines, agile sprint management, conflict resolution, and architectural trade-off questions.", durationMinutes: 30, eliminationRate: "20%" },
      { roundNumber: 4, name: "Round 4: HR Interview", type: "Behavioral & Fit", description: "Relocation flexibility, shifts, career vision, and ethical workplace dilemma scenarios.", durationMinutes: 20, eliminationRate: "10%" }
    ],
    blueprint: {
      codingIntensity: 70,
      technicalDepth: 75,
      systemDesignDepth: 60,
      problemSolvingWeight: 75,
      csCoreWeight: 85,
      behavioralWeight: 75,
      topFocusAreas: ["SQL Complex Queries & Joins", "OOP Inheritance & Polymorphism", "Array & String Manipulation", "Project Defense", "Web Architecture"]
    },
    reportedExperiences: [
      { candidateRole: "TCS Prime Developer", year: "2025 On-Campus", outcome: "Selected", difficultyRating: "Medium", summary: "The technical interviewer scrutinized my final year React/Node project, asking how JWT tokens are validated and how database indexing speeds up queries.", roundsDetailed: ["Live coded binary search variation", "Wrote 3 complex SQL GROUP BY & HAVING queries", "Defended resume projects in detail"] }
    ],
    placementTips: [
      "Master SQL subqueries, window functions, and indexing explanations.",
      "Understand the internal working of Java JVM, Python GIL, or JavaScript Event Loop.",
      "Structure behavioural answers using Situation, Task, Action, Result (STAR)."
    ]
  },
  {
    id: "comp-amazon",
    name: "Amazon",
    slug: "amazon",
    tier: "Tier 1 Product",
    logo: "📦",
    overview: "World's largest e-commerce and cloud provider. Rigorous interview process balancing deep algorithmic problem solving, scalable distributed system design, and 16 Leadership Principles.",
    difficulty: "Hard",
    roles: ["Software Development Engineer I (SDE-1)", "Frontend Engineer I", "Cloud Support Associate", "Data Engineer"],
    hiringFocus: "Binary Trees, Dynamic Programming, Graphs (BFS/DFS), Hash Maps, Low/High Level System Design, and Amazon Leadership Principles (Customer Obsession, Ownership, Bias for Action, Dive Deep).",
    interviewRounds: [
      { roundNumber: 1, name: "Round 1: Online Assessment (OA)", type: "Coding & Work Simulation", description: "2 Medium-Hard LeetCode style problems + Work Style Assessment measuring Leadership Principles.", durationMinutes: 90, eliminationRate: "70%" },
      { roundNumber: 2, name: "Round 2: Technical & Problem Solving 1", type: "DSA & LP", description: "Live coding on Binary Trees / Heaps / Graphs + 20 minutes on Customer Obsession and Ownership stories.", durationMinutes: 60, eliminationRate: "50%" },
      { roundNumber: 3, name: "Round 3: Technical & Problem Solving 2", type: "DSA & LLD", description: "Dynamic Programming / Trie / Matrix problems + Object Oriented Low Level Design + Leadership Principles.", durationMinutes: 60, eliminationRate: "50%" },
      { roundNumber: 4, name: "Round 4: Bar Raiser", type: "Comprehensive & LP", description: "Challenging edge-case problem solving with strict optimization + deep Dive Deep and Deliver Results interrogation.", durationMinutes: 60, eliminationRate: "40%" }
    ],
    blueprint: {
      codingIntensity: 95,
      technicalDepth: 90,
      systemDesignDepth: 80,
      problemSolvingWeight: 95,
      csCoreWeight: 75,
      behavioralWeight: 90,
      topFocusAreas: ["Trees, Graphs & Heaps", "Dynamic Programming & Memoization", "Leadership Principles (STAR Stories)", "Time & Space Complexity Proofs", "Object-Oriented Design"]
    },
    reportedExperiences: [
      { candidateRole: "SDE-1", year: "2025 SDE Intern Conversion", outcome: "Selected", difficultyRating: "Hard", summary: "Every technical round started with 20 minutes of Leadership Principle questions. Make sure you have quantified metrics in your stories!", roundsDetailed: ["Word Break II with Memoization", "Top K Frequent Elements in Data Stream using Min-Heap", "Designed Locker Management System (LLD)"] }
    ],
    placementTips: [
      "Always state the brute force first, calculate its time complexity, and then explain your optimal strategy before typing a line of code.",
      "Prepare 2 distinct real-life stories for every Amazon Leadership Principle with measurable metrics."
    ]
  },
  {
    id: "comp-accenture",
    name: "Accenture",
    slug: "accenture",
    tier: "Tier 1 Enterprise",
    logo: "⚡",
    overview: "Leading global professional services company specializing in digital, cloud, security, and enterprise transformation. Advanced Associate Software Engineer (AASE) drives prioritize full stack development and cloud agility.",
    difficulty: "Medium",
    roles: ["Advanced Associate Software Engineer (AASE)", "Associate Software Engineer (ASE)", "Security Associate"],
    hiringFocus: "Pseudocode analysis, core programming (Java/Python/C++), SQL & NoSQL differences, cloud fundamentals, and communicative problem solving.",
    interviewRounds: [
      { roundNumber: 1, name: "Round 1: Cognitive, Technical & Coding", type: "Online Assessment", description: "Cognitive assessment, technical pseudocode logic, networking, MS Office/Cloud basics, and 2 hands-on coding questions.", durationMinutes: 90, eliminationRate: "55%" },
      { roundNumber: 2, name: "Round 2: Communication Assessment", type: "Verbal & Audio", description: "Automated speech testing: reading, listening comprehension, story retelling, and spontaneous speaking.", durationMinutes: 20, eliminationRate: "30%" },
      { roundNumber: 3, name: "Round 3: Combined Tech & HR Interview", type: "Technical & Behavioral", description: "Resume walkthrough, explaining project challenges, live problem solving, OOP concepts, and situational teamwork questions.", durationMinutes: 35, eliminationRate: "25%" }
    ],
    blueprint: {
      codingIntensity: 65,
      technicalDepth: 70,
      systemDesignDepth: 55,
      problemSolvingWeight: 70,
      csCoreWeight: 80,
      behavioralWeight: 80,
      topFocusAreas: ["OOP Concepts & Real-life Examples", "Database Normalization & ACID Properties", "Array/String Manipulation", "Project Explanation & Architecture", "Communication Clarity"]
    },
    reportedExperiences: [
      { candidateRole: "AASE", year: "2024 On-Campus", outcome: "Selected", difficultyRating: "Medium", summary: "Interviewer wanted clean explanations of Polymorphism vs Encapsulation and asked me to write an optimized string palindrome logic.", roundsDetailed: ["Explained MERN architecture", "Wrote anagram check without sorting", "Answered conflict resolution scenario"] }
    ],
    placementTips: [
      "Practice speaking fluently and clearly for the automated communication round.",
      "Be prepared with clear real-world analogies for OOP and ACID properties."
    ]
  },
  {
    id: "comp-infosys",
    name: "Infosys (Specialist Programmer & Digital)",
    slug: "infosys",
    tier: "Tier 1 Enterprise",
    logo: "🔷",
    overview: "Global leader in next-generation digital services. Specialist Programmer (SP) and Digital Specialist Engineer (DSE) tracks involve competitive programming, advanced graph algorithms, and cloud native architectures.",
    difficulty: "Medium-Hard",
    roles: ["Specialist Programmer (SP)", "Digital Specialist Engineer (DSE)", "Systems Engineer (SE)"],
    hiringFocus: "HackWithInfy / InfyTQ challenges, Greedy algorithms, Dynamic Programming, Segment Trees, REST APIs, and database transactions.",
    interviewRounds: [
      { roundNumber: 1, name: "Round 1: Advanced Coding / HackWithInfy", type: "Online Coding", description: "3 algorithmic problems ranging from Medium to Hard LeetCode/Codeforces level.", durationMinutes: 180, eliminationRate: "80%" },
      { roundNumber: 2, name: "Round 2: Technical Deep Dive", type: "Algorithms & Core", description: "Explaining optimal logic for OA questions, graph traversals, data structures, and database query optimization.", durationMinutes: 50, eliminationRate: "40%" },
      { roundNumber: 3, name: "Round 3: HR & Cultural Alignment", type: "Behavioral", description: "Willingness to learn new tech stacks, adaptability, team collaboration, and client handling scenarios.", durationMinutes: 25, eliminationRate: "15%" }
    ],
    blueprint: {
      codingIntensity: 85,
      technicalDepth: 80,
      systemDesignDepth: 65,
      problemSolvingWeight: 85,
      csCoreWeight: 80,
      behavioralWeight: 65,
      topFocusAreas: ["Dynamic Programming & Bitmasking", "Graph Algorithms (Dijkstra, Topological Sort)", "SQL Optimization & Window Functions", "RESTful Architecture", "Time Complexity Analysis"]
    },
    reportedExperiences: [
      { candidateRole: "Specialist Programmer", year: "2025 HackWithInfy", outcome: "Selected", difficultyRating: "Hard", summary: "Interviewer asked me to live-code a Dynamic Programming solution on a matrix with obstacles, then asked how MongoDB handles sharding.", roundsDetailed: ["Optimized DP with Space Optimization", "Detailed discussion on B-Tree vs Hash indexing"] }
    ],
    placementTips: [
      "For SP/DSE roles, practice medium/hard DP and graph problems extensively.",
      "Be able to derive mathematical time/space complexity using Big-O and recurrence relations."
    ]
  }
];

export const seedQuestions = [
  // DSA Questions
  {
    id: "q-dsa-01",
    companySlug: "zoho",
    role: "Software Development Engineer",
    roundType: "Technical",
    topic: "Data Structures",
    subTopic: "Hash Maps & Internal Mechanics",
    difficulty: "Medium",
    questionText: "How does a Hash Map work internally under the hood? Explain how hash collisions occur and how techniques like Separate Chaining and Open Addressing resolve them, including worst-case time complexity.",
    sourceType: "Verified / Reported Question",
    sourceMetadata: { reportedBy: "Zoho 2025 Drive", reportingPeriod: "Q1 2025", frequencyScore: 94 },
    expectedConcepts: ["Hash function & bucket indexing", "Collision handling (Separate Chaining, Linear/Quadratic Probing)", "Load factor & rehashing threshold (0.75)", "Time complexity O(1) avg vs O(N) worst case", "Java 8 Red-Black tree conversion for chains > 8"],
    sampleAnswerSummary: "A hash map calculates bucket index using hash(key) & (n - 1). Collisions are resolved via linked lists / balanced trees or open addressing. When load factor exceeds 0.75, the table doubles in capacity and rehashes elements.",
    followUpStarters: [
      "What happens if all keys produce the exact same hash code?",
      "Can you explain why resizing uses powers of two for bitwise AND masking?",
      "How does thread safety impact Hash Map performance, and what is the difference with ConcurrentHashMap?"
    ]
  },
  {
    id: "q-dsa-02",
    companySlug: "amazon",
    role: "Software Development Engineer I (SDE-1)",
    roundType: "Technical",
    topic: "Algorithms",
    subTopic: "Two Pointers & Sliding Window",
    difficulty: "Medium",
    questionText: "Given an array of integers and a target sum, how would you design an optimal algorithm to find two numbers that sum to the target? Compare the time and space trade-offs between Brute Force, Hash Table, and Two Pointers on a sorted array.",
    sourceType: "Verified / Reported Question",
    sourceMetadata: { reportedBy: "Amazon SDE OA & Technical", reportingPeriod: "2024-2025", frequencyScore: 98 },
    expectedConcepts: ["Brute force O(N^2) time, O(1) space", "Hash map single-pass O(N) time, O(N) space", "Sorted array two-pointer O(N log N) or O(N) if pre-sorted, O(1) space", "Edge cases: duplicates, negative numbers, overflow"],
    sampleAnswerSummary: "For unsorted arrays with single pass, store complements (target - num) in a hash map for O(N) time and O(N) space. If space is constrained and array can be sorted in place, sorting + two pointers yields O(N log N) time and O(1) auxiliary space.",
    followUpStarters: [
      "How would you extend this approach to 3Sum or 4Sum without generating duplicate triplets?",
      "What if the input stream is continuous and cannot fit into memory?",
      "How does your algorithm handle duplicate pairs that sum to the target?"
    ]
  },
  {
    id: "q-dsa-03",
    companySlug: "infosys",
    role: "Specialist Programmer (SP)",
    roundType: "Technical",
    topic: "Algorithms",
    subTopic: "Dynamic Programming",
    difficulty: "Hard",
    questionText: "How do you identify whether a problem has Optimal Substructure and Overlapping Subproblems? Walk me through how you would convert a recursive exponential solution into a dynamic programming solution using memoization and tabulation.",
    sourceType: "Verified / Reported Question",
    sourceMetadata: { reportedBy: "HackWithInfy Final Round", reportingPeriod: "2024", frequencyScore: 89 },
    expectedConcepts: ["Identification of recursive state variables", "Memoization top-down with recursion call stack", "Tabulation bottom-up with iterative table filling", "Space optimization by keeping only necessary previous states", "Recurrence relation formulation"],
    sampleAnswerSummary: "Optimal substructure means optimal solution of problem contains optimal solutions of subproblems. Overlapping subproblems means same subproblems are computed repeatedly. We define state dp[i], identify base cases, write transition equation, and optionally reduce space if only last k states are needed.",
    followUpStarters: [
      "Can you give an example where DP space complexity can be reduced from O(N) to O(1)?",
      "What is the difference between 0/1 Knapsack and Unbounded Knapsack state transitions?",
      "When is dynamic programming inferior to Greedy approaches?"
    ]
  },
  // DBMS & CS Core
  {
    id: "q-dbms-01",
    companySlug: "tcs",
    role: "System Engineer (Digital)",
    roundType: "Technical Core",
    topic: "Database Management Systems",
    subTopic: "ACID Properties & Transactions",
    difficulty: "Medium",
    questionText: "Explain the four ACID properties in relational database management systems with real-world banking transaction examples. What mechanisms does a database use to ensure Atomicity and Durability during system crashes?",
    sourceType: "Reported Interview Pattern",
    sourceMetadata: { reportedBy: "TCS Digital Drive", reportingPeriod: "Q4 2024", frequencyScore: 92 },
    expectedConcepts: ["Atomicity (all-or-nothing, rollback via Write-Ahead Logging/Undo log)", "Consistency (schema constraints, foreign keys)", "Isolation (concurrency control, Read Committed vs Serializable)", "Durability (WAL, Redo log, checkpointing to disk)", "Banking transfer example"],
    sampleAnswerSummary: "ACID guarantees transactional integrity. Atomicity ensures debit and credit both succeed or roll back. Consistency maintains invariant constraints. Isolation prevents dirty reads and phantom reads. Durability writes logs to non-volatile storage before confirming commits via WAL.",
    followUpStarters: [
      "What are dirty reads, non-repeatable reads, and phantom reads?",
      "How does 2-Phase Locking (2PL) differ from Multi-Version Concurrency Control (MVCC)?",
      "Why would a high-throughput system choose eventual consistency over strong ACID guarantees?"
    ]
  },
  {
    id: "q-dbms-02",
    companySlug: "accenture",
    role: "Advanced Associate Software Engineer",
    roundType: "Technical Core",
    topic: "Database Management Systems",
    subTopic: "SQL Joins & Indexing",
    difficulty: "Medium",
    questionText: "What is the difference between INNER JOIN, LEFT OUTER JOIN, and FULL JOIN? Furthermore, how does a B-Tree index work to accelerate SELECT queries, and what is the trade-off during INSERT/UPDATE operations?",
    sourceType: "Reported Interview Pattern",
    sourceMetadata: { reportedBy: "Accenture AASE Drive", reportingPeriod: "2025", frequencyScore: 95 },
    expectedConcepts: ["Join types and Venn diagram/Cartesian matching", "B-Tree index structure (root, branch, leaf nodes with pointers)", "Lookup complexity reduction from O(N) full table scan to O(log N)", "Index overhead on writes due to page splits and tree rebalancing", "Composite index leftmost prefix rule"],
    sampleAnswerSummary: "INNER JOIN returns matching records; LEFT JOIN returns all left rows plus matched right rows. B-Tree indexes maintain a sorted balanced hierarchy allowing O(log N) binary searches on disk blocks. Write operations slow down because every insert/update must rebalance index trees.",
    followUpStarters: [
      "What is the difference between a Clustered Index and a Non-Clustered Index?",
      "Why should you not create an index on a boolean column with low cardinality?",
      "How do you inspect query execution plans using EXPLAIN in PostgreSQL or MySQL?"
    ]
  },
  // Web & React
  {
    id: "q-web-01",
    companySlug: "general",
    role: "Full Stack Developer",
    roundType: "Technical",
    topic: "Frontend & React",
    subTopic: "React Virtual DOM & State Management",
    difficulty: "Medium",
    questionText: "How does React's Virtual DOM and Reconciliation algorithm (Fiber) work? What happens under the hood when setState or useState is called, and why are unique keys essential when rendering lists?",
    sourceType: "Company-Style Question",
    sourceMetadata: { reportedBy: "Modern Web Tech Placement Suite", reportingPeriod: "2025-2026", frequencyScore: 96 },
    expectedConcepts: ["Virtual DOM tree diffing (O(N) heuristic algorithm)", "React Fiber incremental rendering and work loops", "State batching in React 18", "Keys for element identity tracking across re-renders to prevent unnecessary DOM mutations", "Component lifecycle & useEffect dependencies"],
    sampleAnswerSummary: "React maintains a lightweight in-memory representation of real DOM. When state changes, a new VDOM tree is constructed. React diffs the old and new trees using heuristic rules: different component types produce different trees, and unique keys allow matching elements across renders, minimizing direct real DOM manipulation.",
    followUpStarters: [
      "What is the difference between useMemo, useCallback, and React.memo?",
      "Can you explain why React Fiber uses a singly-linked list tree structure instead of a standard recursion stack?",
      "How does Concurrent Mode in React 18 enable interruptible rendering?"
    ]
  },
  // Behavioral & HR
  {
    id: "q-hr-01",
    companySlug: "amazon",
    role: "Software Development Engineer",
    roundType: "Behavioral & HR",
    topic: "Behavioral",
    subTopic: "Conflict Resolution & Disagreement",
    difficulty: "Medium",
    questionText: "Tell me about a situation during a project or academic team assignment where you had a strong technical disagreement with a peer or team lead. How did you handle it, what was the resolution, and what did you learn?",
    sourceType: "Verified / Reported Question",
    sourceMetadata: { reportedBy: "Amazon & Product Companies Behavioral Bank", reportingPeriod: "2025", frequencyScore: 97 },
    expectedConcepts: ["STAR framework (Situation, Task, Action, Result)", "Focus on data and objective trade-offs over ego", "Active listening and understanding counter-arguments", "Prototyping/benchmarking to test hypotheses", "Disagree and Commit principle"],
    sampleAnswerSummary: "Use STAR format: Describe project context (e.g. database choice or API architecture), articulate the specific difference of technical perspective, explain how you gathered data or benchmarked both solutions objectively, show the compromise reached, and conclude with the successful project metric outcome.",
    followUpStarters: [
      "If the team lead insisted on their approach despite benchmark evidence, how would you proceed?",
      "What would you do differently if you were to encounter that exact scenario again today?",
      "How do you ensure positive team rapport after an intense architectural debate?"
    ]
  }
];

export const seedTechnicalProblems = [
  {
    id: "prob-01",
    title: "Two Sum & Pair Target",
    category: "DSA",
    companyTag: "Zoho / Amazon",
    subCategory: "Arrays & Hash Tables",
    difficulty: "Easy",
    timeLimitMs: 1500,
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your O(N) hash map solution here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`
    },
    testCases: [
      { input: "nums = [2,7,11,15], target = 9", expected: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", expected: "[1,2]" },
      { input: "nums = [3,3], target = 6", expected: "[0,1]" }
    ],
    defenseQuestions: [
      "What is the time and space complexity of your solution?",
      "Why is a Hash Map lookup O(1) on average, and what could cause it to degrade to O(N)?",
      "How would your approach change if the array was already sorted in ascending order?"
    ]
  },
  {
    id: "prob-02",
    title: "Longest Substring Without Repeating Characters",
    category: "DSA",
    companyTag: "Amazon / Zoho",
    subCategory: "Strings & Sliding Window",
    difficulty: "Medium",
    timeLimitMs: 2000,
    description: "Given a string `s`, find the length of the longest substring without repeating characters using a sliding window.",
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  let left = 0;
  let maxLen = 0;
  const seen = new Map();

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (seen.has(char) && seen.get(char) >= left) {
      left = seen.get(char) + 1;
    }
    seen.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      python: `def length_of_longest_substring(s: str) -> int:
    seen = {}
    left = 0
    max_len = 0
    for right, char in enumerate(s):
        if char in seen and seen[char] >= left:
            left = seen[char] + 1
        seen[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`
    },
    testCases: [
      { input: "s = 'abcabcbb'", expected: "3" },
      { input: "s = 'bbbbb'", expected: "1" },
      { input: "s = 'pwwkew'", expected: "3" },
      { input: "s = ''", expected: "0" }
    ],
    defenseQuestions: [
      "Explain how the left pointer jumps when a duplicate character is encountered.",
      "What happens when the input string consists of Unicode symbols or emoji characters?",
      "Can this be optimized further in terms of memory if the character set is restricted to standard ASCII?"
    ]
  },
  {
    id: "prob-03",
    title: "Spiral Matrix Traversal & Clockwise Unroll",
    category: "DSA",
    companyTag: "Zoho Round 2",
    subCategory: "2D Matrix & Pointers",
    difficulty: "Medium",
    timeLimitMs: 1500,
    description: "Given an `m x n` matrix, return all elements of the matrix in clockwise spiral order. Common Zoho technical coding round benchmark.",
    starterCode: {
      javascript: `function spiralOrder(matrix) {
  if (!matrix.length || !matrix[0].length) return [];
  const result = [];
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) result.push(matrix[top][i]);
    top++;
    for (let i = top; i <= bottom; i++) result.push(matrix[i][right]);
    right--;
    if (top <= bottom) {
      for (let i = right; i >= left; i--) result.push(matrix[bottom][i]);
      bottom--;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--) result.push(matrix[i][left]);
      left++;
    }
  }
  return result;
}`
    },
    testCases: [
      { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", expected: "[1,2,3,6,9,8,7,4,5]" },
      { input: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]", expected: "[1,2,3,4,8,12,11,10,9,5,6,7]" }
    ],
    defenseQuestions: [
      "What edge cases occur with 1xN single-row or Nx1 single-column matrices?",
      "How do boundary checks prevent duplicate processing of the center row/column?",
      "Can this traversal be executed recursively?"
    ]
  },
  {
    id: "prob-04",
    title: "Valid Parentheses & Nested Syntax Validator",
    category: "DSA",
    companyTag: "TCS Digital / Zoho",
    subCategory: "Stacks & String Parsing",
    difficulty: "Easy",
    timeLimitMs: 1000,
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type in correct order.",
    starterCode: {
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`
    },
    testCases: [
      { input: "s = '()[]{}'", expected: "true" },
      { input: "s = '(]'", expected: "false" },
      { input: "s = '([{}])'", expected: "true" }
    ],
    defenseQuestions: [
      "Why is a LIFO Stack the natural data structure for balanced bracket verification?",
      "What is the space complexity if the string has no closing brackets?",
      "How would you extend this to evaluate arithmetic expressions with operator precedence?"
    ]
  },
  {
    id: "prob-05",
    title: "Merge Overlapping Intervals",
    category: "DSA",
    companyTag: "Amazon SDE-1",
    subCategory: "Sorting & Greedy Intervals",
    difficulty: "Medium",
    timeLimitMs: 1500,
    description: "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of non-overlapping intervals that cover all the intervals in the input.",
    starterCode: {
      javascript: `function merge(intervals) {
  if (intervals.length <= 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = merged[merged.length - 1];

    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  return merged;
}`
    },
    testCases: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", expected: "[[1,6],[8,10],[15,18]]" },
      { input: "intervals = [[1,4],[4,5]]", expected: "[[1,5]]" }
    ],
    defenseQuestions: [
      "Why is sorting by start time strictly required before the linear pass?",
      "What is the total Big-O time complexity dominated by?",
      "How would you solve the Meeting Rooms II problem (finding minimum conference rooms required)?"
    ]
  },
  {
    id: "prob-06",
    title: "Subarray Sum Equals K (Continuous Subarrays)",
    category: "DSA",
    companyTag: "Infosys SP / TCS Digital",
    subCategory: "Prefix Sum & Hash Maps",
    difficulty: "Medium",
    timeLimitMs: 1500,
    description: "Given an array of integers `nums` and an integer `k`, return the total number of continuous subarrays whose sum equals to `k`.",
    starterCode: {
      javascript: `function subarraySum(nums, k) {
  let count = 0;
  let currentSum = 0;
  const prefixSumMap = new Map();
  prefixSumMap.set(0, 1);

  for (const num of nums) {
    currentSum += num;
    if (prefixSumMap.has(currentSum - k)) {
      count += prefixSumMap.get(currentSum - k);
    }
    prefixSumMap.set(currentSum, (prefixSumMap.get(currentSum) || 0) + 1);
  }
  return count;
}`
    },
    testCases: [
      { input: "nums = [1,1,1], k = 2", expected: "2" },
      { input: "nums = [1,2,3], k = 3", expected: "2" }
    ],
    defenseQuestions: [
      "Why does initializing prefixSumMap with (0: 1) matter for subarrays starting at index 0?",
      "Why does the two-pointer sliding window fail when negative numbers exist in the array?",
      "What is the space complexity in the worst case where all prefix sums are distinct?"
    ]
  },
  {
    id: "prob-07",
    title: "SQL Second Highest & N-th Salary per Department",
    category: "DBMS",
    companyTag: "TCS / Amazon",
    subCategory: "Window Functions & DENSE_RANK",
    difficulty: "Medium",
    timeLimitMs: 1200,
    description: "Write an SQL query using window functions to find the second highest earning employee in each department without using subquery limit offsets.",
    starterCode: {
      javascript: `-- Schema: Employee (id, name, salary, department_id), Department (id, name)
WITH RankedSalaries AS (
  SELECT 
    d.name AS department_name,
    e.name AS employee_name,
    e.salary,
    DENSE_RANK() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) AS salary_rank
  FROM Employee e
  JOIN Department d ON e.department_id = d.id
)
SELECT department_name, employee_name, salary
FROM RankedSalaries
WHERE salary_rank = 2;`
    },
    testCases: [
      { input: "Sample Employee Table with 3 Departments", expected: "Outputs exact 2nd highest earner per department" }
    ],
    defenseQuestions: [
      "What is the difference between RANK(), DENSE_RANK(), and ROW_NUMBER() during salary ties?",
      "Explain how the database execution engine executes PARTITION BY vs GROUP BY.",
      "How would you index the Employee table to optimize partition ordering?"
    ]
  },
  {
    id: "prob-08",
    title: "SQL Consecutive Logins & Active Day Streaks",
    category: "DBMS",
    companyTag: "Amazon / Zoho",
    subCategory: "Date Arithmetic & LAG/LEAD",
    difficulty: "Hard",
    timeLimitMs: 1500,
    description: "Find all users who logged in for at least 3 consecutive days. Table `Logins (user_id, login_date)`.",
    starterCode: {
      javascript: `-- Table: Logins (user_id INT, login_date DATE)
WITH DistinctLogins AS (
  SELECT DISTINCT user_id, login_date FROM Logins
),
GroupedLogins AS (
  SELECT 
    user_id,
    login_date,
    DATEADD(day, -ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY login_date), login_date) AS streak_group
  FROM DistinctLogins
)
SELECT user_id, COUNT(*) AS streak_days
FROM GroupedLogins
GROUP BY user_id, streak_group
HAVING COUNT(*) >= 3;`
    },
    testCases: [
      { input: "Logins table with continuous 3-day timestamps", expected: "Groups consecutive login streaks accurately" }
    ],
    defenseQuestions: [
      "Explain the mathematical trick of subtracting ROW_NUMBER() from login_date to group streaks.",
      "Why is `SELECT DISTINCT` mandatory before computing row numbers?",
      "How would you optimize this query when Logins contains over 100 million rows?"
    ]
  },
  {
    id: "prob-09",
    title: "Design Thread-Safe Singleton & Factory Pattern",
    category: "CS Core",
    companyTag: "Zoho / TCS Core",
    subCategory: "Object-Oriented Design & Concurrency",
    difficulty: "Medium",
    timeLimitMs: 1500,
    description: "Implement a thread-safe Singleton database connection pool manager with Double-Checked Locking in Java or JavaScript ES6 module caching.",
    starterCode: {
      javascript: `// Thread-safe Singleton Database Connection Pool in ES6
class DatabasePool {
  constructor() {
    if (DatabasePool.instance) {
      return DatabasePool.instance;
    }
    this.connectionCount = 10;
    this.status = "CONNECTED";
    DatabasePool.instance = this;
  }

  getConnection() {
    return { id: Math.random().toString(36).substring(7), active: true };
  }
}

// Freeze to prevent modifications
const instance = new DatabasePool();
Object.freeze(instance);
// export default instance;`
    },
    testCases: [
      { input: "new DatabasePool() === new DatabasePool()", expected: "true" }
    ],
    defenseQuestions: [
      "Why is the `volatile` keyword mandatory in Java double-checked locking to prevent instruction reordering?",
      "What are the disadvantages of Singletons in unit testing and dependency injection?",
      "How does the Module pattern in Node.js provide thread-safe singletons by default?"
    ]
  },
  {
    id: "prob-10",
    title: "Implement Custom Promise.all with Concurrency Control",
    category: "Web",
    companyTag: "Full Stack & Web Roles",
    subCategory: "Asynchronous JavaScript & Event Loop",
    difficulty: "Medium",
    timeLimitMs: 1500,
    description: "Implement `customPromiseAll(promises)` from scratch without using `Promise.all`. Ensure fail-fast on first rejection and preserve original result order.",
    starterCode: {
      javascript: `function customPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!promises.length) return resolve([]);
    const results = [];
    let completed = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          results[index] = value;
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}`
    },
    testCases: [
      { input: "promises = [Promise.resolve(1), Promise.resolve(2)]", expected: "[1,2]" }
    ],
    defenseQuestions: [
      "Why must we use `results[index] = value` instead of `results.push(value)`?",
      "Explain the microtask queue execution order when multiple promises resolve simultaneously.",
      "How would you extend this to support a concurrency limit of max 3 active network requests?"
    ]
  }
];

export const seedChallengeModes = [
  {
    id: "pressure_round",
    title: "Pressure Round",
    tagline: "High-speed rapid response training",
    icon: "⏱️",
    badge: "Time Pressure",
    durationSeconds: 45,
    qCount: 10,
    stats: "10 Questions · 45s / Qn · Speed & Composure",
    description: "Short response windows with rapid placement panel follow-ups to test structured thinking, composure, and conciseness under strict technical interview time pressure."
  },
  {
    id: "technical_deep_dive",
    title: "Technical Deep Dive",
    tagline: "Single topic deep progressive probing",
    icon: "🧠",
    badge: "Specialized Depth",
    durationSeconds: 60,
    qCount: 10,
    stats: "10 Questions · Deep CS Concepts · Progressive Probing",
    description: "Focuses deeply on core company topics (DBMS Internals, Operating Systems, Computer Networks, and Architecture), testing theoretical and practical engineering depth."
  },
  {
    id: "weakness_attack",
    title: "Weakness Attack",
    tagline: "Auto-targets previous failure points",
    icon: "🎯",
    badge: "Personalized",
    durationSeconds: 60,
    qCount: 10,
    stats: "10 Questions · Auto-Target Gaps · Skill Matrix Upgrade",
    description: "Intelligently scans your diagnostic performance, extracting low-scoring topics and forcing targeted drills until confidence and mastery are validated."
  },
  {
    id: "communication_challenge",
    title: "Communication Challenge",
    tagline: "Speech clarity, pacing & STAR structure",
    icon: "🎙️",
    badge: "Verbal Excellence",
    durationSeconds: 60,
    qCount: 10,
    stats: "10 Questions · STAR / PREP Method · Pacing Analytics",
    description: "Tests structured answer framing (STAR & PREP methods), verbal conciseness, pacing, and eliminates repetitive filler words in technical explanations."
  },
  {
    id: "project_defense",
    title: "Project Defense Challenge",
    tagline: "Cross-examination of architectural choices",
    icon: "💻",
    badge: "System & Architecture",
    durationSeconds: 90,
    qCount: 10,
    stats: "10 Questions · Tech Stack Ownership · Trade-off Defense",
    description: "Deep scrutiny of design patterns, database selections, scalability trade-offs, and production failure recovery in candidate projects."
  },
  {
    id: "hr_challenge",
    title: "HR & Behavioral Challenge",
    tagline: "Leadership, ethics & dilemma scenarios",
    icon: "👔",
    badge: "Behavioral Fit",
    durationSeconds: 60,
    qCount: 10,
    stats: "10 Questions · Situational Ethics · Cultural Alignment",
    description: "Behavioral assessment evaluating conflict resolution, deadline management, team collaboration, and alignment with top tier company hiring standards."
  }
];

