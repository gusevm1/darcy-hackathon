import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const tools = [
  {
    category: 'Clients',
    items: [
      {
        name: 'list_clients',
        description: 'List all clients with pagination (id, company, status, pathway)',
      },
      {
        name: 'get_client',
        description: 'Get full client detail — profile, compliance, checklist, flags',
      },
      {
        name: 'create_client',
        description: 'Create a new client with optional initial company data',
      },
      {
        name: 'update_client',
        description: 'Update any client fields (company info, compliance readiness, capital)',
      },
      {
        name: 'update_checklist_item',
        description: 'Update a checklist item status (not_started, in_progress, complete, blocked)',
      },
    ],
  },
  {
    category: 'Knowledge Base',
    items: [
      {
        name: 'search_knowledge_base',
        description: 'Hybrid semantic + lexical search across Swiss regulatory documents',
      },
      {
        name: 'list_knowledge_base_documents',
        description: 'List all indexed regulatory documents (AMLA, FINMA, SRO, MiCAR, etc.)',
      },
      {
        name: 'delete_knowledge_base_document',
        description: 'Remove a document from the knowledge base by ID',
      },
    ],
  },
  {
    category: 'Compliance',
    items: [
      {
        name: 'analyze_gaps',
        description:
          'Run gap analysis — readiness score, identified gaps, critical blockers, next steps',
      },
      {
        name: 'get_next_steps',
        description:
          'Get prioritised action items with estimated days, dependencies, and regulatory refs',
      },
    ],
  },
  {
    category: 'AI Consultant',
    items: [
      {
        name: 'consult',
        description:
          'Chat with the Claude-powered compliance consultant (optional client context)',
      },
      {
        name: 'start_onboarding',
        description: 'Start a new client onboarding session and get a client_id',
      },
      {
        name: 'onboard_chat',
        description: 'Continue the guided intake conversation to determine licensing pathway',
      },
    ],
  },
  {
    category: 'System',
    items: [
      {
        name: 'health_check',
        description: 'Check if the Darcy API backend is healthy and responding',
      },
    ],
  },
]

const mcpJsonConfig = `{
  "mcpServers": {
    "darcy": {
      "command": "python",
      "args": ["path/to/mcp-server/server.py"],
      "env": {
        "DARCY_API_URL": "http://localhost:8000"
      }
    }
  }
}`

const installSteps = [
  {
    step: '1',
    title: 'Clone the repository',
    code: 'git clone https://github.com/gusevm1/darcy-hackathon.git\ncd darcy-hackathon',
  },
  {
    step: '2',
    title: 'Set up the MCP server environment',
    code: 'cd mcp-server\npython3 -m venv .venv\n.venv/bin/pip install "mcp[cli]" httpx',
  },
  {
    step: '3',
    title: 'Start the backend (if not already running)',
    code: 'cd .. && docker compose up -d --build',
  },
  {
    step: '4',
    title: 'Test the MCP server',
    code: 'DARCY_API_URL=http://localhost:8000 .venv/bin/python server.py',
  },
]

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      {title && (
        <div className="bg-muted/50 border-b px-4 py-2">
          <span className="text-muted-foreground font-mono text-xs">{title}</span>
        </div>
      )}
      <pre className="overflow-x-auto bg-zinc-950 p-4 text-sm leading-relaxed text-zinc-100">
        <code>{children}</code>
      </pre>
    </div>
  )
}

export default function McpPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">MCP Server</h1>
          <Badge variant="secondary" className="font-mono text-xs">
            v1.0
          </Badge>
        </div>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Connect any MCP-compatible AI client — Claude Code, Claude Desktop, Cursor, or your own
          agent — directly to the Darcy compliance platform. Manage clients, search Swiss
          regulations, run gap analyses, and consult the AI assistant, all through tool calls.
        </p>
      </div>

      <Separator className="mb-8" />

      {/* Quick Start */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Quick Start</h2>
        <div className="space-y-4">
          {installSteps.map((s) => (
            <div key={s.step}>
              <p className="mb-2 text-sm font-medium">
                <span className="bg-primary text-primary-foreground mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs">
                  {s.step}
                </span>
                {s.title}
              </p>
              <CodeBlock>{s.code}</CodeBlock>
            </div>
          ))}
        </div>
      </section>

      {/* Configuration */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Configuration</h2>
        <p className="text-muted-foreground mb-4 text-sm">
          Add the Darcy MCP server to your client&apos;s configuration. For Claude Code and Claude
          Desktop, add this to your <code className="bg-muted rounded px-1.5 py-0.5">.mcp.json</code> or{' '}
          <code className="bg-muted rounded px-1.5 py-0.5">claude_desktop_config.json</code>:
        </p>
        <CodeBlock title=".mcp.json">{mcpJsonConfig}</CodeBlock>
        <div className="mt-4 space-y-2">
          <p className="text-muted-foreground text-sm">
            <strong className="text-foreground">Environment variable:</strong>{' '}
            <code className="bg-muted rounded px-1.5 py-0.5">DARCY_API_URL</code> — the base URL
            of the Darcy backend API. Defaults to{' '}
            <code className="bg-muted rounded px-1.5 py-0.5">http://localhost:8000</code> if not
            set.
          </p>
          <p className="text-muted-foreground text-sm">
            <strong className="text-foreground">Remote API:</strong> To connect to the hosted
            instance, set{' '}
            <code className="bg-muted rounded px-1.5 py-0.5">
              DARCY_API_URL=http://18.195.13.46
            </code>
          </p>
        </div>
      </section>

      {/* Tools Reference */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Tools Reference</h2>
        <p className="text-muted-foreground mb-6 text-sm">
          The MCP server exposes 14 tools across 5 categories. Each tool maps to a Darcy API
          endpoint and handles serialization, error handling, and streaming automatically.
        </p>

        <div className="space-y-6">
          {tools.map((group) => (
            <Card key={group.category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{group.category}</CardTitle>
                <CardDescription>
                  {group.items.length} tool{group.items.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[220px]">Tool</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.items.map((tool) => (
                      <TableRow key={tool.name}>
                        <TableCell>
                          <code className="bg-muted rounded px-1.5 py-0.5 text-xs font-medium">
                            {tool.name}
                          </code>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {tool.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Architecture</h2>
        <CodeBlock title="How it works">
          {`MCP Client (Claude Code / Desktop / Cursor)
    │
    │  stdio (JSON-RPC)
    ▼
MCP Server (mcp-server/server.py)
    │
    │  HTTP (httpx)
    ▼
Darcy API (FastAPI :8000)
    ├── Qdrant (vector search)
    ├── Claude (AI consultant)
    └── OpenAI (embeddings)`}
        </CodeBlock>
        <p className="text-muted-foreground mt-4 text-sm">
          The MCP server is a thin adapter layer — it translates MCP tool calls into HTTP requests
          against the Darcy FastAPI backend. All business logic, RAG search, and AI orchestration
          lives in the backend. The server itself is stateless and can be restarted at any time.
        </p>
      </section>

      {/* Example Usage */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Example Usage</h2>
        <p className="text-muted-foreground mb-4 text-sm">
          Once connected, you can interact with Darcy naturally through your AI client:
        </p>
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <p className="mb-2 text-sm font-medium">Search regulations</p>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm italic">
                  &quot;What are the capital requirements for a Swiss fintech license?&quot;
                </p>
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                → Calls <code>search_knowledge_base</code> with your query, returns cited regulatory
                text
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="mb-2 text-sm font-medium">Analyse a client</p>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm italic">
                  &quot;Run a gap analysis for Alpine Digital Bank and tell me what&apos;s blocking
                  them&quot;
                </p>
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                → Calls <code>list_clients</code> → <code>analyze_gaps</code> → returns readiness
                score, gaps, and blockers
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="mb-2 text-sm font-medium">Onboard a new client</p>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm italic">
                  &quot;Start onboarding a new company called Zurich Payments GmbH that wants a
                  fintech license&quot;
                </p>
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                → Calls <code>start_onboarding</code> → <code>onboard_chat</code> → guides through
                intake questions
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Separator className="mb-6" />
      <p className="text-muted-foreground text-center text-xs">
        Built with the{' '}
        <a
          href="https://modelcontextprotocol.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline underline-offset-4"
        >
          Model Context Protocol
        </a>{' '}
        — the open standard for connecting AI assistants to tools and data.
      </p>
    </div>
  )
}
