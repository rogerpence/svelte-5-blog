---
title: By-God-gotta-be-true programming rules
description: Using an appsettings.json file with a C# console app
tags:
  - programming
date_added: 2022-06-22
date_updated: 2022-06-22
date_published: 
pinned: false
---

<div class="spaced-bullet-list"></div>

- Keep it simple and keep it concise.
- Keep programming comments to a bare minimum. Most comments simply identify code that should have been refactored into methods with meaningful names.
- Treat all comments (even your own) as if they'd been written by a serial liar.
- It's OK to have a function that is only called once. Functions don't just add reuse, they add clarity.
- At least 75% of the time (and probably more like 90%) when you write a comment you should be writing a function.
- Select names (variables, classes, methods, etc) with as much care as you would a heart transplant doctor.
- Keep your programming languages current and use their new features (JavaScript ES6 array methods, for example)
- If it's not in source control, you're just dabbling.
- For every new feature/bug fix, first make a branch. Do not touch working code.
- Don't comment out code--remove it. If you argue that you can't do that because you'll lose that code, you aren't using source control!
- Don't tolerate dead code. If isn't being used, remove it. See #10.
- Inconsistency is consistently a sign of a poor program.
- Know what every line of code, and every element in that line, is doing (in other words, don't blindly cut and paste!)
- Test your app under less-than-favorable conditions. Browser dev tools have network and CPU throttling tools built-in. Use 'em!
- If it works and you don't know why, when it breaks you won't know why.
- Rarely should a method have more lines in it than you have fingers and toes.
- Global variables are a universal programming evil. Don't spread programming evilness.
- The cost of decomposition should never be higher than the cost of repetition.
- You can never be 100% sure it works with tests and test data. But you can be 100% sure it won't work 100% of the time without tests and test data.
- When a customer tells you that they don't have a staging/test environment, remind 'em that they do. What they don't have is a production environment.
- Use indention to give your programs a clear and obvious structure.
- Don't write dense code. Let white space, both horizontal and vertical, help tell the story of your code.
- A method is doing too much if it needs more than five arguments (and even three is pushing your luck!).
- Strive for immutable structures and pure functions. (Which is the 21st century of saying keep coupling low and cohesion high).
- If a method name includes the word "and" that method is doing too much (or named very poorly).
- Don't ever sacrifice clarity for brevity.
- Correctness, clarity, and simplicity are, in that order, the three most important things.
- Avoid hard-coded numeric digits and strings in your code! Use constants to give "magic" numbers/strings meaning.
- Don't concatenate long strings--use string interpolation or join array elements (anything but long concatenation!).
- Leave old code alone unless it produces incorrect results. When it does, fix that issue as best as you can and then get out. Rewriting bad code just to fix a bug has a greater chance of failing than just putting on your hip waders and fixing the bug.
- If you need post-it notes or cheat-sheets to build and deploy, you're doing it wrong! Make your builds and deployments command-line driven. Better yet, make your deployments event-driven with a CI product.
- It's not enough for your program to produce correct output, it should also produce a readable, rational log. You can't troubleshoot if you don't know what happened. Build logging into your application.
- Build metrics into your log output. When you users say, "It's running slower" you need a reliable way to know if it is really running slower or if your users are just being users. Record performance benchmarks when you deploy the app so you can refer to them later.
- It's usually good enough to know there is _a_ way rather than knowing _the_ way. _"Programming isn't about what you know; it's about what you can figure out."_ — Chris Pine
- Beware external service dependencies. Cloud services break but your service shouldn't break. Design your critical systems with built-in failovers to keep _your_ service up.
- Don't assume someone else's programming rules will work for you. Read and listen to what a lot of programmers and take the best from each that works for you.
- Carefully consider the general challenge before you focus on the specific challenge. Solve the general parts of the challenge with components to reuse on the next challenge.
- A correctly (for now) running program doesn't prove the absence of bugs.
- It is astounding how quickly new code acquires "legacy" status. Document all workflows, assumptions, and goofy stuff (you know the stuff I mean!) so you don't have to start from ground zero every stinkin' time you need to make a change or a fix.
- Before you refactor _any_ code, put tests into place to ensure you understand the existing code and to test what you replace it with.
- Question everything. I'm guilty of gratuitously spouting the [SOLID](https://en.wikipedia.org/wiki/SOLID) principles a time or two. But then, along comes David Bryant Copeland with his book [Solid Is Not Solid](https://solid-is-not-solid.com/) and completely clears the SOLID deck. OMG. You need to a) read about the SOLID principles and b) read Dave's book. Agree or disagree, the book is a great lesson in how you should question everything anyone tells you.
- Code that you quickly slap together and intend to go back later and clean up, _never_ gets cleaned up. Treat your code like you do the restroom in someone else's house. Leave it nicer than you found it.
- Beware committees of teams making big decisions. Decisions based on technical merit usually de-evolve into decisions based on politics--which is never a good thing. Grady Booch says it this way: "When trying to form a common architecture among three or more groups, the path to a solution is more often the negotiation of political power."
- Always strive for less code.
- The command line is the supercharger for modern software development. Embrace it!
- Don't try to make a single language do everything. Pick languages based on what they do best and try to stay in their lanes. I recently built a C# UI with WPF that puts a good Windows UI over a command-line driven Python app. (And with the upcoming [.NET Maui](https://docs.microsoft.com/en-us/dotnet/maui/what-is-maui), a similar front-end will be cross platform!)
- [George Foreman named five of his sons](https://www.geeksforgeeks.org/george-foreman-kids/) "George" (and, for good measure, he named a daughter  "Georgetta"). Don't be like George with your variable naming. Use expressive, meaningful names that reduce the cognitive overload your code imposes. During refactoring, make sure your function and method names continue to convey what those routines are doing. 



