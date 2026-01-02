---
title: Using the HTML Dialog element
description: Using the HTML Dialog element
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - design
  - css
  - html
---
```
dialog = document.getElementById('confirmation-dialog');
dialog.addEventListener('click', ({ target: dialog }) => {
	if (dialog.nodeName === 'DIALOG') dialog.close();
});
```

This code shows how to harness Adam Argyle's [excellent work](https://web.dev/shows/gui-challenges/GDzzIlRhEzM/) on how to use the HTML `dialog` element (see link below).

This code is available at [this GitHub repository.](https://github.com/rogerpence/html-dialog-element)

## JavaScript

This JavaScript initializes two dialogs. You can have as many dialogs as you want. The arguments are:

-   `dialogid` - the `dialog` element id.
-   `dialogElement` - the selector of the anchor tag that when clicked opens the dialog.

```
import { configDialog } from "./config-dialog.js";

configDialog([
  { dialogId: "#mydialog", dialogOpenerElement: "#open-my-dialog" },
  { dialogId: "#second-dialog", dialogOpenerElement: "#open-second-dialog" },
]);
```

There are two supporting JavaScript files. These files don't need any customization--they provide the logic for all dialog elements. If you can't use them without modification, something is wrong!

`config-dialog.js` - The `configDialog` routine below calls `setUpDialog` to initialize a given a dialog.

```
import GuiDialog from "./dialog.js";

/*
 * Initialize all instances of the Dialog.
 */

export const configDialog = (dialogInfo) => {
  dialogInfo.forEach(({ dialogId, dialogOpenerElement }) => {
    setUpDialog(dialogId, dialogOpenerElement);
  });
};

const setUpDialog = (dialogId, dialogOpenerElement) => {
  if (dialogId.startsWith("#")) dialogId = dialogId.slice(1);

  const myOpener = document.querySelector(dialogOpenerElement);
  myOpener.addEventListener("click", (e) => {
    window[dialogId].showModal();

    window[dialogId].addEventListener(
      "closing",
      ({ target: dialog }) => {
        if (dialog.returnValue === "confirm") {
          console.log("confirm");
        }
      },
      { once: true }
    );
  });

  const dialogElement = document.querySelector(`#${dialogId}`);
  GuiDialog(dialogElement);
};
```

`dialog.js` - This code is taking from Adam Argyle's [Gui Challenge Dialog](https://web.dev/shows/gui-challenges/GDzzIlRhEzM/). His CSS and JavaScript are stellar and very effective fade out the `dialog` element (something most others either don't do or don't get right). However, Adam's code isn't written to be reused--it's written to very specifically resolve the two dialog challenges his content presents.

The code below is my attempt at pulling out the generic parts of Adam's code to provide very good `dialog` fade-in and fade-out.

```
// custom events to be added to <dialog>

// This is based on Adam Argyle's work and should work with any dialog.
// This is what gives the dialog fade-in and fade-out capabilities.

const dialogClosingEvent = new Event("closing");
const dialogClosedEvent = new Event("closed");
const dialogOpeningEvent = new Event("opening");
const dialogOpenedEvent = new Event("opened");
const dialogRemovedEvent = new Event("removed");

// track opening
const dialogAttrObserver = new MutationObserver((mutations, observer) => {
  mutations.forEach(async (mutation) => {
    if (mutation.attributeName === "open") {
      const dialog = mutation.target;

      const isOpen = dialog.hasAttribute("open");
      if (!isOpen) return;

      dialog.removeAttribute("inert");

      // set focus
      const focusTarget = dialog.querySelector("[autofocus]");
      focusTarget
        ? focusTarget.focus()
        : dialog.querySelector("button").focus();

      dialog.dispatchEvent(dialogOpeningEvent);
      await animationsComplete(dialog);
      dialog.dispatchEvent(dialogOpenedEvent);
    }
  });
});

// track deletion
const dialogDeleteObserver = new MutationObserver((mutations, observer) => {
  mutations.forEach((mutation) => {
    mutation.removedNodes.forEach((removedNode) => {
      if (removedNode.nodeName === "DIALOG") {
        removedNode.removeEventListener("click", lightDismiss);
        removedNode.removeEventListener("close", dialogClose);
        removedNode.dispatchEvent(dialogRemovedEvent);
      }
    });
  });
});

// wait for all dialog animations to complete their promises
const animationsComplete = (element) =>
  Promise.allSettled(
    element.getAnimations().map((animation) => animation.finished)
  );

// click outside the dialog handler
const lightDismiss = ({ target: dialog }) => {
  if (dialog.nodeName === "DIALOG") dialog.close("dismiss");
};

const dialogClose = async ({ target: dialog }) => {
  dialog.setAttribute("inert", "");
  dialog.dispatchEvent(dialogClosingEvent);

  console.log("close");
  await animationsComplete(dialog);

  dialog.dispatchEvent(dialogClosedEvent);
};

// page load dialogs setup
export default async function (dialog) {
  dialog.addEventListener("click", lightDismiss);
  dialog.addEventListener("close", dialogClose);

  dialogAttrObserver.observe(dialog, {
    attributes: true,
  });

  dialogDeleteObserver.observe(document.body, {
    attributes: false,
    subtree: false,
    childList: true,
  });

  // remove loading attribute
  // prevent page load @keyframes playing
  await animationsComplete(dialog);
  dialog.removeAttribute("loading");
}
```

## CSS

This CSS provides the `dialog` element presentation. It has a few parts that need to be adjusted. I'll update this as a go along. For example, the `background-color` of the `dialog` element should probably be set with a CSS property (to make it easy to change.)

The CSS below uses [Open Props](https://open-props.style/), so you need that in your project. A naive way to do that is with

```
@import "https://unpkg.com/open-props"
```

`dialog-main.css` - Generic (mostly!) `dialog` element presentation.

```
//html:has(dialog[open][modal-mode="mega"]) {
//    overflow: hidden;
//}

dialog {
    display: grid;
    align-content: start;

    /* dialog background color */
    background-color: lightgray;

    color: var(--text-1);
    max-inline-size: min(90vw, var(--size-content-3));
    margin: auto;
    padding: 0;
    position: fixed;
    inset: 0;
    border-radius: var(--radius-2);
    box-shadow: var(--shadow-3);
    z-index: var(--layer-important);
    overflow: hidden;
    /* transition: opacity .5s var(--ease-3); */
    border: 1px solid gray;

    animation: var(--animation-scale-down) forwards;
    animation-timing-function: var(--ease-squish-3);

    &:not([open]) {
      pointer-events: none;
      opacity: 0;
    }

    &::backdrop {
        background-color: rgba(0,0,0,.4);
        backdrop-filter: blur(2px);
        transition: backdrop-filter .5s ease;
    }

    &[loading] {
      visibility: hidden;
    }

    &[open] {
        animation: var(--animation-slide-in-up) forwards;
    }
}
```

### HTML

Your `dialog` element can have any HTML contents in it (including forms). The only requirements are:

-   Each `dialog` element is defined with `inert` and `loading` attributes

-   If you put a form inside the `dialog` put `method=dialog` in its `form` tag
    Adam's JavaScript and CSS assume these attributes are present.

```
<dialog id="mydialog" inert loading>
    <form method="dialog">
    ...
    </form>
</dialog>
```