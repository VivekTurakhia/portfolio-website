/* eslint-disable react-refresh/only-export-components */
/**
 * The IDE's "filesystem": each role/project is a file whose body is written as
 * commented code. Content is static, so syntax highlighting is authored
 * directly as token <span>s — zero runtime parsing, no highlighter dependency.
 *
 * Token classes (styles.css): tk-cm comment · tk-kw keyword · tk-str string ·
 * tk-fn function · tk-type type · tk-num number · tk-pn punctuation
 */

const C = ({ children }) => <span className="tk-cm">{children}</span>
const K = ({ children }) => <span className="tk-kw">{children}</span>
const S = ({ children }) => <span className="tk-str">{children}</span>
const F = ({ children }) => <span className="tk-fn">{children}</span>
const T = ({ children }) => <span className="tk-type">{children}</span>
const N = ({ children }) => <span className="tk-num">{children}</span>
const P = ({ children }) => <span className="tk-pn">{children}</span>

export const ideFiles = [
  {
    id: 'readme',
    name: 'README.md',
    folder: null,
    lang: 'Markdown',
    dot: '#519aba',
    run: {
      cmd: 'glow README.md',
      out: 'Vivek Turakhia — CE @ UIUC ’27 (3.78) · builds end-to-end, ships fast',
    },
    lines: [
      <><P># </P><F>Vivek Turakhia</F></>,
      <></>,
      <>Computer Engineering @ UIUC · <N>2027</N> · GPA <N>3.78</N></>,
      <></>,
      <><P>## </P><F>currently</F></>,
      <><P>- </P>incoming AI/ML intern @ <S>LinkedIn</S> (Core AI)</>,
      <><P>- </P>full-stack engineer @ <S>Hack4Impact UIUC</S></>,
      <></>,
      <><P>## </P><F>coursework</F></>,
      <>distributed systems · networks · operating systems · ML ·</>,
      <>databases · algorithms &amp; computational models</>,
      <></>,
      <><P>## </P><F>this room</F></>,
      <>open the files on the left — each role is a file, each file runs.</>,
    ],
  },

  {
    id: 'linkedin-core-ai',
    name: 'linkedin-core-ai.ts',
    folder: 'experience',
    lang: 'TypeScript',
    dot: '#3178c6',
    run: {
      cmd: 'tsx experience/linkedin-core-ai.ts',
      out: 'scheduled: AI/ML engineering intern · Core AI · NYC · summer 2026 (exit 0)',
    },
    lines: [
      <C>/**</C>,
      <C> * LinkedIn — AI/ML Engineering Intern (incoming)</C>,
      <C> * Core AI · New York, NY · May – Aug 2026</C>,
      <C> */</C>,
      <></>,
      <><C>// status</C></>,
      <><K>const</K> offer: <T>Status</T> = <S>'signed'</S><P>;</P></>,
      <><K>const</K> team = <S>'Core AI'</S><P>;</P></>,
      <></>,
      <><C>// the plan: ship ML systems at the scale of 1B+ members</C></>,
      <><K>export default async function</K> <F>summer2026</F><P>() {'{'}</P></>,
      <>{'  '}<K>return</K> <F>buildThingsThatLearn</F><P>();</P></>,
      <><P>{'}'}</P></>,
    ],
  },

  {
    id: 'linkedin-ads',
    name: 'linkedin-primetime-ads.java',
    folder: 'experience',
    lang: 'Java',
    dot: '#e76f00',
    run: {
      cmd: 'javac && java PrimetimeAds',
      out: '✓ shipped: real-time ad delivery pipeline · +15% ad spend (exit 0)',
    },
    lines: [
      <C>/**</C>,
      <C> * LinkedIn — Software Engineering Intern</C>,
      <C> * Primetime Ads · New York, NY · May – Aug 2025</C>,
      <C> *</C>,
      <C> * impact:</C>,
      <C> *   - engineered high-throughput ad delivery pipeline enabling</C>,
      <C> *     real-time data propagation across distributed services</C>,
      <C> *     → +15% ad spend</C>,
      <C> *   - extended the Play Framework API with new GraphQL schemas,</C>,
      <C> *     content-type enums and JSON scaffolding</C>,
      <C> *   - built end-to-end data flow: ingestion → serialization →</C>,
      <C> *     asset resolution → localized delivery</C>,
      <C> */</C>,
      <></>,
      <><K>public final class</K> <T>PrimetimeAds</T> <P>{'{'}</P></>,
      <>{'  '}<K>static final</K> <T>String</T>[] STACK = <P>{'{'}</P> <S>"Java"</S>, <S>"Play"</S>, <S>"GraphQL"</S>, <S>"Rest.li"</S> <P>{'}'};</P></>,
      <><P>{'}'}</P></>,
    ],
  },

  {
    id: 'capitalone',
    name: 'capitalone-disputes.go',
    folder: 'experience',
    lang: 'Go',
    dot: '#00add8',
    run: {
      cmd: 'go run experience/capitalone-disputes.go',
      out: '✓ shipped: dynamic question-flow engine · −40% editing time · 10K+ updates/day (exit 0)',
    },
    lines: [
      <><C>// Capital One — Software Engineering Intern</C></>,
      <><C>// Card Disputes · McLean, VA · Jun – Aug 2024</C></>,
      <><C>//</C></>,
      <><C>// impact:</C></>,
      <><C>//   - Golang REST API + PostgreSQL for the credit-card dispute</C></>,
      <><C>//     service; AWS Lambda handling 10K+ real-time updates daily</C></>,
      <><C>//   - dynamic question-flow engine for deeply nested JSON and</C></>,
      <><C>//     conditional branching → question editing time −40%</C></>,
      <><C>//   - recursive validation layer enforcing schema integrity</C></>,
      <><C>//     across multi-level question hierarchies</C></>,
      <></>,
      <><K>package</K> disputes</>,
      <></>,
      <><K>var</K> stack = []<T>string</T><P>{'{'}</P><S>"Go"</S>, <S>"PostgreSQL"</S>, <S>"AWS Lambda"</S><P>{'}'}</P></>,
      <></>,
      <><K>func</K> <F>resolve</F><P>(</P>q <T>*QuestionFlow</T><P>)</P> <T>error</T> <P>{'{'}</P> <K>return</K> q.<F>Traverse</F><P>()</P> <P>{'}'}</P></>,
    ],
  },

  {
    id: 'hack4impact',
    name: 'hack4impact.tsx',
    folder: 'experience',
    lang: 'TypeScript JSX',
    dot: '#61dafb',
    run: {
      cmd: 'pnpm run hack4impact',
      out: '✓ ongoing: 3+ teams led · full-stack apps shipped for non-profits (exit 0)',
    },
    lines: [
      <C>/**</C>,
      <C> * Hack4Impact UIUC — Full-Stack Engineer</C>,
      <C> * Jan 2024 – present</C>,
      <C> *</C>,
      <C> * impact:</C>,
      <C> *   - led 3+ teams of 4–5 devs and 1–2 designers building</C>,
      <C> *     software for non-profits, end to end</C>,
      <C> *   - ~15 hrs/week on full-stack architecture chosen per</C>,
      <C> *     client: scalability, performance, fit</C>,
      <C> *   - CI, code review, load + e2e testing as a default</C>,
      <C> */</C>,
      <></>,
      <><K>export function</K> <F>NonProfitApp</F><P>() {'{'}</P></>,
      <>{'  '}<K>return</K> <P>&lt;</P><T>Impact</T> <F>scope</F>=<S>"end-to-end"</S> <F>users</F>=<S>"real"</S> <P>/&gt;;</P></>,
      <><P>{'}'}</P></>,
    ],
  },

  {
    id: 'illinix',
    name: 'illinix-os.c',
    folder: 'projects',
    lang: 'C',
    dot: '#a8b9cc',
    run: {
      cmd: 'qemu-system-riscv64 -kernel illinix.elf',
      out: '[ OK ] illinix 391 booted · 64-bit RISC-V · KTFS mounted · shell ready (exit 0)',
    },
    lines: [
      <><C>/* Illinix 391 — a Unix-like OS, from scratch</C></>,
      <><C> * C · RISC-V (Sv39) · QEMU</C></>,
      <><C> *</C></>,
      <><C> * - virtual memory, ELF loading, syscalls, process mgmt</C></>,
      <><C> * - KTFS: ext2-like filesystem w/ journaling + persistence</C></>,
      <><C> * - keyboard/timer/display drivers, I/O redirection</C></>,
      <><C> * - preemptive round-robin multitasking, pipes for IPC</C></>,
      <><C> */</C></>,
      <></>,
      <><K>void</K> <F>kmain</F><P>(</P><K>void</K><P>) {'{'}</P></>,
      <>{'  '}<F>vm_init</F><P>();</P> <F>ktfs_mount</F><P>(</P><S>"/dev/vda"</S><P>);</P> <F>sched_start</F><P>();</P></>,
      <>{'  '}<C>/* never returns */</C></>,
      <><P>{'}'}</P></>,
    ],
  },

  {
    id: 'dance-analyzer',
    name: 'dance-analyzer.py',
    folder: 'projects',
    lang: 'Python',
    dot: '#3572a5',
    run: {
      cmd: 'python projects/dance-analyzer.py --video user.mp4',
      out: '✓ pose aligned (DTW) · critique generated via Claude · report saved to s3 (exit 0)',
    },
    lines: [
      <><C># ML-Powered Video Performance Analyzer</C></>,
      <><C># Python · MediaPipe · FastAPI · Celery · Redis · S3 · Claude API</C></>,
      <><C>#</C></>,
      <><C># - compares dance videos against a reference performance and</C></>,
      <><C>#   returns timestamped critiques: form, timing, choreography</C></>,
      <><C># - pose estimation + DTW for speed-independent alignment,</C></>,
      <><C>#   per-segment joint-angle deviation scoring</C></>,
      <><C># - multimodal LLM critiques grounded in the quantitative analysis</C></>,
      <><C># - async jobs: FastAPI + Celery + Redis; artifacts on S3</C></>,
      <></>,
      <><K>from</K> pipeline <K>import</K> estimate_pose, align, critique</>,
      <></>,
      <><K>def</K> <F>analyze</F><P>(</P>video<P>):</P></>,
      <>{'    '}<K>return</K> <F>critique</F><P>(</P><F>align</F><P>(</P><F>estimate_pose</F><P>(</P>video<P>)))</P></>,
    ],
  },
]

export const folders = ['experience', 'projects']
export const DEFAULT_FILE_ID = 'readme'
export const fileById = (id) => ideFiles.find((f) => f.id === id)
