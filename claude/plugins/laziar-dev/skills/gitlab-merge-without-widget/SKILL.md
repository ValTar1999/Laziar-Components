---
name: gitlab-merge-without-widget
description: How to merge, retitle or redescribe a gitlab.agora.md merge request with git push options when its page does not load (for example "Error occurred when fetching sidebar data" and an empty merge widget with no Merge button). Use when the user cannot merge or edit an MR from the GitLab UI.
---

# Merging when the GitLab merge request page is broken

GitLab applies push options to the open merge request of the branch being pushed, so a merge can be set without the page.

**Merging changes a shared branch. Ask the user first and do it only after a clear yes.**

## Before

1. Confirm the MR itself is fine: its pipeline passed and it does not conflict with the target:
   `git fetch origin && git merge-tree --write-tree origin/<target> origin/<branch>` must succeed.
2. Make sure the local branch equals the remote one (`git rev-parse <branch> origin/<branch>`).
3. If several MRs are stacked (each branch contains the one before), merge them in order, bottom first.

## Do

Push options are only sent with a ref update, so add an empty commit:

```
git checkout <branch>
git commit --allow-empty -m "Trigger the merge of <what>"
git push origin <branch> \
  -o merge_request.merge_when_pipeline_succeeds \
  -o "merge_request.title=<title>" \
  -o "merge_request.description=<one line>"
```

- Option values cannot contain line breaks, so the description must be one line. Leave it out to keep the current one.
- GitLab answers with "View merge request for <branch>: <url>" when it found the MR.
- The MR merges by itself when the new pipeline passes. Watch for it with `git ls-remote origin refs/heads/<target>` or by checking that the empty commit is an ancestor of `origin/<target>`.

## After

- Confirm the merge commit is on the target and tell the user its hash.
- The broken page is a GitLab problem. Suggest the user report it to the GitLab administrator (GraphQL errors in the server logs).
