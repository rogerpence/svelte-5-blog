---
title: AVR Classic and cloud environments
description: This article discusses considerations for moving an ASNA Visual RPG Classic application to a cloud provider.
tags:
  - visual-rpg
date_published: '2024-01-11T11:57:34.000Z'
date_updated: '2024-01-11T19:07:27.000Z'
date_created: '2024-01-11T19:07:27.000Z'
pinned: false
---

Over the last couple of years, the cloud has become a very desirable option for deploying enterprise applications. Lately, we’ve had a couple of customers deploy AVR Classic apps to the cloud–with mixed results. The cloud has gotten so popular that there are now many cloud providers. A partial list includes:

*   Amazon Web Services
*   Digital Ocean Cloud
*   Google Cloud Platform 
*   IBM Cloud
*   Microsoft Azure
*   Rackspace Managed Cloud Services

While conceptually similar, each of these cloud vendors has very different ways of doing things, different names for things, and varying levels of compatibility with older, COM-based applications.

AVR Classic was originally introduced more than 25 years ago. It was intended for traditional desktop environments–not modern cloud environments. The cloud injects many more variables into the deployment of what was intended to be a traditional, desktop application. 

We test our Classic products in their traditionally-intended desktop environments, not in cloud-based environments. We don’t have the expertise to test and certify our AVR Classic products when deployed to cloud environments, so therefore we do not support nor do we recommend using AVR Classic in cloud environments. 

Please beware that you may be able to use AVR Classic with your cloud vendor of choice, but many issues abound, including:

*   Deployment
*   Performance
*   Printing
*   Security
*   Third-party controls

Many of these issues are quite challenging to resolve, especially without having deep, first-hand experience with these environments. It’s prudent to consider hiring a qualified cloud specialist (for the specific cloud vendor you’ve selected) to help you. There are lots of knobs and dials to twist to get this right.

If you do choose to deploy your AVR Classic applications to a cloud-hosted service, we’ll do all that we can to help you, but please understand that it might not work and we don’t claim that it does.
