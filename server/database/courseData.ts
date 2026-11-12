import { Course, Assessment, RecruiterJob } from '../../src/types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course_prog_fundamentals',
    title: 'Programming Fundamentals',
    tagline: 'Master core computational thinking, variables, data types, logic control, and modular functions.',
    description: 'The definitive foundation for any software career. Learn how computers execute instructions, how to write clean, idiomatic algorithms, manage memory, handle exceptions, and structure programs using modern principles.',
    category: 'Programming',
    difficulty: 'Beginner',
    estimated_hours: 6,
    skills_covered: ['Programming', 'Python', 'Problem Solving', 'Clean Code'],
    assessment_id: 'assess_prog_fundamentals',
    modules: [
      {
        id: 'mod_pf_1',
        title: 'Module 1: Variables, Data Types & Control Flow',
        lessons: [
          {
            id: 'pf_l1',
            title: 'Memory, Variables, and Primitive Types',
            order: 1,
            duration_minutes: 20,
            module_title: 'Module 1: Variables, Data Types & Control Flow',
            content: `### How Code Executes in Memory
Every running program allocates variables in system memory (Stack and Heap). Understanding types—integers, floating point numbers, strings, and booleans—ensures you prevent arithmetic overflow and type mismatch bugs.

Key Concepts:
- **Strong vs Weak Typing**: Why explicit types prevent runtime catastrophes.
- **Mutability vs Immutability**: Strings and tuples cannot be altered in-place; lists and dictionaries can.
- **Scope & Lifetime**: Local function variables exist only while the function frame executes.`,
            code_snippet: `# Safe variable initialization and type hinting
def calculate_net_total(subtotal: float, tax_rate: float) -> float:
    if subtotal < 0 or tax_rate < 0:
        raise ValueError("Prices and tax rates cannot be negative")
    return round(subtotal * (1.0 + tax_rate), 2)

print(calculate_net_total(49.99, 0.08)) # Output: 53.99`,
            practical_application: 'Write a currency conversion script that validates input types, checks for non-negative values, and formats outputs with standard financial precision.',
            key_takeaway: 'Variables are labeled memory pointers; validating input types early prevents cascading failures.'
          },
          {
            id: 'pf_l2',
            title: 'Conditionals, Loops & Iteration Mechanics',
            order: 2,
            duration_minutes: 25,
            module_title: 'Module 1: Variables, Data Types & Control Flow',
            content: `### Directing Program Execution
Control flow dictates which code branches execute. Clean conditionals avoid deep nesting (the "Arrow Anti-pattern").

Best Practices:
- **Guard Clauses**: Return early when edge cases or validation errors occur.
- **Iterators over Manual Indexing**: Use \`for item in collection\` or enumerate rather than manual index counters.
- **Break & Continue**: Control loop termination without convoluted boolean flags.`,
            code_snippet: `# Guard clause pattern avoiding deep indentation
def process_user_registration(user_data: dict) -> bool:
    if not user_data.get("email"):
        return False
    if len(user_data.get("password", "")) < 8:
        return False
    
    # Happy path executes cleanly at base indentation
    save_to_database(user_data)
    return True`,
            practical_application: 'Implement a log parser that iterates over 1,000 server logs, identifies HTTP 500 error strings, and aggregates counts by endpoint.',
            key_takeaway: 'Guard clauses keep your main business logic flat, readable, and testable.'
          }
        ]
      },
      {
        id: 'mod_pf_2',
        title: 'Module 2: Modular Functions & Error Handling',
        lessons: [
          {
            id: 'pf_l3',
            title: 'Decomposition & Pure Functions',
            order: 3,
            duration_minutes: 30,
            module_title: 'Module 2: Modular Functions & Error Handling',
            content: `### Designing Single-Responsibility Functions
A pure function produces the exact same output for the same input arguments and causes zero side-effects (does not mutate global variables, disk files, or network state).

Pure functions are:
- Trivially easy to unit test
- Safe to cache (memoize)
- Parallelizable across threads without race conditions`,
            code_snippet: `# Pure function vs impure function
# PURE: Depends only on arguments, mutates nothing outside
def sanitize_email(raw_email: str) -> str:
    return raw_email.strip().lower()

# Easy to unit test
assert sanitize_email("  User@CareerIQ.com ") == "user@careeriq.com"`,
            practical_application: 'Refactor a monolithic 80-line data script into three pure, single-purpose helper functions.',
            key_takeaway: 'Single-responsibility functions dramatically reduce cognitive overhead and eliminate unintended side effects.'
          },
          {
            id: 'pf_l4',
            title: 'Robust Exception Handling & Fail-Safe Patterns',
            order: 4,
            duration_minutes: 25,
            module_title: 'Module 2: Modular Functions & Error Handling',
            content: `### Graceful Degradation in Production
Never use bare \`except:\` or silent catch blocks that swallow errors. Catch specific exceptions, log the stack trace with context, and provide fallback defaults or user-friendly error responses.`,
            code_snippet: `import logging

def fetch_exchange_rate(currency: str) -> float:
    try:
        response = http_client.get(f"/rates/{currency}", timeout=3.0)
        response.raise_for_status()
        return response.json()["rate"]
    except TimeoutError:
        logging.warning(f"Rate service timed out for {currency}, using cached fallback.")
        return get_cached_rate(currency)
    except Exception as err:
        logging.error(f"Unexpected error fetching {currency}: {err}")
        raise`,
            practical_application: 'Add comprehensive try-except blocks with timeout guards to an external network request handler.',
            key_takeaway: 'Catch specific exceptions and preserve error context rather than silencing failures.'
          }
        ]
      }
    ],
    lessons: [
      {
        id: 'pf_l1',
        title: 'Memory, Variables, and Primitive Types',
        order: 1,
        duration_minutes: 20,
        module_title: 'Module 1: Variables, Data Types & Control Flow',
        content: `### How Code Executes in Memory\nEvery running program allocates variables in system memory. Understanding types ensures you prevent arithmetic overflow and type mismatch bugs.`,
        code_snippet: `def calculate_net_total(subtotal: float, tax_rate: float) -> float:\n    return round(subtotal * (1.0 + tax_rate), 2)`,
        practical_application: 'Write a currency conversion script that validates input types.',
        key_takeaway: 'Variables are labeled memory pointers; validating input types early prevents cascading failures.'
      },
      {
        id: 'pf_l2',
        title: 'Conditionals, Loops & Iteration Mechanics',
        order: 2,
        duration_minutes: 25,
        module_title: 'Module 1: Variables, Data Types & Control Flow',
        content: `### Directing Program Execution\nControl flow dictates which code branches execute. Clean conditionals avoid deep nesting using guard clauses.`,
        code_snippet: `def process_user_registration(user_data: dict) -> bool:\n    if not user_data.get("email"):\n        return False\n    return True`,
        practical_application: 'Implement a log parser that iterates over server logs.',
        key_takeaway: 'Guard clauses keep your main business logic flat, readable, and testable.'
      },
      {
        id: 'pf_l3',
        title: 'Decomposition & Pure Functions',
        order: 3,
        duration_minutes: 30,
        module_title: 'Module 2: Modular Functions & Error Handling',
        content: `### Designing Single-Responsibility Functions\nA pure function produces the exact same output for the same input arguments and causes zero side-effects.`,
        code_snippet: `def sanitize_email(raw_email: str) -> str:\n    return raw_email.strip().lower()`,
        practical_application: 'Refactor a monolithic data script into pure helper functions.',
        key_takeaway: 'Single-responsibility functions eliminate unintended side effects.'
      },
      {
        id: 'pf_l4',
        title: 'Robust Exception Handling & Fail-Safe Patterns',
        order: 4,
        duration_minutes: 25,
        module_title: 'Module 2: Modular Functions & Error Handling',
        content: `### Graceful Degradation in Production\nNever use bare catch blocks that swallow errors. Catch specific exceptions and preserve context.`,
        code_snippet: `try:\n    res = fetch_data()\nexcept TimeoutError:\n    res = fallback_cache()`,
        practical_application: 'Add try-except blocks with timeout guards to network calls.',
        key_takeaway: 'Catch specific exceptions and preserve error context rather than silencing failures.'
      }
    ]
  },
  {
    id: 'course_dsa',
    title: 'Data Structures & Algorithms',
    tagline: 'Master Big-O time and space complexity, arrays, hash maps, trees, and dynamic programming.',
    description: 'The core technical interview and engineering curriculum. Learn how to choose the right data structure for maximum throughput, evaluate asymptotic complexity, and write optimal search and sorting routines.',
    category: 'Data Structures',
    difficulty: 'Intermediate',
    estimated_hours: 8,
    skills_covered: ['Data Structures & Algorithms', 'Problem Solving', 'Python', 'Algorithms'],
    assessment_id: 'assess_dsa',
    modules: [
      {
        id: 'mod_dsa_1',
        title: 'Module 1: Asymptotic Analysis & Linear Structures',
        lessons: [
          {
            id: 'dsa_l1',
            title: 'Big-O Notation: Time & Space Trade-offs',
            order: 1,
            duration_minutes: 30,
            module_title: 'Module 1: Asymptotic Analysis & Linear Structures',
            content: `### Measuring Algorithmic Scalability
Big-O describes how run-time or memory usage scales as input size N grows toward infinity.

- **O(1) Constant**: Hash map lookup, array index access.
- **O(log N) Logarithmic**: Binary search in sorted array.
- **O(N) Linear**: Traversing an unsorted list.
- **O(N log N) Linearithmic**: MergeSort, QuickSort, TimSort.
- **O(N²) Quadratic**: Nested loops comparing all pairs (avoid for N > 5,000).`,
            code_snippet: `# O(1) Lookup vs O(N) Search
# BAD: O(N) array search inside a loop -> O(N^2) total
seen_ids = [101, 102, 103]
# GOOD: O(1) average lookup using a Set / Hash Table -> O(N) total
seen_ids_set = {101, 102, 103}
if target_id in seen_ids_set: # O(1)
    pass`,
            practical_application: 'Benchmark the lookup speed of an item in a list of 100,000 strings versus a set of 100,000 strings.',
            key_takeaway: 'Hash sets and hash tables reduce membership search from O(N) to O(1).'
          },
          {
            id: 'dsa_l2',
            title: 'Arrays, Strings & Two-Pointer Patterns',
            order: 2,
            duration_minutes: 35,
            module_title: 'Module 1: Asymptotic Analysis & Linear Structures',
            content: `### Two-Pointer & Sliding Window Techniques
Many array and string interview problems that look like O(N²) can be solved in O(N) using two pointers moving toward each other or a sliding window bounding a valid substring.`,
            code_snippet: `# Two-Sum in a Sorted Array in O(N) time and O(1) space
def two_sum_sorted(nums: list[int], target: int) -> tuple[int, int]:
    left, right = 0, len(nums) - 1
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return (left, right)
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return (-1, -1)`,
            practical_application: 'Implement a sliding window algorithm to find the longest substring without repeating characters in O(N) time.',
            key_takeaway: 'Two pointers on sorted data avoid nested loops, reducing quadratic time to linear.'
          }
        ]
      },
      {
        id: 'mod_dsa_2',
        title: 'Module 2: Hash Tables, Trees & Graphs',
        lessons: [
          {
            id: 'dsa_l3',
            title: 'Hash Maps & Collision Resolution',
            order: 3,
            duration_minutes: 30,
            module_title: 'Module 2: Hash Tables, Trees & Graphs',
            content: `### The Most Important Practical Data Structure
Hash maps use a hash function to map arbitrary keys to array buckets. When two keys produce the same bucket index, collision resolution techniques like Separate Chaining (linked lists in bucket) or Open Addressing resolve the conflict.`,
            code_snippet: `# Grouping Anagrams using Hash Map in O(N * K) time
from collections import defaultdict

def group_anagrams(words: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for word in words:
        # Canonical sorted key
        key = "".join(sorted(word))
        groups[key].append(word)
    return list(groups.values())`,
            practical_application: 'Build an in-memory Least-Recently-Used (LRU) Cache utilizing a Hash Map and Doubly Linked List for O(1) get and put operations.',
            key_takeaway: 'Hash tables turn expensive search operations into near-instantaneous pointer lookups.'
          },
          {
            id: 'dsa_l4',
            title: 'Binary Trees, BFS & DFS Traversal',
            order: 4,
            duration_minutes: 40,
            module_title: 'Module 2: Hash Tables, Trees & Graphs',
            content: `### Hierarchical Data & Traversal
- **Breadth-First Search (BFS)**: Uses a Queue (FIFO) to explore nodes level-by-level. Ideal for finding shortest paths in unweighted graphs.
- **Depth-First Search (DFS)**: Uses Recursion or a Stack (LIFO) to explore as deep as possible along each branch before backtracking.`,
            code_snippet: `from collections import deque

def bfs_shortest_path(graph: dict, start: str, target: str) -> int:
    queue = deque([(start, 0)]) # (node, distance)
    visited = {start}
    
    while queue:
        current, dist = queue.popleft()
        if current == target:
            return dist
        for neighbor in graph.get(current, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
    return -1`,
            practical_application: 'Implement a dependency resolver for package installations using Depth-First Search topological sort with cycle detection.',
            key_takeaway: 'BFS finds the shortest path level-by-level; DFS dives deep and is optimal for maze exploration and cycle detection.'
          }
        ]
      }
    ],
    lessons: [
      {
        id: 'dsa_l1',
        title: 'Big-O Notation: Time & Space Trade-offs',
        order: 1,
        duration_minutes: 30,
        module_title: 'Module 1: Asymptotic Analysis & Linear Structures',
        content: `### Measuring Algorithmic Scalability\nBig-O describes how run-time or memory usage scales as input size N grows toward infinity.`,
        code_snippet: `seen_ids = {101, 102} # O(1) lookup`,
        practical_application: 'Benchmark list vs set lookups for 100k items.',
        key_takeaway: 'Hash sets reduce membership search from O(N) to O(1).'
      },
      {
        id: 'dsa_l2',
        title: 'Arrays, Strings & Two-Pointer Patterns',
        order: 2,
        duration_minutes: 35,
        module_title: 'Module 1: Asymptotic Analysis & Linear Structures',
        content: `### Two-Pointer & Sliding Window Techniques\nSolve array problems in O(N) using two pointers moving toward each other.`,
        code_snippet: `while left < right:\n    current_sum = nums[left] + nums[right]`,
        practical_application: 'Implement a sliding window algorithm.',
        key_takeaway: 'Two pointers on sorted data avoid nested loops.'
      },
      {
        id: 'dsa_l3',
        title: 'Hash Maps & Collision Resolution',
        order: 3,
        duration_minutes: 30,
        module_title: 'Module 2: Hash Tables, Trees & Graphs',
        content: `### The Most Important Practical Data Structure\nHash maps use a hash function to map keys to array buckets.`,
        code_snippet: `groups = defaultdict(list)`,
        practical_application: 'Build an LRU cache with Hash Map + Doubly Linked List.',
        key_takeaway: 'Hash tables turn expensive searches into O(1) lookups.'
      },
      {
        id: 'dsa_l4',
        title: 'Binary Trees, BFS & DFS Traversal',
        order: 4,
        duration_minutes: 40,
        module_title: 'Module 2: Hash Tables, Trees & Graphs',
        content: `### Hierarchical Data & Traversal\nBFS uses a queue for shortest paths; DFS uses recursion for depth and backtracking.`,
        code_snippet: `queue = deque([(start, 0)])\nwhile queue:\n    node, dist = queue.popleft()`,
        practical_application: 'Implement a dependency resolver using topological sort.',
        key_takeaway: 'BFS finds shortest path; DFS dives deep for backtracking.'
      }
    ]
  },
  {
    id: 'course_web_dev',
    title: 'Web Development Fundamentals',
    tagline: 'Build modern client-server web applications with HTML5, CSS3, JavaScript/TypeScript, and RESTful APIs.',
    description: 'Learn the architectural foundation of the modern web. Master the DOM, HTTP request-response cycles, client-side rendering with React, asynchronous fetch requests, and state management.',
    category: 'Web & APIs',
    difficulty: 'Beginner',
    estimated_hours: 6,
    skills_covered: ['JavaScript', 'TypeScript', 'React', 'HTML5', 'CSS3', 'REST APIs'],
    assessment_id: 'assess_web_dev',
    modules: [
      {
        id: 'mod_web_1',
        title: 'Module 1: The Client-Server Architecture & DOM',
        lessons: [
          {
            id: 'web_l1',
            title: 'HTTP Methods, Headers & Status Codes',
            order: 1,
            duration_minutes: 25,
            module_title: 'Module 1: The Client-Server Architecture & DOM',
            content: `### The Backbone of the Internet
Web applications communicate over HTTP/HTTPS. Every request specifies a verb:
- **GET**: Retrieve resource (safe and idempotent)
- **POST**: Create resource (not idempotent)
- **PUT**: Replace resource completely (idempotent)
- **PATCH**: Partial modification
- **DELETE**: Remove resource

Status Code Families:
- **2xx**: Success (200 OK, 201 Created, 204 No Content)
- **3xx**: Redirection (301 Moved Permanently, 304 Not Modified)
- **4xx**: Client Errors (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found)
- **5xx**: Server Errors (500 Internal Error, 502 Bad Gateway, 503 Service Unavailable)`,
            code_snippet: `// Fetching data asynchronously with error status checking
async function loadUserData(userId: string) {
  try {
    const res = await fetch(\`/api/users/\${userId}\`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) {
      throw new Error(\`HTTP Error \${res.status}: \${res.statusText}\`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Network communication failure:", err);
    throw err;
  }
}`,
            practical_application: 'Inspect the Network tab in your browser DevTools while loading a SaaS dashboard to observe status codes and payload sizes.',
            key_takeaway: 'Always verify response.ok before parsing JSON to catch 4xx and 5xx errors cleanly.'
          },
          {
            id: 'web_l2',
            title: 'React Components, Props & Hooks State',
            order: 2,
            duration_minutes: 35,
            module_title: 'Module 1: The Client-Server Architecture & DOM',
            content: `### Declarative UI Programming with React
React replaces imperative DOM manipulation (\`document.getElementById\`) with declarative component trees driven by state.

Core Rules:
1. **Never mutate state directly**: Always use the state setter function (\`setCount(prev => prev + 1)\`).
2. **Component Purity**: Components should calculate output solely based on props and state.
3. **Dependency Arrays in useEffect**: Always declare primitive dependencies accurately to prevent stale closures and infinite loops.`,
            code_snippet: `import React, { useState, useEffect } from 'react';

export const SearchInput: React.FC<{ onSearch: (q: string) => void }> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search roles or skills..."
      className="px-3 py-2 border rounded-lg"
    />
  );
};`,
            practical_application: 'Build a debounced live-search bar in React that queries an API only after the user pauses typing for 300ms.',
            key_takeaway: 'Declarative state rendering combined with debounced effects prevents unnecessary API flood.'
          }
        ]
      }
    ],
    lessons: [
      {
        id: 'web_l1',
        title: 'HTTP Methods, Headers & Status Codes',
        order: 1,
        duration_minutes: 25,
        module_title: 'Module 1: The Client-Server Architecture & DOM',
        content: `### The Backbone of the Internet\nWeb applications communicate over HTTP verbs (GET, POST, PUT, DELETE) and status code families.`,
        code_snippet: `const res = await fetch('/api/data');\nif (!res.ok) throw new Error(res.statusText);`,
        practical_application: 'Inspect Network tab in DevTools.',
        key_takeaway: 'Always verify response.ok before parsing JSON.'
      },
      {
        id: 'web_l2',
        title: 'React Components, Props & Hooks State',
        order: 2,
        duration_minutes: 35,
        module_title: 'Module 1: The Client-Server Architecture & DOM',
        content: `### Declarative UI Programming with React\nReact replaces imperative DOM manipulation with declarative component trees driven by state.`,
        code_snippet: `const [count, setCount] = useState(0);`,
        practical_application: 'Build a debounced search bar in React.',
        key_takeaway: 'Declarative state rendering prevents UI bugs.'
      }
    ]
  },
  {
    id: 'course_sql_databases',
    title: 'SQL & Database Architecture',
    tagline: 'Design relational schemas, write high-performance SQL queries, and manage indexing strategies.',
    description: 'Learn enterprise database fundamentals. Master ACID transactions, relational normalization (1NF-3NF), B-Tree indexes, joins, aggregations, window functions, and query optimization.',
    category: 'Databases',
    difficulty: 'Intermediate',
    estimated_hours: 6,
    skills_covered: ['SQL', 'PostgreSQL', 'Databases', 'Data Modeling'],
    assessment_id: 'assess_sql',
    modules: [
      {
        id: 'mod_sql_1',
        title: 'Module 1: Relational Modeling & Essential Queries',
        lessons: [
          {
            id: 'sql_l1',
            title: 'Table Schemas, Primary & Foreign Keys',
            order: 1,
            duration_minutes: 25,
            module_title: 'Module 1: Relational Modeling & Essential Queries',
            content: `### Relational Integrity & Schema Design
Relational databases enforce data integrity at the storage layer.

- **Primary Key (PK)**: Uniquely identifies every record in a table.
- **Foreign Key (FK)**: Enforces referential integrity between parent and child tables (e.g., \`user_id\` in \`orders\`).
- **ON DELETE CASCADE**: Automatically removes child rows when the parent record is deleted.`,
            code_snippet: `CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    proficiency VARCHAR(20) CHECK (proficiency IN ('Beginner', 'Intermediate', 'Advanced')),
    UNIQUE(user_id, skill_name)
);`,
            practical_application: 'Design a normalized 3-table schema for a Job Portal connecting Candidates, Jobs, and Job Applications.',
            key_takeaway: 'Foreign keys with appropriate cascade rules guarantee data consistency and prevent orphan records.'
          },
          {
            id: 'sql_l2',
            title: 'Joins, Aggregations & Group By',
            order: 2,
            duration_minutes: 30,
            module_title: 'Module 1: Relational Modeling & Essential Queries',
            content: `### Combining and Summarizing Data
- **INNER JOIN**: Returns rows where matching keys exist in both tables.
- **LEFT JOIN**: Returns all rows from the left table and matched rows from the right table (NULL if no match).
- **GROUP BY**: Groups rows with identical values in specified columns to calculate aggregate functions (\`COUNT\`, \`SUM\`, \`AVG\`, \`MAX\`).
- **HAVING**: Filters grouped data after aggregation (unlike \`WHERE\`, which filters before aggregation).`,
            code_snippet: `-- Count candidates per target role with at least 5 verified skills
SELECT 
    p.target_role,
    COUNT(DISTINCT p.user_id) AS total_candidates,
    AVG(r.overall_score) AS average_readiness_score
FROM profiles p
JOIN readiness_scores r ON p.user_id = r.user_id
WHERE p.target_role IS NOT NULL
GROUP BY p.target_role
HAVING COUNT(DISTINCT p.user_id) >= 5
ORDER BY average_readiness_score DESC;`,
            practical_application: 'Write a query that computes monthly active users and percentage growth month-over-month.',
            key_takeaway: 'WHERE filters individual records prior to grouping; HAVING filters aggregated groups.'
          }
        ]
      },
      {
        id: 'mod_sql_2',
        title: 'Module 2: Indexing & Query Optimization',
        lessons: [
          {
            id: 'sql_l3',
            title: 'B-Tree Indexes & EXPLAIN ANALYZE',
            order: 3,
            duration_minutes: 35,
            module_title: 'Module 2: Indexing & Query Optimization',
            content: `### Accelerating Slow Queries
Without an index, the database engine must execute a Full Table Scan (Sequential Scan), reading every block on disk.
A B-Tree index maintains a sorted tree of pointers, turning an O(N) scan into an O(log N) lookup.

Use \`EXPLAIN ANALYZE\` to inspect execution plans:
- Check for "Seq Scan" on large tables.
- Look at "Execution Time" and "Rows Filtered".
- Create compound indexes for queries filtering across multiple columns.`,
            code_snippet: `-- Inspect execution cost before and after index
EXPLAIN ANALYZE 
SELECT * FROM applications WHERE recruiter_id = 'rec_101' AND status = 'Shortlisted';

-- Create compound index matching the query filter order
CREATE INDEX idx_apps_recruiter_status ON applications(recruiter_id, status);`,
            practical_application: 'Profile an unindexed table of 500,000 records using EXPLAIN ANALYZE, add an appropriate index, and verify query speed improvement.',
            key_takeaway: 'B-Tree indexes transform slow linear disk scans into lightning-fast logarithmic tree traversals.'
          }
        ]
      }
    ],
    lessons: [
      {
        id: 'sql_l1',
        title: 'Table Schemas, Primary & Foreign Keys',
        order: 1,
        duration_minutes: 25,
        module_title: 'Module 1: Relational Modeling & Essential Queries',
        content: `### Relational Integrity\nLearn how primary keys, foreign keys, and unique constraints enforce database consistency.`,
        code_snippet: `CREATE TABLE users (\n  id UUID PRIMARY KEY,\n  email VARCHAR(255) UNIQUE NOT NULL\n);`,
        practical_application: 'Design schema for Candidates and Job Applications.',
        key_takeaway: 'Foreign keys guarantee relational consistency and prevent orphan records.'
      },
      {
        id: 'sql_l2',
        title: 'Joins, Aggregations & Group By',
        order: 2,
        duration_minutes: 30,
        module_title: 'Module 1: Relational Modeling & Essential Queries',
        content: `### Combining Data\nMaster INNER JOIN, LEFT JOIN, GROUP BY, and HAVING clauses.`,
        code_snippet: `SELECT role, COUNT(*) FROM users GROUP BY role HAVING COUNT(*) > 5;`,
        practical_application: 'Write an aggregation query computing candidate statistics.',
        key_takeaway: 'WHERE filters before grouping; HAVING filters aggregated groups.'
      },
      {
        id: 'sql_l3',
        title: 'B-Tree Indexes & EXPLAIN ANALYZE',
        order: 3,
        duration_minutes: 35,
        module_title: 'Module 2: Indexing & Query Optimization',
        content: `### Accelerating Slow Queries\nIndexes prevent full table scans and turn O(N) disk searches into O(log N) tree lookups.`,
        code_snippet: `CREATE INDEX idx_apps ON applications(recruiter_id, status);`,
        practical_application: 'Profile slow queries using EXPLAIN ANALYZE.',
        key_takeaway: 'B-Tree indexes turn linear disk scans into logarithmic lookups.'
      }
    ]
  },
  {
    id: 'course_git_github',
    title: 'Git & GitHub Collaboration',
    tagline: 'Master professional version control, branching strategies, merge conflicts, pull requests, and CI workflows.',
    description: 'The prerequisite collaboration tool for modern software teams. Learn the internal object model of Git (blobs, trees, commits), branching strategies (Git Flow, Trunk-based), rebasing, resolving conflicts, and PR code reviews.',
    category: 'Tools',
    difficulty: 'Beginner',
    estimated_hours: 4,
    skills_covered: ['Git', 'Tools', 'CI/CD', 'Software Engineering'],
    assessment_id: 'assess_git',
    modules: [
      {
        id: 'mod_git_1',
        title: 'Module 1: Git Essentials & Branching',
        lessons: [
          {
            id: 'git_l1',
            title: 'The Three Stages: Working Directory, Staging & Repository',
            order: 1,
            duration_minutes: 20,
            module_title: 'Module 1: Git Essentials & Branching',
            content: `### Understanding the Git Object Model
Git is a content-addressable storage system that tracks snapshots of your files rather than file differences.

The Three States:
1. **Working Directory**: Modified files on disk that are not yet tracked.
2. **Staging Area (Index)**: Files prepared via \`git add\` for the next snapshot.
3. **Repository (.git)**: Committed, immutable snapshots identified by SHA-1/SHA-256 hashes.`,
            code_snippet: `# Essential daily commands
git status
git add src/
git commit -m "feat(auth): implement token refresh rotation"
git push origin feature/auth-rotation`,
            practical_application: 'Initialize a new git repository, commit files with descriptive conventional commit messages, and inspect history using git log --oneline.',
            key_takeaway: 'Git snapshots the entire staging area on commit; atomic commits make bug isolation simple.'
          },
          {
            id: 'git_l2',
            title: 'Branching, Merging & Conflict Resolution',
            order: 2,
            duration_minutes: 25,
            module_title: 'Module 1: Git Essentials & Branching',
            content: `### Safe Concurrent Feature Development
Branches are lightweight movable pointers to commits. When two branches modify the same line of a file, Git halts the merge and prompts the developer to resolve the conflict.

Resolving Conflicts:
1. Open conflicted files and look for conflict markers (\`<<<<<<<\`, \`=======\`, \`>>>>>>>\`).
2. Keep the correct code or merge both intents cleanly.
3. Remove markers, run automated tests, and commit the resolution.`,
            code_snippet: `# Create feature branch, rebase on main, and push
git checkout -b feature/recruiter-demand
# work and commit...
git fetch origin
git rebase origin/main
# If conflict occurs: resolve in editor, then:
git rebase --continue
git push origin feature/recruiter-demand`,
            practical_application: 'Intentionally create a merge conflict between two branches on a README file and resolve it cleanly.',
            key_takeaway: 'Rebasing keeps project git commit history linear and easy to audit.'
          }
        ]
      }
    ],
    lessons: [
      {
        id: 'git_l1',
        title: 'The Three Stages: Working Directory, Staging & Repository',
        order: 1,
        duration_minutes: 20,
        module_title: 'Module 1: Git Essentials & Branching',
        content: `### The Git Model\nGit tracks immutable snapshots across the working directory, staging area, and repository.`,
        code_snippet: `git add . && git commit -m "feat: user profile update"`,
        practical_application: 'Create atomic commits with conventional commit messages.',
        key_takeaway: 'Atomic commits make bug isolation simple.'
      },
      {
        id: 'git_l2',
        title: 'Branching, Merging & Conflict Resolution',
        order: 2,
        duration_minutes: 25,
        module_title: 'Module 1: Git Essentials & Branching',
        content: `### Concurrent Feature Development\nLearn branching, rebasing, and resolving merge conflict markers.`,
        code_snippet: `git checkout -b feature/new-role\ngit rebase origin/main`,
        practical_application: 'Simulate and resolve a git merge conflict.',
        key_takeaway: 'Rebasing keeps commit history linear and auditable.'
      }
    ]
  },
  {
    id: 'course_cloud_fundamentals',
    title: 'Cloud Fundamentals',
    tagline: 'Understand compute, object storage, serverless, networking, and security across AWS, GCP, and Azure.',
    description: 'Learn modern cloud architecture. Understand the difference between IaaS, PaaS, and SaaS, configure Virtual Private Clouds (VPCs), manage Identity & Access Management (IAM) permissions, and deploy containerized services.',
    category: 'Cloud & DevOps',
    difficulty: 'Intermediate',
    estimated_hours: 6,
    skills_covered: ['Cloud & DevOps', 'AWS', 'Docker', 'Linux'],
    assessment_id: 'assess_cloud',
    modules: [
      {
        id: 'mod_cloud_1',
        title: 'Module 1: Core Cloud Infrastructure',
        lessons: [
          {
            id: 'cloud_l1',
            title: 'Compute, Storage & Serverless Paradigms',
            order: 1,
            duration_minutes: 25,
            module_title: 'Module 1: Core Cloud Infrastructure',
            content: `### The Cloud Computing Spectrum
- **IaaS (Infrastructure as a Service)**: Virtual machines (AWS EC2, GCP Compute Engine). You manage OS and runtime.
- **PaaS (Platform as a Service)**: Application runtimes (AWS Elastic Beanstalk, Google Cloud Run). You supply code or containers; the cloud manages scaling and OS patching.
- **Serverless / FaaS**: Event-driven micro-functions (AWS Lambda, Cloud Functions). Pay strictly per millisecond of compute.
- **Object Storage**: High-durability (99.999999999%) unstructured file storage (AWS S3, Google Cloud Storage).`,
            code_snippet: `# AWS S3 bucket file upload using boto3
import boto3

s3_client = boto3.client('s3')

def upload_resume_pdf(file_bytes: bytes, bucket: str, filename: str):
    s3_client.put_object(
        Bucket=bucket,
        Key=f"resumes/{filename}",
        Body=file_bytes,
        ContentType='application/pdf'
    )`,
            practical_application: 'Configure a cloud object storage bucket with private permissions and generate pre-signed upload URLs for candidate resumes.',
            key_takeaway: 'Use managed containers or serverless runtimes to avoid managing underlying virtual machine operating systems.'
          },
          {
            id: 'cloud_l2',
            title: 'IAM, Security & Least Privilege Access',
            order: 2,
            duration_minutes: 30,
            module_title: 'Module 1: Core Cloud Infrastructure',
            content: `### The Principle of Least Privilege
Never use root accounts or assign full administrator access to application services. Each service must have a dedicated IAM Role containing only the exact permissions needed to execute its tasks.`,
            code_snippet: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::careeriq-resumes/*"
    }
  ]
}`,
            practical_application: 'Author a tightly scoped IAM policy allowing a microservice to read from one specific bucket and denying all other actions.',
            key_takeaway: 'Least privilege prevents a compromised service from accessing unauthorized cloud resources.'
          }
        ]
      }
    ],
    lessons: [
      {
        id: 'cloud_l1',
        title: 'Compute, Storage & Serverless Paradigms',
        order: 1,
        duration_minutes: 25,
        module_title: 'Module 1: Core Cloud Infrastructure',
        content: `### Cloud Computing Spectrum\nUnderstand IaaS, PaaS, and serverless compute, and object storage durability.`,
        code_snippet: `s3.put_object(Bucket="careeriq-docs", Key="resume.pdf", Body=data)`,
        practical_application: 'Configure secure cloud storage buckets.',
        key_takeaway: 'Managed container runtimes avoid OS maintenance.'
      },
      {
        id: 'cloud_l2',
        title: 'IAM, Security & Least Privilege Access',
        order: 2,
        duration_minutes: 30,
        module_title: 'Module 1: Core Cloud Infrastructure',
        content: `### Least Privilege Principle\nGrant services only the specific permissions needed to perform their tasks.`,
        code_snippet: `{"Effect": "Allow", "Action": "s3:GetObject", "Resource": "arn:..."}`,
        practical_application: 'Write a least-privilege IAM security policy.',
        key_takeaway: 'Least privilege isolates compromised services.'
      }
    ]
  },
  {
    id: 'course_se_basics',
    title: 'Software Engineering Basics',
    tagline: 'System design principles, clean architecture, SOLID patterns, code review etiquette, and unit testing.',
    description: 'Bridge the gap between writing code and building production software. Learn the SOLID design principles, maintainable software architectures, automated unit testing with test-driven development (TDD), and defensive programming.',
    category: 'Software Engineering',
    difficulty: 'Intermediate',
    estimated_hours: 5,
    skills_covered: ['Software Engineering', 'Problem Solving', 'Clean Code', 'REST APIs'],
    assessment_id: 'assess_se_basics',
    modules: [
      {
        id: 'mod_se_1',
        title: 'Module 1: SOLID Principles & Clean Design',
        lessons: [
          {
            id: 'se_l1',
            title: 'SOLID Principles in Practice',
            order: 1,
            duration_minutes: 30,
            module_title: 'Module 1: SOLID Principles & Clean Design',
            content: `### Architecture for Long-Term Maintainability
The SOLID principles guide object-oriented and modular system design:
- **S - Single Responsibility**: A class or module should have one, and only one, reason to change.
- **O - Open/Closed**: Open for extension, closed for modification.
- **L - Liskov Substitution**: Subtypes must be substitutable for their base types without altering correctness.
- **I - Interface Segregation**: Clients should not be forced to depend upon interfaces they do not use.
- **D - Dependency Inversion**: Depend on abstractions, not concretions.`,
            code_snippet: `# Dependency Inversion Example
from abc import ABC, abstractmethod

class NotificationSender(ABC):
    @abstractmethod
    def send(self, recipient: str, message: str) -> None:
        pass

class EmailNotifier(NotificationSender):
    def send(self, recipient: str, message: str) -> None:
        send_smtp_email(recipient, message)

class UserService:
    # Depends on the abstraction, not the concrete EmailNotifier
    def __init__(self, notifier: NotificationSender):
        self.notifier = notifier
        
    def register(self, email: str):
        # ... logic ...
        self.notifier.send(email, "Welcome to CareerIQ!")`,
            practical_application: 'Refactor a tightly coupled payment processing module using Dependency Inversion to allow easy swapping between Stripe and PayPal.',
            key_takeaway: 'Decoupling concrete implementations allows swapping dependencies and mocking during tests.'
          },
          {
            id: 'se_l2',
            title: 'Automated Testing & Test-Driven Development',
            order: 2,
            duration_minutes: 25,
            module_title: 'Module 1: SOLID Principles & Clean Design',
            content: `### Building Confidence with Test Automation
The Testing Pyramid consists of:
1. **Unit Tests**: Fast, isolated tests verifying single functions (70%).
2. **Integration Tests**: Verify database queries and API interactions (20%).
3. **End-to-End Tests**: Verify complete user flows through the browser (10%).`,
            code_snippet: `# Unit test with pytest
import pytest

def test_resume_parser_extracts_skills():
    raw_text = "Experienced in Python, SQL, and Docker."
    skills = extract_skills_from_text(raw_text)
    assert "Python" in skills
    assert "Docker" in skills
    assert "COBOL" not in skills`,
            practical_application: 'Write a pytest suite with parameterized test cases covering edge cases for an ATS score calculation algorithm.',
            key_takeaway: 'Comprehensive unit tests enable fearless refactoring and catch regressions immediately.'
          }
        ]
      }
    ],
    lessons: [
      {
        id: 'se_l1',
        title: 'SOLID Principles in Practice',
        order: 1,
        duration_minutes: 30,
        module_title: 'Module 1: SOLID Principles & Clean Design',
        content: `### SOLID Principles\nLearn Single Responsibility, Open/Closed, and Dependency Inversion.`,
        code_snippet: `class NotificationSender(ABC):\n    @abstractmethod\n    def send(self, to: str, msg: str): pass`,
        practical_application: 'Refactor coupled modules with dependency inversion.',
        key_takeaway: 'Decoupled abstractions allow easy dependency swapping and testing.'
      },
      {
        id: 'se_l2',
        title: 'Automated Testing & Test-Driven Development',
        order: 2,
        duration_minutes: 25,
        module_title: 'Module 1: SOLID Principles & Clean Design',
        content: `### Testing Pyramid\nUnit tests form the solid base of regression-free production systems.`,
        code_snippet: `def test_parser():\n    assert "Python" in extract_skills("Python dev")`,
        practical_application: 'Write parameterized unit tests for ATS scoring.',
        key_takeaway: 'Unit tests catch regressions and enable fearless refactoring.'
      }
    ]
  },
  {
    id: 'course_interview_prep',
    title: 'Technical Interview Preparation',
    tagline: 'Ace technical coding interviews, system design rounds, and behavioral questions with structured frameworks.',
    description: 'The complete guide to landing top engineering offers. Master live coding problem deconstruction, the STAR method for behavioral interviews, system design scalability frameworks, and negotiating competitive compensation.',
    category: 'Career Prep',
    difficulty: 'Intermediate',
    estimated_hours: 5,
    skills_covered: ['Technical Communication', 'Problem Solving', 'Data Structures & Algorithms', 'System Design'],
    assessment_id: 'assess_interview_prep',
    modules: [
      {
        id: 'mod_int_1',
        title: 'Module 1: Technical Coding & System Design Strategies',
        lessons: [
          {
            id: 'int_l1',
            title: 'The 5-Step Coding Interview Framework',
            order: 1,
            duration_minutes: 25,
            module_title: 'Module 1: Technical Coding & System Design Strategies',
            content: `### How to Communicate While Solving Coding Challenges
Interviewers evaluate your thought process, communication, and systematic reasoning more than memorized solutions.

The 5-Step Strategy:
1. **Clarify Constraints**: Ask about input ranges, empty inputs, duplicates, and memory constraints.
2. **State Edge Cases**: Null, single element, negative numbers, large inputs.
3. **Propose Brute Force & State Big-O**: Mention the obvious O(N²) solution to establish a baseline.
4. **Optimize**: Discuss hash maps, two pointers, or sorting to reach O(N) or O(N log N).
5. **Code & Dry Run**: Walk through code with a concrete sample before declaring you are finished.`,
            code_snippet: `# Template for clarifying constraints with an interviewer
"""
Clarifying Questions:
1. Can the input list contain negative numbers?
2. Are duplicates allowed in the return indices?
3. What is the expected behavior if no valid pair exists?
4. What is the maximum size of N (memory limits)?
"""`,
            practical_application: 'Practice verbalizing your thought process aloud while solving a medium LeetCode problem without writing code for the first 5 minutes.',
            key_takeaway: 'Clarifying constraints upfront prevents solving the wrong problem.'
          },
          {
            id: 'int_l2',
            title: 'Behavioral Interviews: The STAR Method',
            order: 2,
            duration_minutes: 25,
            module_title: 'Module 1: Technical Coding & System Design Strategies',
            content: `### Structuring Compelling Behavioral Answers
Engineers are hired for technical ability and retained for culture, reliability, and conflict resolution.

The STAR Framework:
- **S - Situation**: Set the scene and context in 2 sentences.
- **T - Task**: What specific responsibility or challenge was assigned to you?
- **A - Action**: What specific actions did YOU take? (Use "I", not "We").
- **R - Result**: Quantifiable outcome (e.g. "Reduced API latency by 45%", "Delivered project 1 week ahead of sprint").`,
            code_snippet: `# STAR Answer Blueprint
Situation: "During our high-traffic product launch, our API latency spiked to 2.4 seconds."
Task: "I was tasked with identifying the bottleneck and restoring sub-300ms response times."
Action: "I profiled slow queries with EXPLAIN ANALYZE, added compound B-Tree indexes on the user_id column, and integrated a Redis caching layer."
Result: "Latency dropped to 85ms, eliminating timeouts and supporting 10,000 concurrent active users."`,
            practical_application: 'Write out three polished STAR stories for: (1) A time you solved a tough technical bug, (2) A time you disagreed with a colleague, and (3) A proud achievement.',
            key_takeaway: 'Quantified results in the STAR method prove your concrete business and technical impact.'
          }
        ]
      }
    ],
    lessons: [
      {
        id: 'int_l1',
        title: 'The 5-Step Coding Interview Framework',
        order: 1,
        duration_minutes: 25,
        module_title: 'Module 1: Technical Coding & System Design Strategies',
        content: `### Interview Communication\nMaster the 5-step framework: Clarify constraints, identify edge cases, state brute force, optimize, and dry run.`,
        code_snippet: `// Clarify constraints before typing a single line of code!`,
        practical_application: 'Practice verbalizing problem solving aloud.',
        key_takeaway: 'Clarifying constraints upfront prevents solving the wrong problem.'
      },
      {
        id: 'int_l2',
        title: 'Behavioral Interviews: The STAR Method',
        order: 2,
        duration_minutes: 25,
        module_title: 'Module 1: Technical Coding & System Design Strategies',
        content: `### The STAR Method\nStructure answers into Situation, Task, Action, and Quantifiable Result.`,
        code_snippet: `// Situation -> Task -> Action -> Quantified Result`,
        practical_application: 'Write out three polished STAR interview stories.',
        key_takeaway: 'Quantified results prove your technical and business impact.'
      }
    ]
  },
  {
    id: 'course_docker',
    title: 'Docker Fundamentals for Modern Engineering',
    tagline: 'Containerize Python, Node.js, and services for reliable cloud deployments.',
    description: 'Learn container virtualization from scratch. Master writing clean Dockerfiles, orchestrating multi-container services with docker-compose, layer caching, and minimizing production image size.',
    category: 'Cloud & DevOps',
    difficulty: 'Beginner',
    estimated_hours: 4,
    skills_covered: ['Docker', 'Linux', 'Containerization', 'DevOps'],
    assessment_id: 'assess_docker',
    modules: [
      {
        id: 'mod_dock_1',
        title: 'Module 1: Containers & Dockerfiles',
        lessons: [
          {
            id: 'docker_l1',
            title: 'Containerization vs Virtual Machines',
            order: 1,
            duration_minutes: 20,
            module_title: 'Module 1: Containers & Dockerfiles',
            content: `### Why Docker Matters\nContainers share the host OS kernel and isolate user space using Linux namespaces and cgroups, making them lightweight and reproducible.`,
            code_snippet: `docker version\ndocker system info`,
            practical_application: 'Install Docker and inspect system resource consumption.',
            key_takeaway: 'Containers isolate processes at the kernel level rather than emulating full hardware.'
          },
          {
            id: 'docker_l2',
            title: 'Writing Production Dockerfiles',
            order: 2,
            duration_minutes: 30,
            module_title: 'Module 1: Containers & Dockerfiles',
            content: `### High-Performance Dockerfiles\nOrder instructions from least frequently changed to most frequently changed to optimize Docker build cache.`,
            code_snippet: `FROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nCMD ["python", "main.py"]`,
            practical_application: 'Containerize a web service with a non-root user.',
            key_takeaway: 'Layer caching makes subsequent container builds instant.'
          }
        ]
      }
    ],
    lessons: [
      {
        id: 'docker_l1',
        title: 'Containerization vs Virtual Machines',
        order: 1,
        duration_minutes: 20,
        module_title: 'Module 1: Containers & Dockerfiles',
        content: `### Why Docker Matters\nContainers share the host OS kernel and isolate user space.`,
        code_snippet: `docker version`,
        practical_application: 'Install Docker and inspect system info.',
        key_takeaway: 'Containers isolate processes at the kernel level.'
      },
      {
        id: 'docker_l2',
        title: 'Writing Production Dockerfiles',
        order: 2,
        duration_minutes: 30,
        module_title: 'Module 1: Containers & Dockerfiles',
        content: `### Production Dockerfiles\nOrder instructions to leverage layer caching.`,
        code_snippet: `FROM python:3.11-slim\nWORKDIR /app`,
        practical_application: 'Containerize a web service with a non-root user.',
        key_takeaway: 'Layer caching makes subsequent container builds instant.'
      }
    ]
  },
  {
    id: 'course_fastapi',
    title: 'FastAPI & REST Model Serving',
    tagline: 'Build asynchronous, production-ready REST APIs with automatic OpenAPI docs and Pydantic validation.',
    description: 'Learn modern Python backend engineering with FastAPI. Master async request handling, dependency injection, CORS configuration, Pydantic type validation, and high-throughput endpoint design.',
    category: 'Web & APIs',
    difficulty: 'Intermediate',
    estimated_hours: 5,
    skills_covered: ['FastAPI', 'Python', 'REST APIs', 'Web Frameworks'],
    assessment_id: 'assess_fastapi',
    modules: [
      {
        id: 'mod_fa_1',
        title: 'Module 1: Asynchronous Endpoints & Pydantic',
        lessons: [
          {
            id: 'fa_l1',
            title: 'Modern Async Python & FastAPI Architecture',
            order: 1,
            duration_minutes: 25,
            module_title: 'Module 1: Asynchronous Endpoints & Pydantic',
            content: `### High-Throughput Asynchronous APIs\nFastAPI is built on Starlette and Pydantic, providing blazing performance comparable to NodeJS and Go.`,
            code_snippet: `from fastapi import FastAPI\napp = FastAPI()\n\n@app.get('/api/health')\nasync def health():\n    return {'status': 'healthy'}`,
            practical_application: 'Build an async health check and metrics endpoint.',
            key_takeaway: 'Async event loops allow non-blocking I/O operations under heavy concurrent loads.'
          }
        ]
      }
    ],
    lessons: [
      {
        id: 'fa_l1',
        title: 'Modern Async Python & FastAPI Architecture',
        order: 1,
        duration_minutes: 25,
        module_title: 'Module 1: Asynchronous Endpoints & Pydantic',
        content: `### High-Throughput Asynchronous APIs\nFastAPI leverages async event loops for high-concurrency request serving.`,
        code_snippet: `from fastapi import FastAPI\napp = FastAPI()`,
        practical_application: 'Build an async endpoint.',
        key_takeaway: 'Async event loops handle non-blocking I/O.'
      }
    ]
  }
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'assess_prog_fundamentals',
    course_id: 'course_prog_fundamentals',
    target_skill: 'Programming',
    title: 'Programming Fundamentals Skill Assessment',
    duration_minutes: 10,
    passing_score: 70,
    questions: [
      {
        id: 'q_pf1',
        question: 'Which of the following is a characteristic of a "Pure Function"?',
        type: 'mcq',
        options: [
          'It always prints output directly to the terminal.',
          'It produces the exact same return value for the same arguments with zero external side effects.',
          'It can only be executed on multi-core processors.',
          'It mutates global variables directly.'
        ],
        correct_index: 1,
        explanation: 'Pure functions depend solely on their parameters and produce no side effects, making them predictable, testable, and cacheable.'
      },
      {
        id: 'q_pf2',
        question: 'Why is the "Guard Clause" pattern preferred over deeply nested if-else blocks?',
        type: 'scenario',
        options: [
          'It makes the code execute 100x faster in all compilers.',
          'It returns early on invalid conditions, keeping the happy path flat and readable.',
          'It eliminates the need for data types.',
          'It is required by the Python interpreter.'
        ],
        correct_index: 1,
        explanation: 'Guard clauses handle error cases or edge conditions early, avoiding the "arrow anti-pattern" of deeply nested code.'
      },
      {
        id: 'q_pf3',
        question: 'What is the danger of using a bare catch/except block that catches all exceptions without logging?',
        type: 'scenario',
        options: [
          'It makes variable names longer.',
          'It silences critical runtime crashes and bugs, making root-cause debugging almost impossible.',
          'It corrupts git repositories.',
          'There is no danger; it is standard production practice.'
        ],
        correct_index: 1,
        explanation: 'Silencing exceptions without logging hides bugs, corrupts data flows, and makes production incident investigation impossible.'
      }
    ]
  },
  {
    id: 'assess_dsa',
    course_id: 'course_dsa',
    target_skill: 'Data Structures & Algorithms',
    title: 'Data Structures & Algorithms Assessment',
    duration_minutes: 15,
    passing_score: 70,
    questions: [
      {
        id: 'q_dsa1',
        question: 'What is the average time complexity of checking if a key exists in a Hash Table?',
        type: 'mcq',
        options: ['O(N)', 'O(log N)', 'O(1)', 'O(N²)'],
        correct_index: 2,
        explanation: 'Hash tables calculate a bucket index via a hash function, resulting in O(1) constant time average lookup.'
      },
      {
        id: 'q_dsa2',
        question: 'Which traversal algorithm is optimal for finding the shortest path in an unweighted graph?',
        type: 'mcq',
        options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'In-Order Traversal', 'Post-Order Traversal'],
        correct_index: 1,
        explanation: 'BFS explores neighbor nodes level-by-level, ensuring the first time the target node is visited represents the shortest path in an unweighted graph.'
      },
      {
        id: 'q_dsa3',
        question: 'If an algorithm contains two nested loops each running from 0 to N, what is its asymptotic time complexity?',
        type: 'mcq',
        options: ['O(N)', 'O(N log N)', 'O(N²)', 'O(2^N)'],
        correct_index: 2,
        explanation: 'Nested loops where each iteration of the outer loop executes N times in the inner loop yield N * N = O(N²) quadratic time.'
      }
    ]
  },
  {
    id: 'assess_web_dev',
    course_id: 'course_web_dev',
    target_skill: 'Web & APIs',
    title: 'Web Development & REST Architecture Assessment',
    duration_minutes: 10,
    passing_score: 70,
    questions: [
      {
        id: 'q_web1',
        question: 'Which HTTP status code signifies that a client request lacked valid authentication credentials?',
        type: 'mcq',
        options: ['200 OK', '401 Unauthorized', '404 Not Found', '500 Internal Error'],
        correct_index: 1,
        explanation: 'HTTP 401 Unauthorized indicates that the request requires user authentication or the provided credentials were invalid.'
      },
      {
        id: 'q_web2',
        question: 'In React, why must state never be mutated directly (e.g. state.count = 5)?',
        type: 'scenario',
        options: [
          'Because JavaScript will throw a syntax compilation error.',
          'Direct mutation bypasses React reconciliation, meaning the component will not re-render with updated values.',
          'It deletes the component from memory.',
          'React does not use state.'
        ],
        correct_index: 1,
        explanation: 'React relies on state setter functions to trigger its reconciliation algorithm and update the DOM.'
      }
    ]
  },
  {
    id: 'assess_sql',
    course_id: 'course_sql_databases',
    target_skill: 'SQL',
    title: 'SQL & Database Architecture Assessment',
    duration_minutes: 10,
    passing_score: 70,
    questions: [
      {
        id: 'q_sql1',
        question: 'What is the primary difference between the WHERE clause and the HAVING clause in SQL?',
        type: 'mcq',
        options: [
          'WHERE is only used for numbers; HAVING is for text.',
          'WHERE filters individual rows before aggregation; HAVING filters aggregated groups after GROUP BY.',
          'WHERE is deprecated in modern SQL.',
          'They are completely identical and interchangeable.'
        ],
        correct_index: 1,
        explanation: 'WHERE filters rows prior to the GROUP BY operation; HAVING filters the resulting aggregated groups.'
      },
      {
        id: 'q_sql2',
        question: 'How does a B-Tree index accelerate SQL queries on large tables?',
        type: 'scenario',
        options: [
          'By compressing all table data into a single text file.',
          'By transforming full sequential disk scans (O(N)) into logarithmic tree traversals (O(log N)).',
          'By disabling write operations on the database.',
          'By deleting duplicate rows automatically.'
        ],
        correct_index: 1,
        explanation: 'B-Tree indexes maintain a balanced tree of pointers sorted by column value, allowing the storage engine to pinpoint matching rows in O(log N) operations.'
      }
    ]
  },
  {
    id: 'assess_git',
    course_id: 'course_git_github',
    target_skill: 'Git',
    title: 'Git Version Control Assessment',
    duration_minutes: 10,
    passing_score: 70,
    questions: [
      {
        id: 'q_git1',
        question: 'What command stages modified files in preparation for a commit?',
        type: 'mcq',
        options: ['git push', 'git add', 'git checkout', 'git stash'],
        correct_index: 1,
        explanation: 'git add stages files from the working tree into the index ready for the next commit snapshot.'
      }
    ]
  },
  {
    id: 'assess_cloud',
    course_id: 'course_cloud_fundamentals',
    target_skill: 'Cloud Fundamentals',
    title: 'Cloud Architecture & IAM Assessment',
    duration_minutes: 10,
    passing_score: 70,
    questions: [
      {
        id: 'q_c1',
        question: 'What is the core directive of the Principle of Least Privilege in cloud IAM?',
        type: 'mcq',
        options: [
          'Give all developers full administrator access to avoid deployment delays.',
          'Grant each user or service only the precise permissions necessary to execute its specific function.',
          'Only run applications on on-premise hardware.',
          'Disable password authentication completely.'
        ],
        correct_index: 1,
        explanation: 'The Principle of Least Privilege restricts access rights to the minimum required for normal operation.'
      }
    ]
  },
  {
    id: 'assess_se_basics',
    course_id: 'course_se_basics',
    target_skill: 'Software Engineering',
    title: 'Software Engineering & SOLID Principles Assessment',
    duration_minutes: 10,
    passing_score: 70,
    questions: [
      {
        id: 'q_se1',
        question: 'According to the Single Responsibility Principle, a class or module should have:',
        type: 'mcq',
        options: [
          'As many features as possible to avoid creating new files.',
          'One, and only one, reason to change.',
          'Zero dependencies on other classes.',
          'At least 1,000 lines of code.'
        ],
        correct_index: 1,
        explanation: 'The Single Responsibility Principle dictates that a software component should have exactly one reason to change, fulfilling a single conceptual purpose.'
      }
    ]
  },
  {
    id: 'assess_interview_prep',
    course_id: 'course_interview_prep',
    target_skill: 'Technical Communication',
    title: 'Technical Interviewing & STAR Method Assessment',
    duration_minutes: 10,
    passing_score: 70,
    questions: [
      {
        id: 'q_ip1',
        question: 'In the STAR framework for behavioral interviews, what does the "R" represent?',
        type: 'mcq',
        options: ['Repetition', 'Result (quantifiable outcome)', 'Requirement', 'Review'],
        correct_index: 1,
        explanation: 'The R stands for Result, ideally expressed with concrete business or performance metrics demonstrating impact.'
      }
    ]
  },
  {
    id: 'assess_docker',
    course_id: 'course_docker',
    target_skill: 'Docker',
    title: 'Docker & Containerization Assessment',
    duration_minutes: 10,
    passing_score: 70,
    questions: [
      {
        id: 'q_d1',
        question: 'Why should dependency files (like requirements.txt or package.json) be copied BEFORE application source code in a Dockerfile?',
        type: 'scenario',
        options: [
          'Docker requires it alphabetically.',
          'To leverage Docker layer caching so dependencies are not reinstalled on every minor code change.',
          'It makes the final image run in 64-bit mode.',
          'To prevent security vulnerabilities.'
        ],
        correct_index: 1,
        explanation: 'Docker caches layers sequentially. If dependency files do not change, Docker reuses the cached layer, saving minutes on every build.'
      }
    ]
  },
  {
    id: 'assess_fastapi',
    course_id: 'course_fastapi',
    target_skill: 'FastAPI',
    title: 'FastAPI Asynchronous Engineering Assessment',
    duration_minutes: 10,
    passing_score: 70,
    questions: [
      {
        id: 'q_fa1',
        question: 'What library powers request validation and automated schema serialization in FastAPI?',
        type: 'mcq',
        options: ['Django Models', 'Pydantic', 'SQLAlchemy', 'NumPy'],
        correct_index: 1,
        explanation: 'FastAPI utilizes Pydantic type annotations to automatically parse, validate, and document incoming request payloads.'
      }
    ]
  }
];

export const INITIAL_RECRUITER_JOBS: RecruiterJob[] = [
  {
    id: 'job_rec_1',
    recruiter_id: 'recruiter_system',
    title: 'Associate Software Engineer',
    company: 'Apex Systems',
    department: 'Core Platform',
    location: 'San Francisco, CA / Hybrid',
    work_type: 'Hybrid',
    experience_level: 'Fresher / Junior (0-2 years)',
    salary_range: '$85,000 - $115,000',
    required_skills: ['Data Structures & Algorithms', 'Python', 'SQL', 'Git', 'REST APIs'],
    preferred_skills: ['Docker', 'PostgreSQL', 'Unit Testing'],
    description: 'Join our core platform engineering team to build scalable services, design clean RESTful APIs, and contribute to production database optimizations.',
    status: 'Active',
    applicants_count: 4,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'job_rec_2',
    recruiter_id: 'recruiter_system',
    title: 'Frontend Developer',
    company: 'SaaSify Web Technologies',
    department: 'Web Applications',
    location: 'Remote',
    work_type: 'Remote',
    experience_level: 'Junior (1-3 years)',
    salary_range: '$80,000 - $110,000',
    required_skills: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3 / Tailwind'],
    preferred_skills: ['Next.js', 'Web Performance', 'REST APIs'],
    description: 'We are seeking a Frontend Developer to build accessible, responsive user interfaces in React and TypeScript with attention to micro-interactions and performance.',
    status: 'Active',
    applicants_count: 6,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 'job_rec_3',
    recruiter_id: 'recruiter_system',
    title: 'Junior Data Scientist',
    company: 'OmniData Insights',
    department: 'Analytics & Modeling',
    location: 'New York, NY / Hybrid',
    work_type: 'Hybrid',
    experience_level: 'Junior (0-2 years)',
    salary_range: '$90,000 - $120,000',
    required_skills: ['Python', 'SQL', 'Data Science', 'Pandas', 'Scikit-Learn'],
    preferred_skills: ['Power BI', 'Statistics', 'Docker'],
    description: 'Extract actionable business insights, build predictive regression and classification models, and conduct rigorous statistical hypothesis testing on enterprise data.',
    status: 'Active',
    applicants_count: 5,
    created_at: new Date(Date.now() - 3600000 * 72).toISOString()
  },
  {
    id: 'job_rec_4',
    recruiter_id: 'recruiter_system',
    title: 'Cloud & DevOps Associate',
    company: 'CloudWave Global',
    department: 'Infrastructure',
    location: 'Austin, TX / Remote',
    work_type: 'Remote',
    experience_level: 'Junior (0-2 years)',
    salary_range: '$90,000 - $118,000',
    required_skills: ['Docker', 'Linux', 'AWS', 'CI/CD', 'Git'],
    preferred_skills: ['Kubernetes', 'Terraform', 'Python'],
    description: 'Help automate continuous integration deployment pipelines, containerize microservices with Docker, and maintain reliable cloud infrastructure across AWS environments.',
    status: 'Active',
    applicants_count: 3,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'job_rec_5',
    recruiter_id: 'recruiter_system',
    title: 'Associate AI/ML Engineer',
    company: 'NeuralFlow Technologies',
    department: 'Machine Learning Engineering',
    location: 'San Francisco, CA / Remote',
    work_type: 'Hybrid',
    experience_level: 'Fresher / Junior (0-2 years)',
    salary_range: '$95,000 - $125,000',
    required_skills: ['Python', 'Machine Learning', 'FastAPI', 'Docker', 'SQL'],
    preferred_skills: ['PyTorch', 'Retrieval-Augmented Generation (RAG)', 'MLflow'],
    description: 'Build and deploy real-time model inference microservices. Containerize models with Docker, write automated unit tests, and optimize latency.',
    status: 'Active',
    applicants_count: 3,
    created_at: new Date(Date.now() - 3600000 * 96).toISOString()
  }
];
