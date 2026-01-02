---
title: Clearing DataGate's DG8_VCAT72 library
description: DG8_VCAT72 is a cache library that all installed DG for IBM i instances user. This article discusses clearing DG8_VCAT72.
tags:
  - datagate-ibm-i
date_published: '2023-11-14T17:47:50.743Z'
date_updated: '2023-11-14T17:47:50.743Z'
date_created: '2023-11-14T17:47:50.743Z'
pinned: false
---

## Question

Can DataGate’s IBM i DG8_VCAT72 library be cleared? There are over 11,000 objects in this library, some dating back to 2016. Please help!

## Answer

The DG8_VCAT72 library is cache library that is shared by all installed instances of DataGate for IBM i.

It is OK to use CLRLIB with the DG8_VCAT72 library, but do that when there aren't any any active DataGate for IBM i users&mdash;otherwise the active users will immediately get a non-responsive app and those jobs will lock-up and need manual attention to remove. Except for very old versions of DataGate, this library is always named DG8_VCAT72. 

Under normal circumstances you don’t want to clear this library because it does significantly improve DataGate performance. However, there may be times where it has acquired a number of unused or stale cached file definitions or if your disk space is running so dangerously low that you need disk space. In that case, you can use CLRLIB (as explained above) to clear this library.

You may also need to clear DG8_VCAT72 if you get this error message:

`Acceler8DB Error: Corrupt file definition cache member.`

That error usually means the cache contains a corrupt member&mdash;probably as the result of an end-user job that ended abnormally. 

