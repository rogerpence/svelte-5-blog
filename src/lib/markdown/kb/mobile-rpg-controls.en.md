---
title: ASNA Mobile RPG controls gallery
description: This article shows the user interface controls available with ASNA Mobile RPG.
tags:
  - mobile-rpg
date_published: '2024-01-11T11:57:34.000Z'
date_updated: '2024-01-11T22:05:30.000Z'
date_created: '2024-01-11T22:05:30.000Z'
pinned: false
---
[ASNA Mobile RPG] is a mobile application suite for the IBM i. It enables RPG programmers to create smartphone and tablet applications with nothing but ILE RPG. Mobile RPG provides a screen design aid on which you drag and drop various UI elements onto the screens you’re building. After creating the mobile displays they are exported to the IBM i as traditional display objects.

These exported display files are never seen by human eyeballs; rather they serve as a proxy for the mobile display file so you can compile an ILE RPG program against it. At runtime, IBM’s Open Access API redirects workstation files to the mobile display.

Mobile RPG’s controls do most of the heavy lifting, moving data to and from the mobile display. They encapsulate traditional display file behaviors (eg reacting to function keys and indicator-driven conditional behaviors), transport data, and present data to the user. The gallery below shows Mobile RPG’s controls and explains what they do.

* * *

## Navigation bar

![Mobile RPG navigation bar](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/mr-controls/DDSNavBar.png)

[Read docs](https://docs.asna.com/documentation/Help150/MobileRPG/_HTML/mrUnderstandingBarControls.htm)

The DDSNavBar provides a navigational bar that is placed on the display in the header and/or footer. It can have embedded buttons that cause function key presses to be recognized by the underlying RPG program.

* * *

## Button

![Mobile RPG button](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/mr-controls/DDSButton.png)

[Read docs](https://docs.asna.com/documentation/Help150/MobileRPG/_HTML/mrUnderstandingButtons.htm)

The DSSButton provides buttons associated with function key presses. For example, you can map an ‘F3’ key press to a button. The RPG can be programmed to react to that F3 key press (through either an associated response indicator or determining the key pressed through position 369 of the INFDS.) Buttons can be displayed with text, images, or icons (see immediately below).

* * *

## Icons

![Mobile RPG icons](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/mr-controls/DDSIcons.png)

[Read docs](https://docs.asna.com/documentation/Help150/MobileRPG/_HTML/mrUnderstandingIcons.htm)

The DDSIcon provides application icons. As a stand-alone control, icons are output only. However, when combined with the DDSButton control (described above) you can associate a function key press with them.

* * *

## Image

![Display things with Mobile RPG](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/mr-controls/DDSImage.png)

[Read docs](https://docs.asna.com/documentation/Help150/MobileRPG/_HTML/mrUnderstandingImageControls.htm)

The DDSImage control display images from either an IFS ASCII share on the IBM i or from a directory on the Windows Web server. The image name can be hardcoded or you can map an RPG field value to the image name.

* * *

## Input/Output fields

![Mobile RPG input fields](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/mr-controls/DDSCharField.png)

## Date Field Dropdown Selection

![Mobile RPG date field selector](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/mr-controls/DDSDateField.png)

[Read docs](https://docs.asna.com/documentation/Help150/MobileRPG/_HTML/mrUnderstandingASPXFields.htm)

Mobile RPG has a full complement of character, numeric, and date/timestamp fields. The DDSDateField provides a dropdown date picker. Fields can be input, output, or both. Each field is associated directly with a field in the RPG program. Like a traditional display file input field, Mobile RPG’s fields have conditional behaviors (eg position cursor or non-display) governed by RPG indicator values.

* * *

## Switch

![Mobile RPG switch](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/mr-controls/DDSSwitch.png)

[Read docs](https://docs.asna.com/documentation/Help150/MobileRPG/_HTML/mrUnderstandingSwitches.htm)

The DDSSwitch provides a slider switch, a common mobile idiom. The user can swipe the switch from one position to another with a finger swipe. It presents its on-off value as a single-character field to the RPG program.

* * *

## Google Map

![Mobile RPG Google Map](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/mr-controls/DDSGMap.png)

[Read docs](https://docs.asna.com/documentation/Help150/MobileRPG/_HTML/mrUnderstandingMaps.htm)

The DDSGMap displays a Google map. It presents itself to the RPG program as a simple subfile with a location column. By writing rows to its subfile, you can set as many locations as you’d like to see mapped. The image below shows the DDSGMap control in action. [See the code for this project.](https://github.com/ASNA/mr-ddsgmap-control)

![Google Map example](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/mr-controls/ddsgmap-example.png)

* * *

## Charts

![Mobile RPG chart](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/mr-controls/DDSChart.png)

Read docs

The DDSChart displays pie and bar charts. It presents itself to the RPG program as a simple subfile with a location column. By writing rows to its subfile, you can chart as many data points as needed.

* * *

## List

![Mobile RPG list](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/mr-controls/DDSList.png)

[Read docs](https://docs.asna.com/documentation/Help150/MobileRPG/_HTML/mrUnderstandingLists.htm)

The DDS List displays data in one of four ways:

*   navigable list
*   dropdown list
*   radio button list
*   checkbox list

It also presents itself to the RPG program as a simple subfile. This control is highly configurable with many options. It can display images in a row (as shown above) and, when it is presented in its navigable list form (which is probably its most frequent use) it has tappable zones. For example, in the image shown below, the artists’ names area is a tappable zone as is the chevron on the right. These tappable zones are associated with function keys and look to the RPG program like a regular function key press.

When presented as a list the DDSList is limited to one column of data (plus an optional image and chevron). See the DDSTable below for a grid with multiple columns.

![Mobile RPG list example](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/mr-controls/DDSList-short.png)

The top part of the image above shows the DDSList as a navigable list and the bottom shows it as a dropdown list.

<!--
*   [See this article for a detailed look at using the DDSList and several Mobile RPG components.](https://asna.com/us/articles/mr-controls/newsletter/2015/q2/ile-rpg-goes-free)
    
*   [See this article for a detailed look at using the DDSList to present a drop-down list.](https://asna.com/us/tech/kb/doc/mobile-rpg-dropdown)
*   
-->
    
## Table
   

![Mobile RPG table](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/mr-controls/DDSTable.png)

[Read docs](https://docs.asna.com/documentation/Help150/MobileRPG/_HTML/mrUnderstandingTables.htm)

The DDSTable presents data in a matrix of rows and columns, It is often used to show grid-based details (eg, part numbers, description, and bin number). Assigning a function key makes rows a tappable zone for selecting a row and doing something with it.

* * *

## Signature capture

![Mobile RPG signature capture](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/mr-controls/DDSSignature.png)

[Read docs](https://docs.asna.com/documentation/Help150/MobileRPG/_HTML/mrUnderstandingSignatures.htm)

The DDSSignatureCapture provides a way to capture signatures. Signatures are saved as images on either an IFS ASCII share on the IBM i or in a folder on the Windows Web server. The DDSSignatureCapture has all the necessary networking built-in to send the signature to its destination. Once you’ve captured a signature, you could later display in another part of the app with the DDSImage control.

* * *

## File Uploader

![Mobile RPG file uploader](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/mr-controls/DDSFileUploader.png)

[Read docs](https://docs.asna.com/documentation/Help150/MobileRPG/_HTML/mrUnderstandingUploaders.htm)

The DDSFileUPloader control lets the user send a file back to the server (where it’s stored on either an ASCII share of the IFS on the IBM i or in a folder on the Windows Web server). For example, a user could take a picture with the phone’s camera and then send that picture back to your app on the server. The control works with binary files such as PNG, GIF, JPG, and PDF and has all of the networking built-in.

* * *

## Link

![Mobile RPG link](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/mr-controls/DDSLink.png)

[Read docs](https://docs.asna.com/documentation/Help150/MobileRPG/_HTML/mrUnderstandingLinks.htm)

The DDSLink control provides hyperlinks (surfaced with the HTML anchor tag) for your mobile applications. These links can navigate to an external URL or to a URL internal to your app.

* * *

## Bar Code Reader

![Mobile RPG bar code reader](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/mr-controls/DDSBarCode.png)

[Read docs](https://docs.asna.com/documentation/Help150/MobileRPG/_HTML/mrUnderstandingBarCodes.htm)

The DDSBarCode control lets the user scan bar codes (including QR codes) with the phone’s camera. The scanned value is returned to the associated text box.

Because the DDSBarCode control needs to be tightly coupled with phone hardware, it requires the phone to be using the [ASNA Go](https://asna.com/us/products/mobile-rpg/asna-go) mobile app (available in either the Apple or Google stores). ASNA Go is a special-case browser for Mobile RPG that provides hardware access that exceeds what built-in browsers (ie, Firefox, Chrome, and Safari) provide.

* * *

### Controls with no UI

## Panel

The DDSPanel control provides a container for any of the other controls mentioned.

[Read docs](https://docs.asna.com/documentation/Help150/MobileRPG/_HTML/mrUnderstandingPanels.htm)

* * *

## Geo Location

The DDSGeoLocation control doesn’t have a UI. It works in the background to send the user’s GEO coordinates each time a record format is returned to the RPG program. Upon its first use, the user must authorize the use of the control, otherwise no GEO data is returned.

[Read docs](https://docs.asna.com/documentation/Help150/MobileRPG/_HTML/mrUnderstandingGeoloc.htm)
