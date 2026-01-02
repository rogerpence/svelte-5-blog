---
title: Increase web app performance with DataGate connection pooling
description: DataGate’s connection pooling is a way to reuse existing server-side jobs for ASP.NET web apps. This article explains how to use DG's connection pooling.
tags:
  - asp-net
  - datagate-ibm-i
  - visual-rpg
date_published: '2024-01-05T12:35:56.000Z'
date_updated: '2024-01-05T19:45:21.000Z'
date_created: '2024-01-05T19:45:21.000Z'
pinned: false
---

<script>
    import Image from '$components/text-decorators/Image.svelte'
</script>

DataGate's connection pooling is a way to reuse existing server-side jobs for ASP.NET web apps. This is especially important on the IBM i, where creating a new IBM i job is relatively time-consuming. With connection pooling, a user can get a web page up in a matter of milliseconds, without connection pooling it could take up to a few seconds for a user to be seeing a page.

> Note that while this DataGate feature is called "connection pooling" it is an IBM i job that provides the database connection to be pooled. In this article, a "pooled job" is the same thing as a "pooled connection."

Connection pooling applies to traditional ASP.NET web applications, it does not apply to Wings, Mobile RPG, or Windows applications. In these cases, any one user has an implicit ongoing IBM i job. While connection pooling has the most performance impact on web apps using the IBM i, DataGate connection pooling also applies to DataGate for SQL Server. You won't notice a dramatic performance improvement with SQL Server, but even at that DataGate connection pooling SQL Server helps minimize SQL Server processes.

AVR ASP.NET web applications present a web application to a user one page at a time. Think of any one page as a user's unit of work. When a user hits a page an IBM i job is acquired for the duration of that page. When that page ends the user is done with the IBM i job for that unit of work. Connection pooling provides relief for the IBM i server to continually spin up a new IBM i job every time a web page needs one.

## How to configure DataGate connection pooling

Connection pooling is generally enabled for a Database Name. To do this:

1. Open Visual Studio and click View-&gt;DataGate Explorer.
2. In the Database Names tree node, right-click the Database Name for which you want to enable connection pooling and click "Edit Properties."
3. In the dialog displayed (shown immediately below) click the "Pool Connections" checkbox and provide an Idle Timeout in Minutes value.

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/enabling-connection-pooling.png" alt="Configuring connection pooling" width="300" alignment="center" caption="Figure 1."/>

The idle timeout provides the time (in minutes) that a pooled connection persists before it is closed. More detail on this is provided later in this article.

## Why use DataGate job pooling?

Before configuring DataGate for connection pooling, let's consider what connection pooling is and why it is important for AVR ASP.NET web apps. To show how connection pooling works, let's consider an imaginary group of six IBM i jobs. In reality, the number of IBM i jobs available to an ASP.NET web app is much greater than six, but six is enough to understand how connection pooling works. We'll discuss connection pooling considering three users, Eric, Ginger, and Jack.

The illustration that follows assumes that all users are using exactly the same database name with exactly the same user profile and password. After explaining basic connection pooling, other database name considerations are discussed.

## No DataGate IBM i jobs active

This shows the web app is not active (it has no sessions active and nothing in memory) and it has no DataGate jobs associated with it. This is typically the state of a web app early in the morning before anyone first uses that day.

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/no-jobs.png" alt="No ASP.NET-related DataGate jobs running on the IBM i." width="200" alignment="center" caption="Figure 2."/>

## Eric requests a page

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/one-new-job.png" alt="Eric starts using the web app." width="200" alignment="center" caption="Figure 3."/>

Eric got to work first and fires up the web app to check a customer's balance. This causes DataGate to start a new job on the IBM i, as shown above in Figure 3.

## The IBM i job Eric's page used is now pooled

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/one-pooled-job.png" alt="One pooled IBM&nbsp;i job." width="200" alignment="center" caption="Figure 4."/>

When Eric's page ends, the AVR code disconnects his job. This typically happens in the`Page_Unload` event with this code (where DBDG is the name of the active AVR DclDB object):

```
BegSr Page_Unload Access(*Private) Event(*This.Unload)
    DclSrParm sender Type(*Object)
    DclSrParm e Type(System.EventArgs)

    Close *All
    Disconnect DGDB
EndSr
```
If the DclDB's database connection is using pooled connections, the AVR Disconnect operation tells DataGate not to end the associated IBM i job but rather assign it to a list DataGate maintains of pooled jobs. When you configure connection pooling, you assign an idle timeout value (in minutes) to keep pooled jobs alive. Each time a pooled job is active, its idle timeout value is renewed. If a pooled job isn't called upon before its idle timeout value expires, it ends. (The idle timeout value is typically set to the same value as the ASP.NET session timeout value-but the two values don't have to be the same).

It is important to close all files before disconnecting a pooled job. In some cases, if you fail to close files first before disconnecting you may leave pending record locks or cause other resource contention with files left open.

> Pooled DataGate jobs consume virtually no resources on the IBM i.

## Orphaned job IBM i jobs

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/one-orphan-job.png" alt="An orphan DataGate IBM i job." width="200" alignment="center" caption="Figure 5a."/>

Not disconnecting DclDB objects before the ASPX page goes out of scope results in orphaned IBM i jobs. ("out of scope" means before the page ends; the Page\_Unload event is your last chance to disconnect a DclDB object before the page goes out of scope). You usually won't look at WRKUSRJOB or WRKACTJOB in time to see a single orphaned job; rather you'll see many of them. Each time a page is requested that doesn't disconnect the DclDB object, another orphaned job is created.

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/all-oprhan-jobs.png" alt="Lots of orphaned jobs." width="200" alignment="center" caption="Figure 5b."/>

Orphaned jobs are often found simply by accident. Consider a 12-page web app that has 11 well-behaved pages that appropriately disconnect the DclDB object. However, on one page the disconnect was forgotten. That one page generates an orphaned job each time it's used.

Disconnecting the DclDB is the action that pools a job into idle, pooled status. If you don't disconnect properly, orphaned jobs aren't pooled and don't end until you either explicitly end them on the IBM i or when the ASP.NET session associated with the orphaned job expires.

Orphaned jobs don't generally cause much trouble, but it's sloppy to have them hanging and with a little programming diligence they aren't necessary. It's also possible to have           *many*           orphaned jobs. Even if their physical presence isn't doing anything particularly harmful, their presence is at the very least highly disconcerting. To avoid orphaned IBM i jobs, take great care to disconnect           *every*           DclDB object before a page goes out of scope. (See           Using the Singleton DB Pattern to avoid orphaned IBM i jobs           for more information).

## Testing for orphaned jobs before your deploy your ASP.NET application

Here is a good way to test for orphaned jobs before you deploy the ASP.NET web to production:

1. Deploy the app to a test server (or, if you can't do that, run it from inside Visual Studio).
2. Ensure that connection is enabled for the DclDB connection.
3. Ensure you are the only person using the app.
4. Start a new instance of the web app and use every page in every way possible.
5. Check WRKACTJOB or WRKUSRJOB frequently on the IBM i as you are testing the app. You should
               *never*
               see more than one job appear as you are using the app. If you do, you've got a job leak-you forgot to disconnect in at least one place.

> It's critical that for this test there should only be one user using the web app. It's really hard to ensure one user on a deployed web app so this test is best done in a controlled environment like a test server or even running the app from within Visual Studio.

Read about an ASNA DataGate logging configuration option           that may be helpful in identifying the cause of orphan jobs.

## Eric and Ginger both request web pages within milliseconds of each other

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/one-new-one-pactive.png" alt="One new job (the green one) and one pooled job (the blue one) running." width="200" alignment="center" caption="Figure 6."/>

At the same time (or quite nearly) Eric clicks a button to see another page of the web app, Ginger also requests a page. This causes the previously-pooled job to be assigned to either Eric or Ginger and a new IBM i job is created for whoever didn't get the pooled job. One of the two users will see the web page quicker than the other (because one is using a pooled job and one is waiting on a new job to spin up).

With ASP.NET stateless web apps, pages come and go very quickly-often measured in milliseconds. It's possible that Eric and Ginger could do lots of work with ease using the same pooled job. They would both have to submit page requests at nearly the exact same time to cause the scenario shown in Figure 5. That is unlikely, but especially with two users, it could (and does) happen.

It's important to note that Eric won't necessarily get the job he originally caused to be started. In traditional, shared database name connections, jobs aren't considered "owned" by any one user, rather they are considered shared resources available to any user. (See the Database Name considerations section below for more on this).

## There are now two pooled IBM i jobs

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/two-pooled.png" alt="After Eric and Ginger’s pages end, there are two pooled jobs." width="200" alignment="center" caption="Figure 7."/>

Once Eric and Ginger's pages end (assuming both disconnected the DclDB object) there are now two pooled jobs on the IBM i. This means that as long as Eric and Ginger are the only two using the web app, both are assured instantaneous page displays using pooled jobs. Neither will have to wait for an IBM i job.

## Eric, Ginger, and Jack each request web pages within milliseconds of each other

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/two-pactive-one-active.png" alt="One new job (the green one) and two pooled jobs (the blue one) running." width="200" alignment="center" caption="Figure 8."/>

## There are now three pooled IBM i jobs

<Image src="https://nyc3.digitaloceanspaces.com/asna-assets/asna-com/kb/three-pooled.png" alt="After Eric, Ginger, and Jack's pages end, there are three pooled jobs." width="200" alignment="center" caption="Figure 9."/>

At the same time (or quite nearly), Eric, Ginger, and Jack all three request a page of the web app. The two previously-pooled are assigned to the first two requests and a third new IBM i job is created for the other request. Once again, it isn't determinate which users get the two pooled jobs. It's quite possible it could be Jack. No one of the three users, who are all using an app that uses the same database name, has a claim for a specific job.

As you can imagine, it's not likely that our three users would each request a page within a millisecond of each other. But again, it could, and probably will happen. The more pooled jobs acquired, the less likely it is that new jobs are needed. Depending on the type of work being done with the web app, it's not unreasonable to expect that 10 to 25 users could work all morning with just one pooled job. As the density of keystrokes increases, the need for more pooled jobs also increases. While the figures for this article show a maximum of six pooled jobs, that was an arbitrarily selected number for illustration purposes. In the real world, the only limit to the number of jobs that DataGate can start is the workload capacity of the IBM i.

By the time ten jobs are pooled, you can expect the rate at which new jobs are pooled to dramatically reduce. For a busy office with 100 users doing moderately intensive work, it's quite reasonable to expect to see less than ten pooled jobs. The value of this job scheme is that it is essentially self-scaling on the way up; if a job is needed, another can be created and then it gets added to the pool.

This scheme also scales itself on the way down as well. As periods of inactivity increase, the job pool shrinks as needed. After a pooled job's associated timeout value expires DataGate ends the job. Consider an app that is run during normal business hours (few are, but play along!). Assuming the pooled job timeout is 20 minutes, in 20 minutes (or so) all pooled jobs will have ended.

## Connection pooling and security regulations

DataGate uses the DataGate Database Name and its user ID (and other Database Name properties) to uniquely identify jobs for connection pooling. Typically, web apps use a single Database Name with a single set of user credentials for all users. For example, you might have a Database Name called "IBMProduction" associated with the IBM i user `WebUser` and `WebUser's`     IBM i password. In this scenario, all users will share IBM i jobs associated with WebUser`.

For many small and medium-sized business websites, the single database name model still works fine, but larger businesses working under more strict security regulations may not be able to use a single database name. An alternative scheme for these larger uses is to create three database names that effectively provide different user classes. For example:

1. Create one Database Name for read-only users. This Database Name could be "ROUSER" (for a read-only user). This would be associated with an IBM i user account that is granted only read-only access to critical IBM i resources.

2. Create a second Database Name for read/write basic users. This Database Name could be "RWUSER" (for a read-write user). This would be associated with an IBM i user account that is granted read-write access to some IBM i resources but not especially sensitive objects.

3. Create a third Database Name for super users. This Database Name could be "SUUSER" (for superuser). This would be associated with an IBM i user account that has read/write access for all IBM i objects.

Connection pooling would then work across each "class" of user. Read-only users would use the pooled read-only jobs, read-write users would use the pooled limited read-write jobs, and super users would use the pooled unlimited access jobs. This scheme would increase the amount of IBM i pooled jobs, but still provide good use of IBM i resources and provide very good performance.

On some occasions, you may need to override the IBM i user profile and password for a very sensitive website task. This is easy to do and while it limits some of the benefits of connection pooling, it still provides the best experience that a specific user has because that user always gets her specific pooled job back. For example, in the code below, the web app prompts for an IBM i user profile and password. These values are used to override the user and password of the read-only user database name. When it connects, the permissions associated with the credentials apply.

```
    DclDb SpecialUser DBName(ROUSER)  

    SpecialUser.User = UserName
    SpecialUser.Password = UserPassword

    Connect SpecialUser
    // Open files
    // Do lots of work
    Close *All
    Disconnect SpecialUser
```
This user's job is pooled for only for that user. So once the job is opened for that use, it is pooled for the user while the user is active.

If your business is governed by strict security regulations (such as those imposed by Sarbanes/Oxley in the US) be sure to check with your security auditors for what they recommend as best practices regarding website user login.

## DataGate connection pooling best practices

- Use connection pooling for AVR for .NET ASP.NET websites. It doesn't help with Wings, Mobile RPG, or AVR Windows applications.
- Use connection pooling with websites using either DataGate for IBM i or DataGate for SQL Server.
- Every database connection (the DclDB object) that gets connected must be explicitly disconnected before the page goes out of scope (the last possible place to disconnect is the Page\_Unload event).
- Be especially aware of database connections in AVR classes used from the ASPX page's code behind. Database connections must also be disconnected in adjunct classes before the class goes out of scope-otherwise, you're spawning orphan jobs. For more on this topic,                     see this article about the singleton DB pattern                     .
- Be sure to close all files associated with a connection before disconnecting. The easy way to do this is using                     `
                         Close *ALL
                    `                     ; don't try to keep track of what files are or are not opened. Just close all of them.
- Analyze your AVR for .NET web apps careful for IBM i job usage before you deploy them. It's much easier to check for orphaned IBM i jobs in a controlled, single-user environment.
- If your business is governed by strict security regulations (such as those imposed by Sarbanes/Oxley in the US) be sure to check with your security auditors for what they recommend as best practices regarding website user login.
