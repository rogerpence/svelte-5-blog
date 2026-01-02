---
title: Avoiding Outlook's mysterious horizontal lines
description: Avoiding Outlook's mysterious horizontal lines
date_created: '2025-06-26T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - outlook
---
To avoid Outlook's mysterious horizontal lines:
1. The HTML table structure with proper [cellPadding="0" cellSpacing="0" border="0"](vscode-file://vscode-app/c:/Users/thumb/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) attributes
2. The explicit border properties ([borderTop: "0", borderBottom: "0"](vscode-file://vscode-app/c:/Users/thumb/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html))
3. Proper Outlook-specific properties ([msoTableLspace](vscode-file://vscode-app/c:/Users/thumb/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html), [msoTableRspace](vscode-file://vscode-app/c:/Users/thumb/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html))
4. Clean text styling with minimal margins and paddings


```
<table
	cellPadding="0"
	cellSpacing="0"
	border="0"
	width="100%"
	style={{
		borderCollapse: "collapse",
		msoTableLspace: "0pt",
		msoTableRspace: "0pt",
	}}
>
	<tr>
		<td
			align="left"
			style={{
				width: "50%",
				padding: "10px 0 0 10px",
				borderTop: "0",
				borderBottom: "0",
			}}
>
			<Text
				style={{
					margin: 0,
					padding: 0,
					fontSize: "16px",
					lineHeight: "1",
				}}
>
				<Link
					style={{
						color: "#333",
						textDecoration: "underline",
						fontSize: "16px",
					}}
					href="https://asna.com/en"
>
					{introData.gotoText}
				</Link>
			</Text>
		</td>
		<td
			align="right"
			style={{
				width: "50%",
				padding: "10px 10px 0 0",
				borderTop: "0",
				borderBottom: "0",
			}}
>
			<Text
				style={{
					margin: 0,
					padding: 0,
					fontSize: "16px",
					lineHeight: "1",
				}}
>
				{introData.issue}
			</Text>
		</td>
	</tr>
</table>
```