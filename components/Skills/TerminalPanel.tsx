"use client";

import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/BrandMarks";
import { useProjectModal } from "@/components/Projects/ProjectModalProvider";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import { siteConfig } from "@/data/site";
import { useLang } from "@/lib/i18n";
import { smoothScrollTo } from "@/lib/utils";
import { btnCommand } from "@/lib/buttons";

/**
 * A working shell over this site's own data.
 *
 * ACCESSIBILITY, which is where most versions of this go wrong:
 *
 *   - A real <input> inside a real <form>. Not `contenteditable`, and not a
 *     <div> with a global keydown handler — both of those kill the screen
 *     reader's echo of what you are typing, because the SR only speaks
 *     characters typed into a form control.
 *   - The output is `role="log"` (implicitly polite) with
 *     `aria-atomic="false"`, so only NEW lines are announced. `assertive`
 *     would interrupt the user mid-sentence on every command.
 *   - The log is scrollable, so it is focusable (`tabIndex={0}`) — SC 2.1.1.
 *   - No autofocus on mount. Focusing this input on load would scroll the
 *     page down to the skills section before anyone asked it to.
 *   - Buttons for every command, so this is not a keyboard-only feature.
 *
 * ENTRIES ARE DESCRIPTORS, NOT RENDERED NODES. Storing JSX in state would
 * freeze each line in whatever language it was produced in; storing
 * `{ kind: "skills" }` and rendering at draw time means the whole transcript
 * re-renders correctly when the language switches.
 *
 * The initial transcript is a real `skills` run, so the full categorised list
 * ships as semantic <ul>/<li> in the exported HTML — the terminal is an
 * enhancement over a list that is already there, not a replacement for one.
 */

type Entry =
  | { id: number; kind: "input"; value: string }
  | { id: number; kind: "skills" }
  | { id: number; kind: "projects" }
  | { id: number; kind: "help" }
  | { id: number; kind: "whoami" }
  | { id: number; kind: "about" }
  | { id: number; kind: "note"; value: string }
  | { id: number; kind: "error"; value: string };

/**
 * `Omit<Entry, "id">` does NOT distribute over a union — it collapses to the
 * keys every member shares, which here is only `kind`, so every `value`
 * silently becomes a type error. This maps over each member instead.
 */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;
type NewEntry = DistributiveOmit<Entry, "id">;

const COMMANDS = [
  "help",
  "skills",
  "projects",
  "about",
  "whoami",
  "contact",
  "clear",
] as const;

const INITIAL: Entry[] = [
  { id: 0, kind: "input", value: "skills" },
  { id: 1, kind: "skills" },
];

export default function TerminalPanel() {
  const { lang, t } = useLang();
  const term = t.skills.terminal;
  const { openProject } = useProjectModal();

  const [entries, setEntries] = useState<Entry[]>(INITIAL);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyAt, setHistoryAt] = useState(-1);

  const nextId = useRef(INITIAL.length);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const push = (...items: NewEntry[]) =>
    setEntries((prev) => [
      ...prev,
      ...items.map((item) => ({ ...item, id: nextId.current++ }) as Entry),
    ]);

  // Keep the newest line visible. Only scrolls the log's own box, never the
  // page — a terminal that yanks the viewport is worse than one that does not
  // scroll at all.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [entries]);

  const run = (raw: string) => {
    const input = raw.trim();
    if (!input) return;

    setHistory((h) => [input, ...h].slice(0, 30));
    setHistoryAt(-1);
    setValue("");

    const [command, ...args] = input.split(/\s+/);
    const cmd = command.toLowerCase();

    if (cmd === "clear") {
      setEntries([]);
      return;
    }

    push({ kind: "input", value: input });

    switch (cmd) {
      case "help":
        push({ kind: "help" });
        return;
      case "skills":
        push({ kind: "skills" });
        return;
      case "projects":
        push({ kind: "projects" });
        return;
      case "about":
        push({ kind: "about" });
        return;
      case "whoami":
        push({ kind: "whoami" });
        return;
      case "contact":
        push({ kind: "note", value: term.opening.replace("{0}", "#contact") });
        smoothScrollTo("contact");
        return;
      case "open": {
        const id = args[0];
        if (!id) {
          push({ kind: "error", value: term.usageOpen });
          return;
        }
        const project = projects.find((p) => p.id === id);
        if (!project) {
          push({ kind: "error", value: term.notFound.replace("{0}", id) });
          return;
        }
        push({
          kind: "note",
          value: term.opening.replace("{0}", project.title[lang]),
        });
        openProject(project.id);
        return;
      }
      default:
        push({ kind: "error", value: term.unknown.replace("{0}", cmd) });
    }
  };

  // Shell history on the arrow keys. Safe to bind here because the input is
  // focused — nothing global is being hijacked.
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const at = Math.min(historyAt + 1, history.length - 1);
      if (at >= 0) {
        setHistoryAt(at);
        setValue(history[at]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const at = historyAt - 1;
      setHistoryAt(at);
      setValue(at >= 0 ? history[at] : "");
    }
    // Tab is deliberately NOT intercepted for completion. Trapping Tab inside
    // a text field is one of the fastest ways to strand a keyboard user.
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border-structural">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-2 px-4 py-2.5">
        <span className="font-mono text-label uppercase text-faint">
          <span className="text-accent-dim">{"~/"}</span>
          {term.label}
        </span>
        <span className="font-mono text-label text-faint">
          {`${projects.length} projects`}
        </span>
      </div>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-atomic="false"
        aria-label={term.label}
        tabIndex={0}
        onClick={() => inputRef.current?.focus()}
        className="term max-h-[26rem] min-h-[20rem] space-y-2 overflow-y-auto p-4 text-screen"
      >
        {entries.map((entry) => (
          <Line key={entry.id} entry={entry} />
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(value);
        }}
        className="term flex items-center gap-2 border-t border-border px-4 py-3"
      >
        <span aria-hidden="true" className="font-mono text-sm text-accent">
          $
        </span>
        <label htmlFor="term-input" className="sr-only">
          {term.inputLabel}
        </label>
        <input
          ref={inputRef}
          id="term-input"
          name="cmd"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          aria-describedby="term-help"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          placeholder={term.placeholder}
          className="min-w-0 flex-1 bg-transparent font-mono text-sm text-text outline-none placeholder:text-faint"
        />
        <p id="term-help" className="sr-only">
          {term.help}
        </p>
      </form>

      {/* Not everyone will type. Every command is also a button. */}
      <div className="flex flex-wrap gap-2 border-t border-border-faint bg-surface px-4 py-3">
        {COMMANDS.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => run(cmd)}
            data-cursor="link"
            className={btnCommand}
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}

function Line({ entry }: { entry: Entry }) {
  const { lang, t } = useLang();
  const term = t.skills.terminal;

  switch (entry.kind) {
    case "input":
      return (
        <p className="text-text">
          <span className="text-accent">{"$ "}</span>
          {entry.value}
        </p>
      );

    case "error":
      return <p className="text-danger">{entry.value}</p>;

    case "note":
      return <p className="text-accent">{entry.value}</p>;

    case "whoami":
      return (
        <p className="text-muted">
          {`${siteConfig.name} — ${t.hero.roleTitle}`}
        </p>
      );

    case "about":
      return (
        <p className="max-w-2xl leading-relaxed text-muted">{t.about.p1}</p>
      );

    case "help":
      return (
        <dl className="space-y-1">
          {COMMANDS.map((cmd) => (
            <div key={cmd} className="flex gap-3">
              <dt className="w-20 shrink-0 text-accent">{cmd}</dt>
              <dd className="text-muted">{term.commands[cmd]}</dd>
            </div>
          ))}
          <div className="flex gap-3">
            <dt className="w-20 shrink-0 text-accent">{"open <id>"}</dt>
            <dd className="text-muted">{term.commands.open}</dd>
          </div>
        </dl>
      );

    case "projects":
      return (
        <ul className="space-y-1">
          {projects.map((project) => (
            <li key={project.id} className="flex flex-wrap gap-x-3">
              <span className="w-48 shrink-0 text-accent">{project.id}</span>
              <span className="text-muted">{project.title[lang]}</span>
            </li>
          ))}
        </ul>
      );

    case "skills":
      return (
        <div className="space-y-3">
          {skillCategories.map((category) => (
            <div key={category.name}>
              <p className="text-faint">{category.tag}</p>
              <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                {category.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-1.5 text-text">
                    <BrandMark skill={skill} className="h-3 w-3 text-accent" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
  }
}
