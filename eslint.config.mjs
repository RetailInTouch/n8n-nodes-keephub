import { config } from '@n8n/node-cli/eslint';

export default [
	// Never lint build output. tsc preserves comments, so dist/ carries the
	// `eslint-disable-next-line @typescript-eslint/no-explicit-any` comments from
	// the TypeScript sources. Those rules are only defined for .ts files, so
	// linting the compiled .js fails with "Definition for rule ... was not found"
	// — an error in generated code that no source change can fix.
	//
	// @n8n/node-cli's shared config ignores dist today. This keeps it ignored if
	// that ever changes, or when eslint runs from a different working directory
	// (editor integrations, CI steps invoking eslint directly).
	// `**/dist/**`, not `dist/**`: flat-config ignore patterns are anchored to the
	// config's directory, so `dist/**` misses build output nested any deeper. Git
	// worktrees live under .claude/worktrees/<name>/, inside the repo, so a plain
	// `eslint .` at the root walks straight into a worktree's compiled dist and
	// fails there — while the same command passes inside the worktree itself.
	{ ignores: ['**/dist/**', '.claude/**'] },
	...config,
];
