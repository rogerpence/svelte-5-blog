---
title: Using SQL to help identify ASP.NET orphan IBM i jobs
description: This article provides a potential way to identify orphan IBM i jobs as a result of Database connection leaks in ASP.NET Web applications.
tags:
  - asp-net
  - visual-rpg
date_published: '2024-01-09T13:28:43.000Z'
date_updated: '2024-01-09T20:19:23.000Z'
date_created: '2024-01-09T20:19:23.000Z'
pinned: false
---

This article provides a potential way to identify orphan IBM i jobs as a result of Database connection leaks in ASP.NET Web applications. We’ve written before about the perils of orphan IBM i jobs before. [This article](/en/kb/singleton-db-pattern) also discusses techniques for avoiding orphan jobs. [This article](/en/kb/use-sql-to-find-asp-net-orphan-jobs) provides some diagnostic help locating the cause of orphan jobs.

Orphan jobs are challenging to identify. In a large system with many users, it’s possible that you have some orphan jobs and don’t know it–and don’t care. However, it’s also possible that the occasional orphan job could cause intermittent, hard-to-find problems.

## The short story

If you are familiar with the challenge of finding ASP.NET job leaks that result in orphan jobs, scroll down to the "SQL to the rescue" subheading. Otherwise, put your tray tables in their upright and locked positions, fasten your seat belt, and lean in.

## The long story

Simon Hutchinson is an exceedingly clever RPG/SQL programmer and writes a great [RPG-related blog at RPGPGM.com](https://www.rpgpgm.com). One of Simon’s many specialties is SQL on the IBM i. While reading some of his work the other day I learned that SQL on the IBM i may help find orphan DataGate jobs on the IBM i.

Before we get to that SQL, let’s review a few points first.

*   You should understand DataGate connection pooling before continuing. If you need a connection pooling refresher course, [read this article](/en/kb/datagate-connection-pooling) before continuing with this article.
    
*   IBM i end-user jobs are always named DG8\_NET. Anytime you see an IBM i job named "DG8\_NET" you can be sure it’s an end-user job.
    
*   Assuming you’re using DataGate connection pooling correctly with your AVR for .NET ASP.NET Web application, you shouldn’t ever see very many DG8\_NET jobs associated with your Web app. Connection pooling lets a single IBM i job service _many_ users. The word "many" is this paragraph is a little nebulous because several conditions contribute to the scale of "many."Depending on how hard users are pounding on the Web app, it wouldn’t be surprising to see five IBM i jobs easily service 25-50 Web users on the low end, and maybe as many as 100 or more users.
    
*   You should _never_ see more active IBM i jobs than you have Web users on a production box. If you do, you can almost be sure your app is leaving behind orphan jobs.
    
*   Let’s consider a Web site with four users that’s used lightly for simple queries. It’s a little silly, but let’s assume that these four users never use the site concurrently. Under this scenario, and assuming all four users are using the same database name with the same user ID and password, there should only be one IBM i job running for these four users–and for any one request, that job is usually only running a couple of seconds, at most, to fulfill a user’s request. The usual life of an active DG job for a Web app is very, very short (often measured in milliseconds, not seconds). A request can last many seconds (minutes?) if the back end is doing highly intensive IO work, but that should happen only in very rare cases.
    
*   Another way to prove that your app isn’t causing orphan jobs is to stop every user from using your app and get your IBM i to a stage where there are no DG8\_NET jobs showing, you should be able to use every part of the app with only one IBM i job present on the IBM i. Anything more than a single IBM i job indicates a job leak. Beware, though, that if even one user sneaks in on your test, the results are worthless. For the best testing, consider using a dedicated DataGate Database Name with a unique testing user id. 
    
*   When you do WRKACTJOB to look at your DG8\_NET jobs, the jobs you see are almost always sitting dormant, waiting patiently for the chance to wake up and serve up a new response for a user. Note that to the IBM i, these dormant DataGate jobs are indeed active jobs, but they consuming zero CPU cycles and, if you closed files before the code-behind goes out of scope, don’t have any open files.
    
*   WRKACTJOB shows all DG8\_NET jobs, both dormant and active. Through the WRKACJOB lens, you can’t tell by looking if a DataGate jobs for Web apps are busy doing work or sitting dormant awaiting work. You could look for those jobs with more that zero CPU usage, but since the active job duration is so short, it’s very hard to capture an active DataGate job to investigate it.

#### SQL to the rescue

Given all that, the challenge to finding potentially orphan jobs is to be able to capture DG8\_NET jobs that are active _with_ open files. This is nearly impossible to do with WRKACTJOB. This is where [one of Simon’s SQL tricks](https://www.rpgpgm.com/2015/11/getting-active-jobs-data-using-sql.html) comes into play.

With your Web application active, and users pounding on it, open a 5250 emulator and enter the `STRSQL` command. Type in the SQL below and press enter:

```
SELECT JOB_NAME,OPEN_FILES,JOB_TYPE,JOB_STATUS, SUBSYSTEM
FROM TABLE(ACTIVE_JOB_INFO(DETAILED_INFO => 'ALL'))         
WHERE OPEN_FILES > 0 AND JOB_NAME_SHORT = 'DG8_NET'         
ORDER BY JOB_NAME
```
> This SQL includes only jobs that have opened files--assuming that a `Close *ALL` was used to close all files before a page goes out of scope. `Close *ALL` closes only files, it does not disconnect the DB connection. Change the the SQL to `OPEN_FILES = 0` to see active jobs with no open files (which could be argued is a better way to search for orphan jobs.)

This SQL lists all of IBM i jobs named DG8\_NET that have opened files. The SQL takes about 10 seconds or so to run. When it’s done it shows DG8\_NET jobs with open files:

![SQL results showing jobs with open files](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/sql-open-files.png)

>  [More info from IBM on ActiveJobInfo](https://www.ibm.com/docs/en/i/7.5?topic=services-active-job-info-table-function)

The body of the list is empty if there are no DG8\_NET jobs with open files. If you do catch an open job with the SQL, run the SQL again to see if you happened onto a job that hasn’t yet closed its files. In the ten seconds or so it takes the SQL to show potentially offending jobs, if a job is shown more than once, it’s probably an orphan job.

> The jobs listed aren’t necessarily ASP.NET-related jobs. If you have Visual RPG fat clients, those jobs will be shown, too.

The general rule is, if you’re using DataGate on the IBM i exclusively for ASP.NET Web apps, and the SQL above consistently shows the same job(s) in the list, you ASP.NET Web is probably leaking database connections and causing orphan jobs. If that’s the case, take note of the files opened as a clue as to where to start looking for the leak.

A IBM i job that is active doing work for a Web app (between form load and form unload) is only active for just a few seconds—maybe even milliseconds–before it is returned to the job pool. If the app is coded correctly, (ie closing all files and disconnecting from the DB before any page goes out of scope)  it’s unlikely that running the SQL provided would ever show any jobs with open files. It could be that it will catch one occasionally at just the right time to show it; but if things are running as expected you won’t see very many and if you do they should do away quickly. However, if you run this SQL say once every 10 seconds, and if you continually see jobs with open files listed (and especially if this list is growing) there is a place in your Web app where it isn’t closing files and disconnecting from the DB before a page goes out of scope.

Remember, too, that using DB connections in secondary classes in an AVR Web app is also likely culprit in creating orphan jobs with open files. [See this article for more information.](/en/kb/singleton-db-pattern)

## Conclusion

While this SQL may be helpful, it isn't definitive. It's just another tool to help you try to find orphan job leaks. 