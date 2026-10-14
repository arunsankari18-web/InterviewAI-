import { config } from '../config/index.js';

// Comprehensive Dynamic Knowledge Matrix & Answer Generator
export const chatCounselorService = {
  async generateResponse({ message, language = 'en', context = {} }) {
    const rawMessage = (message || '').trim();
    const lower = rawMessage.toLowerCase();
    const isTamil = language === 'ta' || /[\u0B80-\u0BFF]/.test(rawMessage) || lower.includes('tamil') || lower.includes('தமிழ்');

    // 1. If Gemini API Key is provided, call Gemini 1.5 Flash first
    if (config.geminiApiKey && config.geminiApiKey.trim() !== '') {
      try {
        const geminiReply = await this.callGeminiApi(rawMessage, isTamil);
        if (geminiReply && geminiReply.trim()) {
          return {
            reply: geminiReply,
            category: 'ai_llm',
            quickSuggestions: this.generateSuggestions(lower, isTamil)
          };
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to dynamic counselor engine:', err.message);
      }
    }

    // 2. Intelligent Dynamic Semantic Answer Engine
    return this.generateDynamicCounselorReply(rawMessage, lower, isTamil);
  },

  async callGeminiApi(prompt, isTamil) {
    const systemPrompt = isTamil
      ? "You are Interview AI Coach, an expert campus placement and mock interview trainer for college students (specifically targeting Zoho, TCS, Amazon, Infosys, Accenture). Answer in clear, polite, and helpful Tamil (தமிழ்) with proper technical terms. Format answers with markdown bullet points and actionable tips."
      : "You are Interview AI Coach, an expert campus placement and mock interview mentor for college students preparing for technical interviews (Zoho, TCS, Amazon, Accenture, Infosys, startups). Provide structured, high-value, crisp answers with practical examples or code snippets when relevant.";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiApiKey}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\nCandidate Question: ${prompt}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Gemini status ${res.status}`);
    }

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  },

  generateDynamicCounselorReply(raw, lower, isTamil) {
    // -------------------------------------------------------------
    // TOPIC 1: CODING / ALGORITHMS / CODE EXAMPLES
    // -------------------------------------------------------------
    if (lower.includes('two sum') || (lower.includes('two') && lower.includes('sum'))) {
      if (isTamil) {
        return {
          reply: `### 💡 Two Sum பிரச்சனை தீர்வு (JavaScript & Hash Map)

Two Sum என்பது Zoho, Amazon, TCS Digital-ல் கேட்கப்படும் மிகவும் பொதுவான நேர்காணல் கேள்வி.

#### அணுகுமுறை ($O(N)$ Time & $O(N)$ Space):
Brute-force-ல் இரண்டு லூப் ($O(N^2)$) போடுவதற்கு பதிலாக, Hash Map (Object) பயன்படுத்தி ஒரே பாஸில் ($O(N)$) தீர்க்கலாம்.

\`\`\`javascript
function twoSum(nums, target) {
  const map = new Map(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
\`\`\`

**இன்டர்வியூவில் சொல்ல வேண்டிய விஷயம்:**
- Array வரிசைப்படுத்தப்படவில்லை (unsorted) என்றால் Hash Map அணுகுமுறை சிறந்தது.
- Array ஏற்கனவே வரிசைப்படுத்தப்பட்டிருந்தால் (sorted), **Two-Pointer** ($O(1)$ Space) நுட்பத்தை பயன்படுத்தலாம்.`,
          category: 'coding',
          quickSuggestions: ['Two pointer approach explanation', 'Three Sum problem strategy', 'Zoho Array & Matrix questions']
        };
      }
      return {
        reply: `### 💡 Two Sum Problem Solution & Interview Strategy

**Two Sum** is the classic benchmark question frequently asked at **Amazon, Zoho, and TCS Digital**.

#### Optimal Hash Map Approach ($O(N)$ Time, $O(N)$ Space)
Avoid the brute-force $O(N^2)$ nested loop. Store visited values and check for the complement in $O(1)$ lookups:

\`\`\`javascript
function twoSum(nums, target) {
  const map = new Map(); // stores: number -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
\`\`\`

**Key Trade-offs to articulate to the interviewer:**
1. **Unsorted Array:** Hash Map is optimal with $O(N)$ time and $O(N)$ memory.
2. **Already Sorted Array:** Mention the **Two-Pointer** technique ($O(1)$ space, pointers at start & end).`,
        category: 'coding',
        quickSuggestions: ['Explain Two Pointer technique', 'How to solve 3Sum problem?', 'Amazon DSA questions']
      };
    }

    if (lower.includes('reverse') && (lower.includes('string') || lower.includes('linked list') || lower.includes('array'))) {
      if (isTamil) {
        return {
          reply: `### 🔄 Reverse String & Linked List தீர்வு

#### 1. String Reversal (Without built-in \`reverse()\` - Zoho Favorite):
\`\`\`javascript
function reverseString(str) {
  let chars = str.split('');
  let left = 0, right = chars.length - 1;
  while (left < right) {
    let temp = chars[left];
    chars[left] = chars[right];
    chars[right] = temp;
    left++; right--;
  }
  return chars.join('');
}
\`\`\`

#### 2. Reverse Singly Linked List:
\`\`\`javascript
function reverseList(head) {
  let prev = null, curr = head;
  while (curr !== null) {
    let nextNode = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextNode;
  }
  return prev; // new head
}
\`\`\`
*Zoho போன்ற நிறுவனங்களில் built-in \`reverse()\` பயன்படுத்தக் கூடாது என்று வெளிப்படையாகவே சொல்வார்கள்!*`,
          category: 'coding',
          quickSuggestions: ['Detect cycle in Linked List', 'Palindrome Linked List', 'Zoho Round 2 coding patterns']
        };
      }
      return {
        reply: `### 🔄 In-Place Reversal Algorithms (Interview Ready)

#### 1. In-place String Reversal (Two Pointers - Zoho Pattern)
Avoid calling \`.reverse()\`. Interviewers want to see pointer bounds checking:
\`\`\`javascript
function reverseString(str) {
  let arr = str.split('');
  let left = 0, right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
  return arr.join('');
}
\`\`\`

#### 2. Reverse a Singly Linked List ($O(N)$ Time, $O(1)$ Space)
\`\`\`javascript
function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}
\`\`\`
💡 *Pro Tip: In Zoho Round 2, they will ask you to reverse words in a sentence without using split(" ")!*`,
        category: 'coding',
        quickSuggestions: ['Reverse words in a sentence', 'Detect cycle in Linked List (Floyd)', 'Zoho Round 2 problems']
      };
    }

    if (lower.includes('binary search') || lower.includes('search')) {
      return {
        reply: `### 🔍 Binary Search Implementation & Edge Cases

Binary Search operates on a **sorted dataset** in **$O(\\log N)$** time.

\`\`\`javascript
function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    // Avoid integer overflow: low + Math.floor((high - low) / 2)
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1; // Not found
}
\`\`\`

**Interview Pitfalls to Mention:**
- **Integer Overflow:** Mention why \`low + (high - low)/2\` is preferred over \`(low + high)/2\` in languages like C++/Java.
- **Search on Answer:** Binary Search isn't just for arrays; it solves optimization problems (e.g. *Koko Eating Bananas*, *Aggressive Cows*).`,
        category: 'coding',
        quickSuggestions: ['Search in Rotated Sorted Array', 'Binary Search on Answer examples', 'Time complexity analysis']
      };
    }

    if (lower.includes('sql') || lower.includes('query') || lower.includes('highest salary') || lower.includes('join')) {
      return {
        reply: `### 🗄️ Essential SQL Interview Queries (TCS & Enterprise Drives)

#### 1. N-th Highest Salary (Top Asked Query):
\`\`\`sql
-- Approach 1: Using DENSE_RANK() (Recommended for handling ties)
SELECT salary 
FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk 
  FROM Employee
) sub
WHERE rnk = 2; -- Change 2 to N

-- Approach 2: Using LIMIT and OFFSET (MySQL/PostgreSQL)
SELECT DISTINCT salary 
FROM Employee 
ORDER BY salary DESC 
LIMIT 1 OFFSET 1;
\`\`\`

#### 2. INNER vs LEFT vs FULL OUTER JOIN:
- **INNER JOIN:** Returns records with matching values in both tables.
- **LEFT JOIN:** Returns all records from the left table and matched records from the right table.
- **INDEXING TIP:** Always index columns used in \`WHERE\`, \`JOIN ON\`, and \`GROUP BY\` to prevent full table scans!`,
        category: 'database',
        quickSuggestions: ['Difference between WHERE and HAVING', 'Explain Database Indexing & B-Trees', 'TCS Digital SQL Questions']
      };
    }

    // -------------------------------------------------------------
    // TOPIC 2: WEB TECH & REACT & NODE.JS
    // -------------------------------------------------------------
    if (lower.includes('react') || lower.includes('virtual dom') || lower.includes('hook') || lower.includes('state')) {
      if (isTamil) {
        return {
          reply: `### ⚛️ React.js நேர்காணல் முக்கிய கருத்துக்கள்

#### 1. Virtual DOM என்றால் என்ன?
- Virtual DOM என்பது உண்மையான Browser DOM-ன் இலகுவான (lightweight) JavaScript நகல் (in-memory representation).
- State மாறும் போது, React புதிய Virtual DOM-ஐ பழைய Virtual DOM-உடன் ஒப்பிடுகிறது (**Diffing Algorithm**).
- உண்மையான DOM-ல் எந்த பகுதி மாறியுள்ளதோ அதை மட்டுமே புதுப்பிக்கிறது (**Reconciliation**). இதனால் வேகம் அதிகரிக்கிறது.

#### 2. React Hooks:
- **\`useState\`:** காம்பொனென்ட் நிலையை நிர்வகிக்க.
- **\`useEffect\`:** API calls, Event Listeners போன்ற பக்க விளைவுகளை (side-effects) கையாள.
- **\`useMemo\` & \`useCallback\`:** தேவையற்ற மறு கணக்கீடுகளை (re-renders) தடுத்து Performance-ஐ அதிகரிக்க.

*Interview AI தளத்தில் உங்கள் React ப்ராஜெக்ட்டை Resume Defense பகுதியில் சோதித்துப் பாருங்கள்!*`,
          category: 'web_tech',
          quickSuggestions: ['React vs Angular comparison', 'How does useEffect clean up work?', 'Explain Redux vs Context API']
        };
      }
      return {
        reply: `### ⚛️ React.js Core Architecture for Technical Interviews

#### 1. How the Virtual DOM & Reconciliation Works:
1. **Render Phase:** When state or props change, React creates a new lightweight JavaScript Virtual DOM tree.
2. **Diffing Algorithm ($O(N)$ Heuristic):** Compares the new Virtual DOM with the snapshot of the previous one.
3. **Commit Phase:** Only the actual mutated nodes are patched to the real browser DOM, minimizing expensive layout recalculations.

#### 2. Top Hook Questions to Prepare:
- **\`useEffect\` vs \`useLayoutEffect\`:** \`useEffect\` runs asynchronously after paint; \`useLayoutEffect\` fires synchronously before browser paint (useful for measuring DOM layout).
- **State Batching in React 18:** All updates inside timeouts, promises, and native event handlers are automatically batched into a single render.

💡 *In Resume Defense, interviewers will ask: "Why did you use React instead of Vanilla JS for your college project?"*`,
        category: 'web_tech',
        quickSuggestions: ['Explain React Context vs Redux', 'How to prevent unnecessary re-renders?', 'Node.js Event Loop architecture']
      };
    }

    if (lower.includes('node') || lower.includes('event loop') || lower.includes('express') || lower.includes('backend')) {
      return {
        reply: `### 🟢 Node.js & Event Loop Architecture

#### 1. How is Node.js Single-Threaded yet Non-Blocking?
Node.js uses a single execution thread for JavaScript, but offloads asynchronous I/O tasks (file reading, DNS lookup, database queries) to the C++ **Libuv Thread Pool** (default 4 worker threads).

#### 2. The 6 Event Loop Phases:
1. **Timers:** Executes \`setTimeout()\` and \`setInterval()\` callbacks.
2. **Pending Callbacks:** Executes deferred I/O callbacks.
3. **Idle/Prepare:** Internal libuv use.
4. **Poll Phase:** Retrieves new I/O events; executes I/O related callbacks.
5. **Check Phase:** Executes \`setImmediate()\` callbacks.
6. **Close Callbacks:** Executes close handlers like \`socket.on('close')\`.

*Microtasks (\`process.nextTick\` & \`Promise.then\`) execute immediately after each phase before transitioning!*`,
        category: 'backend',
        quickSuggestions: ['Process.nextTick vs setImmediate', 'How to scale Node.js with Cluster module', 'JWT vs Session-based authentication']
      };
    }

    if (lower.includes('mongodb') || lower.includes('nosql') || lower.includes('database') || lower.includes('acid') || lower.includes('dbms')) {
      return {
        reply: `### 📊 SQL vs NoSQL & DBMS ACID Properties

#### 1. When to choose MongoDB (NoSQL) vs PostgreSQL (SQL)?
- **SQL (PostgreSQL/MySQL):** Structured tabular data, strict ACID transactions, complex JOINs, financial and accounting systems.
- **NoSQL (MongoDB):** Flexible JSON-like document schema, rapid iteration, nested hierarchical models, horizontal sharding across clusters.

#### 2. ACID Properties Explained:
- **Atomicity:** "All or Nothing". Either the complete transaction commits, or it completely rolls back.
- **Consistency:** Database transitions from one valid state to another without violating schema constraints.
- **Isolation:** Concurrent transactions execute without interfering with each other (Isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable).
- **Durability:** Once committed, data persists even in power outages or server crashes.`,
        category: 'database',
        quickSuggestions: ['Explain Database Indexing (B-Trees)', 'MongoDB aggregation pipeline examples', 'CAP Theorem in distributed systems']
      };
    }

    // -------------------------------------------------------------
    // TOPIC 3: COMPANY SPECIFIC BLUEPRINTS & QUESTIONS
    // -------------------------------------------------------------
    if (lower.includes('zoho') || lower.includes('ஜோஹோ')) {
      if (lower.includes('round 3') || lower.includes('design') || lower.includes('lld')) {
        return {
          reply: `### 🏢 Zoho Round 3 (Low-Level Design & Console Application)

Round 3 is the primary elimination round at Zoho (120 minutes). You must build a fully functional console application **from scratch**.

#### Frequent Round 3 Problem Statements:
1. **Railway Ticket Reservation System:**
   - Features: Booking, Cancellation, RAC list, Waiting list, Chart preparation.
   - Rule: Strictly no collections like \`ArrayList\` if the interviewer specifies manual dynamic array allocation!
2. **Taxi Booking System:**
   - Features: 4-6 Taxis, Points A to F (15 km apart), allocating nearest taxi with lowest earnings, booking summary.
3. **Splitwise / Expense Sharing App:**
   - Features: Equal, Exact, Percentage splits; simplifying debts among roommates.
4. **Toll Gate Payment & VIP Pass System:**
   - Features: Calculating vehicle toll based on journey type and FASTag deduction.

**Winning Formula:**
- Use Clean OOP: Create dedicated classes (\`Passenger\`, \`Ticket\`, \`TrainService\`).
- Handle edge cases: Zero seats, duplicate bookings, boundary inputs.`,
          category: 'company_intelligence',
          quickSuggestions: ['Zoho Taxi Booking full logic', 'Zoho Round 2 Advanced Coding questions', 'How to prepare C/Java for Zoho']
        };
      }

      if (isTamil) {
        return {
          reply: `### 🏢 Zoho Corporation முழு நேர்காணல் வழிகாட்டி

Zoho தேர்வில் 5 முக்கிய சுற்றுகள் உள்ளன:
1. **சுற்று 1 (Aptitude & C/Java Logic):** Loops, Pointers, Arrays, Time Complexity.
2. **சுற்று 2 (Advanced Coding):** Recursion, Backtracking, 2D Matrix traversal.
3. **சுற்று 3 (System Design - முக்கியம்):** Console-based Application (ரயில் முன்பதிவு, டாக்சி புக்கிங்). Built-in libraries பயன்படுத்தக் கூடாது.
4. **சுற்று 4 (Technical HR):** நீங்கள் எழுதிய குறியீட்டை விளக்கி வாதிட வேண்டும். DBMS, OS கேள்விகள்.
5. **சுற்று 5 (General HR):** உங்கள் ஆர்வம் மற்றும் பணி கலாச்சாரம்.

💡 *பரிந்துரை: Interview AI-ன் **Technical Arena**-வில் பயிற்சி செய்யுங்கள்!*`,
          category: 'company_intelligence',
          quickSuggestions: ['Zoho Round 3 Design examples', 'Zoho recursion and matrix problems', 'Zoho vs TCS Digital']
        };
      }

      return {
        reply: `### 🏢 Zoho Corporation Complete Placement Blueprint

Zoho tests pure fundamental problem-solving without library shortcuts across 5 rounds:

1. **Round 1 (60 mins - Written/Online):** C/Java output prediction, pointer arithmetic, basic loops, numerical puzzles.
2. **Round 2 (90 mins - Advanced Programming):** 5-7 algorithmic questions: String parsing, spiral matrix, recursive permutations, sliding window.
3. **Round 3 (120 mins - LLD Console App):** Train Reservation, Taxi Booking, Invoice System. Modular classes and zero crashes.
4. **Round 4 (45 mins - Technical HR):** Defending Round 2 & 3 code, OS deadlocks, DBMS ACID, project review.
5. **Round 5 (30 mins - Fitment HR):** Long-term stability, mindset, problem-solving enthusiasm.`,
        category: 'company_intelligence',
        quickSuggestions: ['Zoho Round 3 LLD problem patterns', 'How to clear Zoho Round 2?', 'Zoho interview experience tips']
      };
    }

    if (lower.includes('tcs') || lower.includes('டிசிஎஸ்') || lower.includes('prime') || lower.includes('nqt')) {
      return {
        reply: `### 🌐 TCS Digital / Prime Placement Strategy

TCS offers differentiated packages based on performance: **Ninja, Digital (7+ LPA), and Prime (9-11 LPA)**.

#### Round 1: TCS NQT (National Qualifier Test)
- **Advanced Section:** 2 Coding questions (Dynamic Programming, Graph traversal, Greedy). Passing both with edge cases qualifies for Prime/Digital.

#### Round 2: Technical Interview (TR - 45 mins)
- **SQL & DBMS:** Subqueries, Joins, Indexing, Transactions.
- **OOP Principles:** Real-world examples of Polymorphism and Abstraction.
- **Project Cross-Examination:** Explain your tech stack and database schema.

#### Round 3 & 4: Managerial & HR (MR/HR)
- Agile sprints, handling project deadlines, client communications (use **STAR Method**).`,
        category: 'company_intelligence',
        quickSuggestions: ['TCS Digital SQL interview questions', 'TCS Prime coding difficulty', 'STAR framework examples for TCS MR']
      };
    }

    if (lower.includes('amazon') || lower.includes('அமேசான்') || lower.includes('leadership')) {
      return {
        reply: `### 📦 Amazon SDE-1 & Leadership Principles

Amazon values cultural alignment as much as coding. Every round has 20-25 mins dedicated to **16 Leadership Principles (LPs)**.

#### Top 4 Critical LPs for Freshers:
1. **Customer Obsession:** Starting with the end customer and working backwards.
2. **Ownership:** Taking responsibility beyond your assigned module; never saying "that's not my job".
3. **Dive Deep:** Staying connected to details, inspecting metrics, finding root causes.
4. **Bias for Action:** Speed matters in business. Calculated risk-taking when data is incomplete.

#### Technical Rounds Focus:
- Binary Trees, BSTs, Graphs (BFS/DFS, Topological Sort), Heaps, and Dynamic Programming.
- Always analyze Time and Space Complexity ($O(N)$, $O(\\log N)$) before writing code!`,
        category: 'company_intelligence',
        quickSuggestions: ['Amazon LP STAR stories examples', 'Amazon Bar Raiser round details', 'Top LeetCode questions for Amazon']
      };
    }

    if (lower.includes('infosys') || lower.includes('இன்போசிஸ்')) {
      return {
        reply: `### 🏛️ Infosys Campus Drives (SE, DSE & Specialist Programmer)

Infosys recruits for 3 bands: **System Engineer (3.6 LPA), DSE (6.25 LPA), and Specialist Programmer (SP - 9.5 LPA)**.

#### 1. Selection Streams:
- **InfyTQ / HackWithInfy:** Top rankers directly get SP/DSE interview opportunities.
- **On-Campus Drive:** Reasoning, Technical Aptitude, Pseudo-code, and 2-3 Coding questions.

#### 2. Key Technical Topics:
- Core Java/Python fundamentals, OOP, Exception handling.
- Relational database normalization (1NF, 2NF, 3NF, BCNF).
- Software Engineering lifecycles (SDLC, Agile vs Waterfall).`,
        category: 'company_intelligence',
        quickSuggestions: ['Infosys SP interview coding level', 'HackWithInfy preparation plan', 'DBMS Normalization guide']
      };
    }

    if (lower.includes('accenture') || lower.includes('அக்சென்ச்சர்')) {
      return {
        reply: `### 💎 Accenture Recruitment Assessment Guide

Accenture evaluates candidates across 4 successive elimination stages:

1. **Cognitive & Technical Assessment:** Critical thinking, English ability, MS Office/Cloud fundamentals, Pseudo-code.
2. **Coding Assessment (45 mins):** 2 coding questions (Strings, Arrays, Number Theory, Basic Hash Maps).
3. **Communication Assessment (Automated Voice Test):** Sentence reading, repeat sentences, storytelling, and speech clarity.
4. **Technical & HR Interview:** Project walkthrough, conflict handling, and adaptability.`,
        category: 'company_intelligence',
        quickSuggestions: ['Accenture Communication test tips', 'Accenture Pseudo-code sample questions', 'Cognitive assessment tricks']
      };
    }

    // -------------------------------------------------------------
    // TOPIC 4: HR, BEHAVIORAL & STAR FRAMEWORK
    // -------------------------------------------------------------
    if (lower.includes('tell me about yourself') || lower.includes('introduce yourself') || lower.includes('intro')) {
      if (isTamil) {
        return {
          reply: `### 🎯 "Tell Me About Yourself" - சிறந்த முறையில் பதிலளிப்பது எப்படி?

இன்டர்வியூவின் முதல் 90 வினாடிகள் உங்கள் வெற்றியை தீர்மானிக்கிறது. **Present -> Past -> Future** முறையை பின்பற்றுங்கள்:

1. **Present (தற்போது):** உங்கள் பெயர், கல்லூரி, படிப்பு மற்றும் நீங்கள் தற்போது நிபுணத்துவம் பெற்றுள்ள முக்கிய துறைகள் (எ.கா: Full Stack Web Development, DSA).
2. **Past (ப்ராஜெக்ட் & அனுபவம்):** நீங்கள் உருவாக்கிய 1 சிறந்த ப்ராஜெக்ட் அல்லது இன்டர்ன்ஷிப் சாதனை (எ.கா: "Built an AI-driven interview platform with Node.js and React").
3. **Future (எதிர்காலம் & இந்த நிறுவனம்):** இந்த நிறுவனத்தில் இந்த குறிப்பிட்ட பதவிக்கு நீங்கள் ஏன் ஆர்வமாக இருக்கிறீர்கள்.

**செய்யக்கூடாதவை:**
- பள்ளிப் பருவம் அல்லது குடும்ப பின்னணியை விரிவாக பேச வேண்டாம்.
- ரெஸ்யூமில் உள்ளதை அப்படியே வாசிக்க வேண்டாம்; உங்கள் ஆர்வத்தை வெளிப்படுத்துங்கள்!`,
          category: 'behavioral',
          quickSuggestions: ['What are your strengths and weaknesses?', 'Why should we hire you?', 'STAR method example']
        };
      }
      return {
        reply: `### 🎯 How to Ace "Tell Me About Yourself" (The 90-Second Formula)

Use the proven **Present $\\rightarrow$ Past $\\rightarrow$ Future** framework:

1. **The Present (30s):** Who you are, your degree, and your primary technical identity.
   > *"I'm an IT undergraduate passionate about building scalable full-stack web architectures and solving algorithmic challenges."*
2. **The Past (40s):** Highlight your standout project, hackathon, or internship achievement with metrics.
   > *"Recently, I engineered a full-stack placement readiness platform utilizing React, Node.js, and Web Audio APIs, implementing real-time behavioral tracking."*
3. **The Future (20s):** Why this specific company and role is your immediate trajectory.
   > *"I admire Zoho's focus on building core software products from scratch, and I'm eager to contribute as a Software Development Engineer."*

💡 *Avoid reciting your marks or listing family background—keep it technical and forward-looking!*`,
        category: 'behavioral',
        quickSuggestions: ['How to answer "Why should we hire you?"', 'What are your greatest weaknesses?', 'STAR method breakdown']
      };
    }

    if (lower.includes('weakness') || lower.includes('பலவீனம்')) {
      return {
        reply: `### 🛡️ How to Answer "What is Your Greatest Weakness?"

**Rule 1:** Never give fake weaknesses like *"I work too hard"* or *"I'm a perfectionist"* (interviewers dislike this).
**Rule 2:** Pick a genuine non-fatal weakness, and crucially, explain the **active remediation step** you are taking!

#### Example Script:
> *"Earlier, I tended to dive straight into writing code before thoroughly drafting edge cases and modular class boundaries, which led to refactoring delays. To address this, I started diagramming my architecture and writing test cases on paper first before opening the IDE. This has significantly reduced my debugging time."*`,
        category: 'behavioral',
        quickSuggestions: ['Why should we hire you?', 'Where do you see yourself in 5 years?', 'Handling stressful interview questions']
      };
    }

    if (lower.includes('star') || lower.includes('behavioral') || lower.includes('situation')) {
      return {
        reply: `### ⭐ The STAR Method (For High-Scoring Behavioral Answers)

Interview evaluators score answers using STAR:

- **S - Situation (15%):** Set the context. Where and when did this happen?
- **T - Task (15%):** What was the challenge or conflict you needed to resolve?
- **A - Action (55% - Most Critical):** Exactly what steps did **you** take? Use "I", not "We". Describe technical tools and decisions.
- **R - Result (15%):** Quantify the outcome! *(e.g. "Reduced API response latency by 40%", "Delivered project 2 days ahead of schedule")*.

💡 *Practice in **Challenge Hub > Communication Challenge** to calibrate your speaking pace!*`,
        category: 'behavioral',
        quickSuggestions: ['STAR example for team conflict', 'STAR example for project failure', 'Amazon Leadership Principles']
      };
    }

    // -------------------------------------------------------------
    // TOPIC 5: RESUME DEFENSE & MULTIMODAL INTERVIEW TIPS
    // -------------------------------------------------------------
    if (lower.includes('resume') || lower.includes('ரெஸ்யூம்') || lower.includes('claim')) {
      return {
        reply: `### 🛡️ Resume Defense Master Guide

In technical interviews, 70% of questions originate from claims on your resume. Here is how to defend them:

1. **Defend the "Why":** Never just say *"I used MongoDB"*. Say: *"We selected MongoDB because our user interview autopsies contain variable JSON payloads with nested transcripts, making document storage faster than normalized relational tables."*
2. **Acknowledge Trade-offs:** Mention what alternative you rejected and why.
3. **Know Failure Recovery:** Be ready when asked: *"What happens if your server crashes mid-session?"* or *"How would your database perform with 10,000 concurrent users?"*

💡 *Head to the **Resume Defense** module now: Upload your resume, edit your claims, and practice active cross-questioning!*`,
        category: 'resume_defense',
        quickSuggestions: ['How to explain final year project?', 'Defending database choices in interview', 'Resume Credibility Map explained']
      };
    }

    if (lower.includes('eye contact') || lower.includes('filler') || lower.includes('wpm') || lower.includes('body language') || lower.includes('camera')) {
      return {
        reply: `### 👁️ Multimodal Behavioral Tracking (Speech, Eye Contact & Cadence)

Interview AI's Interview Studio and Autopsy track your verbal and non-verbal presence:

1. **Eye Contact Consistency (Target: 70%+):**
   - Look directly into the **webcam lens**, not down at your screen!
   - Natural blinking and micro-glances are fine, but prolonged downward gaze signals uncertainty.
2. **Speaking Pace (Target: 120 - 150 Words Per Minute):**
   - Too fast (>170 WPM): Signals anxiety or memorization.
   - Too slow (<90 WPM): Risks losing the interviewer's engagement.
3. **Eliminating Filler Words (umm, uh, basically, like):**
   - When thinking, **take a 1-2 second silent pause** instead of vocalizing *"umm"* or *"like"*. Silent pauses project confidence and executive presence!`,
        category: 'interview_behavior',
        quickSuggestions: ['How to control interview nervousness', 'How to practice in Interview Studio?', 'Understanding Interview Autopsy report']
      };
    }

    // -------------------------------------------------------------
    // FALLBACK: GENERAL CONTEXTUAL ANSWER
    // -------------------------------------------------------------
    if (isTamil) {
      return {
        reply: `### 🤖 Interview AI வேலைவாய்ப்பு ஆலோசகர்

நீங்கள் கேட்ட கேள்வி: **"${raw}"**

#### உங்கள் நேர்காணல் வெற்றிக்கு சில முக்கிய பரிந்துரைகள்:
1. **தொழில்நுட்ப ஆழம் (Technical Depth):** கோடிங் சுற்றில் மனப்பாடம் செய்யாமல், கோட்டின் Time Complexity ($O(N)$) மற்றும் Space Complexity-ஐ விளக்குங்கள்.
2. **ரெஸ்யூம் உண்மைத்தன்மை:** நீங்கள் ரெஸ்யூமில் எழுதியுள்ள ஒவ்வொரு தொழில்நுட்பத்திற்கும் மாற்று வழிகள் (Trade-offs) தெரிந்து வைத்திருங்கள்.
3. **தொடர் பயிற்சி:** Interview AI-ன் **Interview Studio** மற்றும் **Technical Arena** மூலம் தினமும் குறைந்தது 1 நேர்காணல் பயிற்சி செய்யுங்கள்.

*கீழே உள்ள தலைப்புகளில் ஏதேனும் ஒன்றைத் தேர்ந்தெடுத்து விரிவான ஆலோசனை பெறலாம்!*`,
        category: 'general_counseling',
        quickSuggestions: [
          'Zoho Round 3 Design Round tips',
          'TCS Digital SQL interview questions',
          'Tell me about yourself script',
          'Two sum problem with hash map'
        ]
      };
    }

    return {
      reply: `### 🤖 Interview AI Placement Coach Guidance

You asked: **"${raw}"**

Here is tailored strategic advice for campus recruitment success:

1. **Master the Underlying Fundamentals:** Interviewers at Tier-1 companies (Zoho, TCS Digital, Amazon, product startups) prioritize algorithmic problem-solving and clean architectural reasoning over memorized syntax.
2. **Articulate Your Thought Process:** Always talk through your solution: **Clarify Requirements $\\rightarrow$ State Brute Force $\\rightarrow$ Optimize to $O(N)$ or $O(\\log N)$ $\\rightarrow$ Dry-run with edge cases**.
3. **Leverage the 8 Modules:** Test your verbal cadence in **Interview Studio**, execute code in **Technical Arena**, and defend your claims under **Resume Defense**.

*Explore any of the quick topics below for concrete interview scripts and code:*`,
      category: 'general_counseling',
      quickSuggestions: [
        'How to clear Zoho Round 3 LLD?',
        'TCS Digital SQL & TR round questions',
        'Amazon Leadership Principles guide',
        'Write code for Two Sum with Hash Map'
      ]
    };
  },

  generateSuggestions(lower, isTamil) {
    if (lower.includes('zoho')) {
      return ['Zoho Round 3 Design Round examples', 'Zoho recursion and matrix problems', 'Zoho interview experience tips'];
    }
    if (lower.includes('tcs')) {
      return ['TCS Digital SQL questions', 'TCS Prime coding difficulty', 'TCS Managerial round tips'];
    }
    if (lower.includes('amazon')) {
      return ['Amazon Leadership Principles with examples', 'Amazon Bar Raiser round details', 'Top LeetCode questions for Amazon'];
    }
    return [
      'Two sum problem with hash map',
      'Explain React Virtual DOM',
      'Tell me about yourself formula',
      'How to defend projects on my resume?'
    ];
  }
};
