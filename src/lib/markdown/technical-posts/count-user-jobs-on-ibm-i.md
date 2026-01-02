---
title: Count IBM i user jobs ibmi
description: Count IBM i user jobs ibmi
date_created: '2025-08-12T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - ibm-i
---
### Example 1: Traditional CL Program using `WRKUSRJOB`

This method uses the standard `WRKUSRJOB` command to create a temporary file and then the `RTVMBRD` (Retrieve Member Description) command to count the records in that file. This is a very common pattern in older or traditional CL programming.

**CL Program: `GETBCHCNT`**

```cl
/****************************************************************/
/* PROGRAM: GETBCHCNT                                           */
/*                                                              */
/* DESCRIPTION: Gets the count of *Active *Batch jobs for a     */
/*              given user.                                     */
/*                                                              */
/* PARAMETERS:  &USER     - Input: The user profile to check.   */
/*              &JOBCOUNT - Return: The number of jobs found.   */
/*                                                              */
/* TO COMPILE: CRTCLPGM PGM(yourlib/GETBCHCNT) SRCFILE(yourlib/QCLSRC) */
/*                                                              */
/****************************************************************/
PGM        PARM(&USER &JOBCOUNT)

   /* Parameter Declarations */
   DCL        VAR(&USER)     TYPE(*CHAR) LEN(10)
   DCL        VAR(&JOBCOUNT) TYPE(*DEC)  LEN(5 0) /* 5 digits, 0 decimals */

   /* Local Variable Declaration */
   DCL        VAR(&NBRRCDS)  TYPE(*DEC)  LEN(10 0)

   /* Initialize return parameter */
   CHGVAR     VAR(&JOBCOUNT) VALUE(0)

   /* Clean up a previous run of this job, ignore error if file not found */
   DLTF       FILE(QTEMP/ACTBCHJOBS)
   MONMSG     MSGID(CPF2105)

   /* Create a temporary file in QTEMP with the active batch job list */
   WRKUSRJOB  USER(&USER) STATUS(*ACTIVE) JOBTYPE(*BATCH) +
                OUTPUT(*OUTFILE) OUTFILE(QTEMP/ACTBCHJOBS)
   /* Monitor for message CPF9862, which means no records were selected */
   MONMSG     MSGID(CPF9862) EXEC(GOTO CMDLBL(CLEANUP))

   /* Retrieve the record count from the member description of the temp file */
   RTVMBRD    FILE(QTEMP/ACTBCHJOBS) NBRCURRCD(&NBRRCDS)

   /* Change the parameter variable to the retrieved record count */
   CHGVAR     VAR(&JOBCOUNT) VALUE(&NBRRCDS)


CLEANUP:
   DLTF       FILE(QTEMP/ACTBCHJOBS)
   MONMSG     MSGID(CPF2105) /* Ignore error if file not found */

ENDPGM:
ENDPGM
```

**How to Use This Program:**

1.  **Compile:** Use the `CRTCLPGM` command as noted in the program's comments.
2.  **Call:** You would call this program from another CL program, passing it a username and a decimal variable to receive the count.

    ```cl
    /* Example of calling GETBCHCNT */
    DCL &USERNAME TYPE(*CHAR) LEN(10) VALUE('QPGMR')
    DCL &COUNT    TYPE(*DEC)  LEN(5 0)

    CALL PGM(GETBCHCNT) PARM(&USERNAME &COUNT)

    /* The &COUNT variable now holds the number of active batch jobs for QPGMR */
    IF   COND(&COUNT > 0) THEN(SNDPGMMSG MSG('User' *BCAT &USERNAME *BCAT +
         'has' *BCAT %CHAR(&COUNT) *BCAT 'active batch jobs.'))
    ELSE (SNDPGMMSG MSG('No active batch jobs found for user' *BCAT &USERNAME))
    ```


### Example 2: Modern ILE CL Program using Embedded SQL

This method uses embedded SQL and the `ACTIVE_JOB_INFO` system view. It is more efficient as it does not create any temporary work files. This requires creating the program as a `CLLE` (ILE CL) source type and compiling it with the `CRTBNDCL` (Create Bound CL Program) command.

**CLLE Program: `GETBCHSQL`**

```cl
/****************************************************************/
/* PROGRAM: GETBCHSQL                                           */
/*                                                              */
/* DESCRIPTION: Gets the count of *Active *Batch jobs for a     */
/*              given user using embedded SQL.                  */
/*                                                              */
/* PARAMETERS:  &USER     - Input: The user profile to check.   */
/*              &JOBCOUNT - Return: The number of jobs found.   */
/*                                                              */
/* SOURCE TYPE: CLLE                                            */
/*                                                              */
/* TO COMPILE:                                                  */ 
/*    CRTBNDCL PGM(yourlib/GETBCHSQL) SRCFILE(yourlib/QCLSRC)   */
/*                                                              */
/****************************************************************/
PGM        PARM(&USER &JOBCOUNT)

   /* Parameter Declarations */
   DCL        VAR(&USER)     TYPE(*CHAR) LEN(10)
   DCL        VAR(&JOBCOUNT) TYPE(*DEC)  LEN(5 0)

   /* Initialize return parameter */
   CHGVAR     VAR(&JOBCOUNT) VALUE(0)

   /* Execute SQL to count the jobs and place result into &JOBCOUNT */
   /* The variable must be preceded by a colon (:) in the SQL statement */
   EXEC SQL
      SELECT COUNT(*)
        INTO :JOBCOUNT
        FROM TABLE(QSYS2.ACTIVE_JOB_INFO())
       WHERE AUTHORIZATION_NAME = :USER AND JOB_TYPE = 'BCH'

   /* No cleanup is necessary */

ENDPGM:
ENDPGM
```

**How to Use This Program:**

1.  **Compile:** Use the `CRTBNDCL` command, which processes the embedded SQL. Make sure your source member type is set to `CLLE`.
2.  **Call:** The calling process is identical to the first example.

    ```cl
    /* Example of calling GETBCHSQL */
    DCL &USERNAME TYPE(*CHAR) LEN(10) VALUE('QPGMR')
    DCL &COUNT    TYPE(*DEC)  LEN(5 0)

    CALL PGM(GETBCHSQL) PARM(&USERNAME &COUNT)

    IF   COND(&COUNT > 0) THEN(SNDPGMMSG MSG('User' *BCAT &USERNAME *BCAT +
         'has' *BCAT %CHAR(&COUNT) *BCAT 'active batch jobs.'))
    ELSE (SNDPGMMSG MSG('No active batch jobs found for user' *BCAT &USERNAME))
    ```

### Comparison

| Feature | Example 1 (WRKUSRJOB) | Example 2 (Embedded SQL) |
| :--- | :--- | :--- |
| **Method** | Creates a temporary outfile and counts records. | Directly queries system information. |
| **Efficiency** | Less efficient due to I/O for temporary file creation and deletion. | More efficient; no temporary objects are created. |
| **Simplicity** | Logic is more verbose with multiple steps (Create, Check, Retrieve, Delete). | Cleaner and more direct. The intent is clear in one statement. |
| **Dependencies** | Relies on traditional system commands. | Relies on Db2 for i and the `QSYS2.ACTIVE_JOB_INFO` view. |
| **Compile Cmd**| `CRTCLPGM` | `CRTBNDCL` |

For modern development on the IBM i platform, the **embedded SQL method (Example 2) is highly recommended** due to its superior performance and code simplicity.