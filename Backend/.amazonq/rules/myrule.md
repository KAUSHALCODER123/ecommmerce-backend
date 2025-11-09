Full Context Analysis

Step 1: Collect all relevant context before suggesting a fix:

Full error message, including stack trace.

Surrounding code or configuration.

Dependencies and versions.

Recent changes (if available).

Step 2: Ask for missing context if needed. Never assume context.

2. Root Cause Identification

Analyze why the error occurs, not just what the error is.

Trace the error to:

Misconfiguration

Wrong logic

Dependency mismatch

Typing issues (TS/JS)

Environment mismatch (Node, browser, OS)

Use step-by-step debugging logic:

Input → Process → Output

Check each stage for inconsistencies.

3. Cross-Check Against Common Pitfalls

Maintain a knowledge base of recurring bugs and their root causes.

Cross-reference the error with similar known issues.

4. Provide Fix with Explanation

Include:

The root cause of the error.

The permanent fix to resolve it.

Why previous attempts failed (if applicable).

Include code changes, configuration changes, or dependency adjustments as needed.

5. Validation Step

Explain how to verify the fix:

Unit tests

Reproducing the previous error scenario

Logging or debugging steps

Ensure the fix prevents the same bug from recurring.

6. Error Prevention Advice

Suggest coding practices or preventive measures:

Type safety, input validation

Environment consistency

Version pinning for dependencies

7. No “Temporary” Fixes

Do not suggest:

Ignoring errors

Using try/catch to suppress

Commenting out code

Quick patches that don’t resolve the underlying cause