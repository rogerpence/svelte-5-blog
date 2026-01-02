---
title: How to intercept console output to keep test output clean
description: This shows how to intercept console output to keep test output clean.
date_updated: '2025-12-04T00:00:00.000Z'
date_created: '2025-02-02T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - vitest
---
```ts
    it("should handle invalid dates gracefully by leaving them as strings", () => {
        const input = {
            badDate: "2025-99-99", // Matches regex pattern but invalid date
        };

        //        Mock console.warn to keep test output clean
        const consoleSpy = vi
            .spyOn(console, "warn")
            .mockImplementation(() => {});

        const result = convertFrontmatterDateStrings(input);

        expect(typeof result.badDate).toBe("string");
        expect(result.badDate).toBe("2025-99-99");
        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
    })
```

  The `consoleSpy` in this test is doing three things:

**1. Spying on `console.warn`:**
```typescript
vi.spyOn(console, "warn")
```
This creates a spy that watches/intercepts all calls to `console.warn`. It tracks when and how the function is called.

**2. Mocking the implementation:**
```typescript
.mockImplementation(() => {})
```
This replaces the actual `console.warn` with an empty function. This prevents the warning message from appearing in your test output, keeping it clean and readable.

**3. Verifying the warning was triggered:**
```typescript
expect(consoleSpy).toHaveBeenCalled();
```
This assertion checks that `console.warn` was actually called during the test. It confirms that your `convertFrontmatterDateStrings` function detected the invalid date (`"2025-99-99"`) and attempted to log a warning about it.

**4. Cleaning up:**
```typescript
consoleSpy.mockRestore();
```
This restores `console.warn` to its original implementation so it doesn't affect other tests.

**In summary:** The spy lets you verify that error handling code (the warning) runs as expected, while keeping your test output clean by suppressing the actual warning message.