import { config } from '../config/index.js';

export const aiEngine = {
  // Evaluates an answer in an interview session adaptively
  evaluateInterviewAnswer({ question, answerText, history = [], companySlug = 'general', difficulty = 'Medium' }) {
    const text = (answerText || '').trim();
    const wordCount = text ? text.split(/\s+/).length : 0;
    const lower = text.toLowerCase();

    // Fillers count
    const fillers = ['um', 'uh', 'like', 'basically', 'actually', 'you know', 'sort of', 'kind of', 'i mean'];
    let fillerCount = 0;
    fillers.forEach(f => {
      const matches = lower.match(new RegExp(`\\b${f}\\b`, 'g'));
      if (matches) fillerCount += matches.length;
    });

    // Check expected concepts
    const expected = question.expectedConcepts || [];
    const coveredConcepts = [];
    const missingConcepts = [];

    expected.forEach(concept => {
      const keywords = concept.toLowerCase().split(/[\s,()\/]+/).filter(w => w.length > 3);
      const isCovered = keywords.some(k => lower.includes(k));
      if (isCovered) {
        coveredConcepts.push(concept);
      } else {
        missingConcepts.push(concept);
      }
    });

    const conceptCoverageRatio = expected.length > 0 ? (coveredConcepts.length / expected.length) : 0.6;
    
    // Scoring
    let technicalScore = 40;
    if (wordCount >= 20) technicalScore += 20;
    if (wordCount >= 60) technicalScore += 15;
    technicalScore += Math.round(conceptCoverageRatio * 25);
    technicalScore = Math.min(96, Math.max(25, technicalScore));

    const completeness = Math.min(100, Math.round(conceptCoverageRatio * 100));
    const clarity = Math.max(30, Math.min(95, 90 - (fillerCount * 4)));
    const overallTurnScore = Math.round((technicalScore * 0.5) + (completeness * 0.3) + (clarity * 0.2));

    // Strengths and Weaknesses
    const strengths = [];
    const weaknesses = [];

    if (coveredConcepts.length > 0) {
      strengths.push(`Addressed core concepts: ${coveredConcepts.slice(0, 2).join(', ')}`);
    }
    if (wordCount >= 40) {
      strengths.push("Provided a structured response with contextual detail.");
    } else {
      weaknesses.push("Response was overly brief; placement interviewers expect step-by-step reasoning.");
    }

    if (missingConcepts.length > 0) {
      weaknesses.push(`Missed key technical aspects: ${missingConcepts.slice(0, 2).join(', ')}`);
    }
    if (fillerCount > 3) {
      weaknesses.push(`Frequent filler words detected (${fillerCount} occurrences), impacting verbal authority.`);
    }

    // Adaptive follow-up generation
    let followUpQuestion = null;
    let isFollowUp = false;

    if (wordCount < 25 && missingConcepts.length > 0) {
      isFollowUp = true;
      followUpQuestion = `You touched on the basics, but could you elaborate specifically on how ${missingConcepts[0]} works with a concrete example?`;
    } else if (lower.includes('hash') || lower.includes('map') || lower.includes('array')) {
      if (question.followUpStarters && question.followUpStarters.length > 0) {
        isFollowUp = true;
        followUpQuestion = question.followUpStarters[Math.floor(Math.random() * question.followUpStarters.length)];
      }
    } else if (missingConcepts.length > 0) {
      isFollowUp = true;
      followUpQuestion = `Interesting approach. In a high-scale environment, what trade-offs or edge cases would you consider regarding ${missingConcepts[0]}?`;
    }

    const advice = missingConcepts.length > 0
      ? `Ensure you explicitly mention ${missingConcepts[0]} and state the time/space trade-offs early in your answer.`
      : "Strong technical answer. To elevate to top-tier rating, proactively discuss failure modes and alternative architectures.";

    return {
      evaluation: {
        score: overallTurnScore,
        technicalDepth: technicalScore,
        completeness,
        clarity,
        coveredConcepts,
        missingConcepts,
        strengths,
        weaknesses,
        improvementAdvice: advice,
        isContextualFollowUp: isFollowUp
      },
      adaptiveNextQuestion: followUpQuestion,
      isFollowUp
    };
  },

  // Generates final autopsy report
  generateInterviewAutopsy(session) {
    const turns = session.turns || [];
    if (turns.length === 0) {
      return {
        overallScore: 70,
        technicalScore: 68,
        communicationScore: 72,
        problemSolvingScore: 70,
        companyFitScore: 74,
        summaryVerdic: "Interview completed. Consistent foundation with room for higher technical precision.",
        keyStrengths: ["Clear verbal presentation", "Structured thought process"],
        criticalGaps: ["Could articulate time complexity earlier in responses", "Deepen edge case coverage"],
        actionableTips: [
          "State Big-O complexity upfront before diving into implementation.",
          "Use the STAR method for behavioral and scenario questions.",
          "Practice articulating trade-offs between space and time."
        ]
      };
    }

    let totalScore = 0;
    let totalTech = 0;
    let totalClarity = 0;
    let totalComplete = 0;

    turns.forEach(t => {
      const ev = t.evaluation || {};
      totalScore += ev.score || 65;
      totalTech += ev.technicalDepth || 60;
      totalClarity += ev.clarity || 70;
      totalComplete += ev.completeness || 60;
    });

    const count = turns.length;
    const avgScore = Math.round(totalScore / count);
    const avgTech = Math.round(totalTech / count);
    const avgComm = Math.round(totalClarity / count);
    const avgComplete = Math.round(totalComplete / count);
    const companyFit = Math.min(95, Math.round((avgScore * 0.7) + 20));

    let verdict = "Candidate demonstrated solid foundational aptitude with strong communication flow.";
    if (avgScore >= 85) verdict = "Exceptional performance ready for top-tier placement rounds.";
    else if (avgScore < 60) verdict = "Needs focused revision on core algorithmic concepts and trade-off analysis.";

    const strengths = [];
    const gaps = [];

    turns.forEach(t => {
      if (t.evaluation?.strengths?.length) strengths.push(...t.evaluation.strengths);
      if (t.evaluation?.weaknesses?.length) gaps.push(...t.evaluation.weaknesses);
    });

    const uniqueStrengths = [...new Set(strengths)].slice(0, 4);
    const uniqueGaps = [...new Set(gaps)].slice(0, 4);

    return {
      overallScore: avgScore,
      technicalScore: avgTech,
      communicationScore: avgComm,
      problemSolvingScore: avgComplete,
      companyFitScore: companyFit,
      summaryVerdic: verdict,
      keyStrengths: uniqueStrengths.length ? uniqueStrengths : ["Good verbal composure", "Addressed problem prompts directly"],
      criticalGaps: uniqueGaps.length ? uniqueGaps : ["Elaborate on low-level implementation details", "Mention edge cases explicitly"],
      actionableTips: [
        "Practice explaining time and space complexity with formal Big-O proofs.",
        "When explaining architectures, explicitly compare at least two alternatives (e.g. SQL vs NoSQL, Array vs Linked List).",
        "Minimize conversational fillers (um, like) by pausing for 2 seconds to formulate thoughts before answering."
      ]
    };
  },

  // Parses resume text into extracted technical entities and defense claims
  parseResumeText(text = '') {
    const raw = text.toLowerCase();
    const skillsFound = new Set();
    const techStackFound = new Set();

    const knownSkills = [
      'react', 'next.js', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'tailwind',
      'node.js', 'express', 'python', 'django', 'fastapi', 'flask', 'java', 'spring boot', 'c++', 'c',
      'mongodb', 'postgresql', 'mysql', 'redis', 'kafka', 'docker', 'kubernetes', 'aws', 'gcp', 'azure',
      'git', 'graphql', 'rest api', 'ci/cd', 'linux', 'data structures', 'algorithms', 'sql', 'nosql',
      'machine learning', 'deep learning', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch'
    ];

    knownSkills.forEach(s => {
      if (raw.includes(s)) {
        skillsFound.add(s.toUpperCase());
        techStackFound.add(s);
      }
    });

    // Extract potential project lines or bullet points
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 20);
    const projectClaims = [];

    lines.forEach((line, idx) => {
      const lowerLine = line.toLowerCase();
      if (
        lowerLine.includes('built') ||
        lowerLine.includes('developed') ||
        lowerLine.includes('implemented') ||
        lowerLine.includes('designed') ||
        lowerLine.includes('created') ||
        lowerLine.includes('architected') ||
        lowerLine.includes('engineered')
      ) {
        const lineTech = Array.from(techStackFound).filter(t => lowerLine.includes(t));
        projectClaims.push({
          claimId: `claim-${idx + 1}`,
          category: 'project',
          text: line,
          techStack: lineTech.map(t => t.toUpperCase())
        });
      }
    });

    // If no explicit action lines found, generate standard claims based on extracted skills
    if (projectClaims.length === 0) {
      const skillsArr = Array.from(skillsFound);
      if (skillsArr.length > 0) {
        projectClaims.push({
          claimId: 'claim-core-1',
          category: 'skill',
          text: `Extensive hands-on proficiency in ${skillsArr.slice(0, 3).join(', ')} for scalable full-stack application development.`,
          techStack: skillsArr.slice(0, 3)
        });
      }
      if (skillsArr.length > 3) {
        projectClaims.push({
          claimId: 'claim-core-2',
          category: 'project',
          text: `Implemented backend services and databases utilizing ${skillsArr.slice(3, 6).join(', ')}.`,
          techStack: skillsArr.slice(3, 6)
        });
      }
    }

    return {
      skills: Array.from(skillsFound),
      technologies: Array.from(techStackFound),
      projectClaims,
      rawSummary: `Extracted ${skillsFound.size} technical skills and ${projectClaims.length} verifiable resume claims.`
    };
  },

  // Generates cross-examination questions for Resume Defense
  generateResumeInterrogation(claim) {
    const text = claim.text || '';
    const tech = claim.techStack || [];
    const primaryTech = tech.length > 0 ? tech[0] : 'your primary technology';

    const questions = [
      `Your resume states: "${text}". Why did you choose ${primaryTech} for this implementation rather than alternative options?`,
      `In this project, what was the most challenging technical bottleneck you encountered with ${primaryTech}, and how did you resolve it?`,
      `How did you handle error recovery, caching, and state synchronization in this system?`,
      `If your user base scaled 100x overnight, which component of this project would fail first, and how would you re-architect it?`
    ];

    return questions[Math.floor(Math.random() * questions.length)];
  },

  // Evaluates a defense answer on a resume claim
  evaluateResumeDefense({ claim, question, answerText }) {
    const text = (answerText || '').trim();
    const wordCount = text.split(/\s+/).length;
    const lower = text.toLowerCase();

    let verdict = 'Needs deeper understanding';
    let score = 50;

    const technicalKeywords = ['latency', 'throughput', 'scalability', 'concurrency', 'cache', 'trade-off', 'index', 'failover', 'distributed', 'memory', 'async', 'promise', 'query', 'payload', 'schema'];
    const matchedKeywords = technicalKeywords.filter(k => lower.includes(k));

    if (wordCount < 18) {
      verdict = 'Unable to explain';
      score = 30;
    } else if (matchedKeywords.length >= 3 && wordCount >= 45) {
      verdict = 'Explained well';
      score = 90;
    } else if (matchedKeywords.length >= 1 && wordCount >= 25) {
      verdict = 'Partially explained';
      score = 70;
    } else {
      verdict = 'Needs deeper understanding';
      score = 52;
    }

    const missing = [];
    if (!lower.includes('trade-off') && !lower.includes('alternative')) missing.push('Comparison against architectural alternatives');
    if (!lower.includes('scale') && !lower.includes('metric') && !lower.includes('throughput')) missing.push('Quantified performance metrics / scaling limits');

    let feedback = '';
    if (verdict === 'Explained well') {
      feedback = 'Articulated strong architectural reasoning and demonstrated genuine implementation ownership.';
    } else if (verdict === 'Partially explained') {
      feedback = 'Good general overview, but lacked specific low-level trade-off metrics and failover explanations.';
    } else if (verdict === 'Needs deeper understanding') {
      feedback = 'Answer remained conceptual. Be ready to explain internal mechanics and design trade-offs.';
    } else {
      feedback = 'Insufficient technical depth. Claims on the resume must be defended with concrete implementation details.';
    }

    return {
      verdict,
      technicalDepthScore: score,
      feedback,
      missingImplementationDetails: missing
    };
  }
};
