---
title: mso-email-two-column-component
description: mso-email-two-column-component
date_created: '2025-07-27T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - mso
---
Raw HTML from Gemini that renders two columns with text in the right and an image in the left. 

```
    <table
        role="presentation"
        border="0"
        cellpadding="0"
        cellspacing="0"
        width="600"
        style="max-width: 600px; border-collapse: collapse;"
    >
        <tbody>
            <tr>
                <td width="300" valign="middle" style="width: 300px; padding: 0; margin: 0; vertical-align: middle;">
                    <table
                        role="presentation"
                        border="0"
                        cellpadding="20"
                        cellspacing="0"
                        width="100%"
                        style="border-collapse: collapse;"
                    >
                        <tbody>
                            <tr>
                                <td style="font-family: Arial, sans-serif; font-size: 14px; line-height: 26px;">
                                    <p style="font-size: 24px; color=black">
                                        Your RPG applications face an uncertain future
                                    </p>
                                    <p>
                                        Your business depends on your core RPG applications to keep your business
                                        running. Can you keep them running when your RPG programming team retires?
                                    </p>
                                    <!-- <p style="margin: 0;">
                                        This is a paragraph of text that will appear in the left column of the email. It
                                        is now vertically centered to align with the image on the right.
                                    </p> -->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                <td width="300" valign="top" style="width: 300px; padding: 0; margin: 0;">
                    <table
                        role="presentation"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="border-collapse: collapse;"
                    >
                        <tbody>
                            <tr>
                                <td align="center" style="padding: 0;">
                                    <img
                                        src="https://asna-assets.nyc3.digitaloceanspaces.com/assets/landing-page/worried-man-with-caption.png"
                                        alt="worried man"
                                        width="290"
                                        style="display: block; width: 290px; max-width: 100%; height: auto;"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
```

Gemini produced this table to show a centered image

```
    <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tbody>
            <tr>
                <td align="center">
                    <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
                    <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="max-width:600px;"
                    >
                        <tbody>
                            <tr>
                                <td align="center" style="padding: 0px 0px 0px 0px;">
                                    <center>
                                        <img
                                            src={eData.globals.buttonRegisterToday.url}
                                            alt="Centered"
                                            width="200"
                                            height="60"
                                            style="display: block; border: 0;"
                                        />
                                    </center>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
                </td>
            </tr>
        </tbody>
    </table>

```