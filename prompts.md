Obsidian uses two proprietary markdown schemas for local (stored within the Obsidian value as opposed to being an externally referenced URL) images and links. 

The Obsidian markdown files are read and compiled to HTML with MdxVex in sveltekit 2 application. 

Scan the incoming Obsidian markdown object and replace its original Obisdian images and links with the instructions provided below. 

Replace just the Obsidian image and link text--pass all other content through unchanged. 

This replacement should be performed render time with the svelte.config.js file--probably using the NPM 'unist-util-visit' package (but I am not sure about that). It may be easier to simply read the file and do a brute force regex replacement with captured values.

The 'remark-obisidian-image.js' file is an rather fixed solution for image tags. It isn't flexible enough is hard to debug. You can see how it's called in the 'svelte.config.js' file.

```
const mdsvexOptions = {
	extensions: ['.md'],
	remarkPlugins: [
		[
			replaceObsidianImageTags,
			{
				tagTemplate: imageTagTemplate
			},
			replaceObsidianLinkTags,
			{
				tagTemplate: imageLinkTemplate
			}

		]
	],
    ...
}
```

## images (image tags)

The obsidan syntax for an image is always

```
![[vacation_photo.png|A sunset view over the mountains|500x300]]
```

The inner brackets surround the image information (also surrounded by brackets) with up to three pipe (|) separated arguments (with optional whitespace between each argument).

- Argument 1 is the name of the image. This must be provided.- 
- Argument 2 is the alt text. This argument is optional.
- Argument 3 is the image text. This argument is optional and has two formats. It can be "nnnxnnn' or "nnn". The nnn is a one-to-three digit number and the x is a literal. The "nnnxnnn" format represents the width by height'; the "nnn" syntax represents the image width.  


Valid Obsidian image exmaples:

```
![[vacation_photo.png|A sunset view over the mountains|500x300]]
[[vacation_photo.png|A sunset view over the mountains|500]]
![[vacation_photo.png|A sunset view over the mountains]]
![[vacation_photo.png|500x300]]
![[vacation_photo.png||500]]
![[vacation_photo.png]]
```

Challenge #1. Convert all Obsidian image tags to a different syntax. 

For each Obsidian image tag encountered:

- step 1. Convert the Obsidian image link to a JSON object with this shape: 

```
{
    filename: "vacation_photo.png",
    altText: "A sunset view over the mountains",
    width: 500
    height: 300
}
```

for any absent key, the value should be null, otherwise the value is pulled from the Obisidian tag. 

- step 2. Write a function that accepts two arguments:

argument 1 is the Json object from step 1. 
argument 2 is a string with four replacable values. This string specifies the template for the text that will replace the Obsidian image tag. For example: 

argument 2 may look like this: 

const template = '<img src="{filename}" alt="{altText}" width="{width}" height="{height}">

The "alt", "width", and "height" attributes should be not be included if their corresponding value is null.

the function returns the string result of the value interpolation.

- step 3. Replace the original Obsidian image tag with the function's string result. 

### Links (anchor tags)

An internal Obsidian link has two pipe-separated arguments with this syntax: 

```
[[filename|linkText]]
```

- The first argument is the file name and it is required. 
- The second argument is the text to display for the link. This second argument is optional. If it is not provided the text to display is the file name value. 

For each Obsidian link tag encountered:

- step 1. Convert the Obsidian link to a JSON object with this shape: 

```
{
    filename: "my-markdow-doc.md",
    linkText: "Evaluating prime numbers",
}
```

If the linkText isn't provided its value should be null. 

-- step 2. Write a function similar to the one for images. This function accepts two arguments

argument 1 is the Json object from step 1. 
argument 2 is a string with four replacable values. This string specifies the template for the text that will replace the Obsidian link tag. For example: 

argument 2 may look like this: 

const template = '<a href="{filename}">{linkText}</a>'

the function returns the string result of the value interpolation (if linkText is null then use the filename as {linkText}).

- step 3. Replace the original Obsidian link tag with the function's string result. 

