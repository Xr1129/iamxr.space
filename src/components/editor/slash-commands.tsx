"use client";

interface Command {
  id: string;
  label: string;
  description: string;
  apply: () => void;
}

interface SlashCommandsProps {
  commands: Command[];
  filter: string;
  visible: boolean;
  position: { top: number; left: number };
  onSelect: () => void;
}

export default function SlashCommands({
  commands,
  filter,
  visible,
  position,
  onSelect,
}: SlashCommandsProps) {
  if (!visible) return null;

  const filtered = filter
    ? commands.filter((c) => c.id.includes(filter.toLowerCase()) || c.label.includes(filter))
    : commands;

  return (
    <div
      className="absolute z-50 w-60 max-h-56 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
      style={{ top: position.top, left: position.left }}
    >
      {filtered.length === 0 ? (
        <div className="px-4 py-3 text-xs text-gray-400 dark:text-gray-500">
          No matching commands
        </div>
      ) : (
        filtered.map((cmd) => (
          <button
            key={cmd.id}
            type="button"
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={() => {
              cmd.apply();
              onSelect();
            }}
          >
            <span className="text-xs font-mono text-blue-600 dark:text-blue-400 w-20 shrink-0">
              /{cmd.id}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">{cmd.description}</span>
          </button>
        ))
      )}
    </div>
  );
}
