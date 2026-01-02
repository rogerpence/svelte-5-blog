---
title: How do I find ASNA DataGate for IBM i end-user jobs?
description: 'How to find active DataGate for IBM i end user jobs. '
tags:
  - datagate-ibm-i
date_published: '2024-01-05T12:35:56.000Z'
date_updated: '2024-01-05T19:03:23.000Z'
date_created: '2024-01-05T19:03:23.000Z'
pinned: false
---
<script>
    import Image from '$components/text-decorators/Image.svelte'
</script>


To find all ASNA DataGate for IBM i active end-user jobs use the IBM i WRKACTJOB (or WRKSBSJOB) command and look for DG8\_NET .NET jobs. The green rectangle in the screenshot below shows DataGate for IBM i active end-user jobs. End user jobs are the DG8\_NET jobs.

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/dg-user-jobs-1.png" alt="Seeing DataGate end-user jobs with WRKACTJOB" width="600" alignment="center" caption="Figure 1."/>

Note: All DataGate end-user jobs must be ended before ending the DataGate server. As shown above, end-user jobs are the DG8\_NET jobs. Do not end DataGate server if any DG8\_NET jobs are present. Those jobs need to be ended before you end DataGate server--otherwise you could have trouble restarting DataGate.

## To see what version of DataGate a DG8\_NET job is running

- Use Option 5 to work with the job
- Use Option 11 to see the call stack
- Scroll through the list and you'll see the active DG library listed

Here are a couple of other things to remember about DataGate end-user jobs:

- DataGate end-user jobs (DG8\_NET jobs) do not end when DataGate is ended-they continue to run. DataGate does not reach out and end end-user jobs on its own.
- When you look at an active end-user job with WRKACTDJOB (or other says such as WRKSBSJOB), the user shown is the user identified in the database name. In the screenshot above the multiple WEBDEMO1 users are a pretty good clue that this is a Web app where all users are using the same database name.
- If DataGate end-user jobs are running when DataGate restarts, your licensed user counts may be wrong. When DataGate ends, so does its license manager. When the license manager goes down it loses the count of seats. Then when it comes back up, there's likely to be an over-count at recovery. For example, suppose you are running something that is using two DG400 jobs from your PC. Before the license manager goes down, that counts as one seat. When it comes back on a restart, the license manager can't tell what job is which seat, so it counts your jobs as two seats. To resolve this, affected users need to end their jobs and restart them.
- Ending DataGate versions earlier than 14.x with running jobs often causes problems restarting DataGate. DataGate won't restart until those jobs are ended because of an "error binding socket" issue.
- As you can see, while DataGate can be ended with active end-user jobs, the best practice is to not do that. Generally, you'll want to make sure all users are logged and their jobs have ended before ending DataGate.

