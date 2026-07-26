---
title: Interfaces are promises
description: "A small interface can carry a large obligation: it tells another person what they can safely assume."
published: 2026-07-12
tags: [Software, Design]
category: Software
featured: true
---

An interface is not only a boundary in code. It is a promise about what can be relied on.

When a function has a careful name and a narrow input, it tells the next reader where uncertainty ends. When an error state is explicit, it lets someone recover without reading the implementation. When a visual control looks and behaves consistently, it gives a person permission to move quickly.

The same principle scales from a one-line utility to a whole product. A good interface reduces the amount of context required to do the next thing correctly.

```ts
type SaveResult =
  | { ok: true; id: string }
  | { ok: false; reason: 'invalid-input' | 'unavailable' };

function saveNote(input: NoteInput): Promise<SaveResult> {
  // The caller knows every outcome that needs a deliberate response.
}
```

The useful quality here is not cleverness. It is legibility. A caller should be able to answer three questions without opening another file:

1. What do I provide?
2. What will I receive?
3. What should I do when it does not work?

Interfaces become expensive when they hide important consequences. A promise that appears simple but requires hidden timing, special state, or tribal knowledge is not actually simple. It merely moves complexity to the person using it.

Good design takes that complexity back.
