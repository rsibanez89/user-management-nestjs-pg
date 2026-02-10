---
name: prompt-tracking
description: A skill to track user prompts for review and refactoring.
---

# Prompt Tracking Skill

This project has a "Prompt Tracking" skill enabled.
The goal is to maintain a history of user requests for review and refactoring.

## Rules

1.  **Always** read `docs/prompts-tracker.md` to find the next available number.
2.  **Prepend** the user's current request to `docs/prompts-tracker.md`.
3.  Format the entry as a numbered item: `N. <request content>`.
4.  Do this **before** executing the request if possible, or as the first step.
5.  Do not modify the rest of the file, only add new entries at the top.
6.  Ensure that the numbering is sequential and does not skip any numbers.
