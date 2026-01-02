---
title: React Email nuggets mso outlook
description: React Email nuggets mso outlook
date_created: '2025-06-23T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - react-email
  - nuggets
---
## Use 'mso' special comments

```
<div
	dangerouslySetInnerHTML={{
		__html: `<!--[if mso]>
		<table cellspacing="0" cellpadding="0" border="0" width="100%">
			<tr>
				<td height="20" style="font-size:20px; line-height:20px;">&nbsp;</td>
			</tr>
		</table>
		<![endif]-->`,
	}}
/> 
```

## Pass children to a component

```
interface MyComponentProps {
    children: React.ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = ({ children }) => {
    return (
            <td
                valign="top"
                style={{
                    color: "#333",
                    fontSize: "16px",
                    lineHeight: "26px",
                }}
            >
                {children}
            </td>
        </tr>
    );
};
```

```
<MyComponent>
children here
</MyComponent>
```

## Test for props being provided

To negate the test and do something if a value is falsy, you can use the logical NOT operator (`!`). Here's how you would modify your code to do something when [bulletData.introText](vscode-file://vscode-app/c:/Users/thumb/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) is falsy:

Test for truthy

```
{bulletData.introText && (
    <Text style={{ ...styles.text, marginBottom: "2px" }}>
        Default intro text when no intro is provided
    </Text>
)}
```

Test for falsy 

```
{!bulletData.introText && (
    <Text style={{ ...styles.text, marginBottom: "2px" }}>
        Default intro text when no intro is provided
    </Text>
)}
```

You can also use a ternary operator to handle both cases (truthy and falsy):

```
{bulletData.introText ? (
    <Text style={{ ...styles.text, marginBottom: "2px" }}>
        {bulletData.introText}
    </Text>
) : (
    <Text style={{ ...styles.text, marginBottom: "2px" }}>
        Default intro text when no intro is provided
    </Text>
)}
```

The ternary approach is especially useful when you want to render different content based on the condition, rather than simply showing or hiding a component.

Both approaches let you conditionally render components when a value is falsy (undefined, null, empty string, 0, or false).


## An Outlook-specific spacer

This is wrapped in an HtmlComment component.

```
<HtmlComment
	text="<table><tbody><tr><td height='20px'></td></tr></tbody></table>"
	mso="true"
/>
```
``