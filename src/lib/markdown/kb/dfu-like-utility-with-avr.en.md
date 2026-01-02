---
title: Emulating DFU with ASNA Visual RPG
description: 'This small ASNA Visual RPG Windows project shows a way to build a simple Data File Utility (DFU)-like program with AVR. '
tags:
  - visual-rpg
date_published: '2024-01-11T11:57:34.000Z'
date_updated: '2024-01-11T18:27:16.000Z'
date_created: '2024-01-11T18:27:16.000Z'
pinned: false
---

This small ASNA Visual RPG Windows project shows a way to build a simple Data File Utility (DFU)-like program with AVR. This is a very simple project and a good one for first-time AVR coders to spend time with.

[Full project on GitHub](https://github.com/ASNA/avr-windows-dfu-example)

[Download project zip file from GitHub](https://github.com/ASNA/avr-windows-dfu-example/archive/main.zip)

[See fully annotated source code](https://asna.github.io/avr-windows-dfu-example/Form1.vr.html)

![Enter a customer number](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/screen-1.png)

Figure 1a. Enter a customer number

![Update customer number](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/screen-2.png)

Figure 1b. Update customer information

#### A bonus for the adventurous coder

The text above includes a link to this project’s annotated source code ([here is that link again](https://asna.github.io/avr-windows-dfu-example/Form1.vr.html)). That annotated code is created directly from the project’s source code with an open-source Python-based tool called [Pycco](https://github.com/pycco-docs/pycco).

Pycco is one of many projects derived from the JavaScript-based [Docco](http://ashkenas.com/docco/) project which generates documentation (annotated code, really) from source. Pycco is Docco written in Python.

Using Pycco, this source code:

```
// ### Copy fields record format fields to input fields
BegSr PopulateUIFromRecord
    txtCMName.Text     = Cust_CMName.Trim()
    txtCMAddr1.Text    = Cust_CMAddr1.Trim()
    txtCMCity.Text     = Cust_CMCity.Trim()
    txtCMState.Text    = Cust_CMState.Trim()
    txtCMPostCode.Text = Cust_CMPostCode.Trim()        
    // Input fields in .NET Windows forms apps are always text. They need to be 
    // converted to and from source and target values. Cust_CMFax is a numeric value.
    // The .NET's ToString() method used to format the numeric value to a desired
    // string format. [Read about .NET's custom numeric format strings here](https://docs.microsoft.com/...)

    txtCMFax.Text      = Cust_CMFax.ToString("(000) 000-0000") 
    txtCMPhone.Text    = Cust_CMPhone.Trim()
EndSr
```

Produced this portion of the annotated code:

![A Pycco-generated document fragment](https://nyc3.digitaloceanspaces.com/asna-assets/images/articles/pycco.png)

Pycco reads your source and uses its comments to generate the annotations. Comments can be formatted with Markdown. For example, this line of code

```
// ### Copy fields from inputs fields to record format fields`
```

translates to an H3 tag in the code annotation (in Markdown, "###" translates to the H3 tag):

```
<h3>Copy fields from inputs fields to record format fields</h3>`
```

You can read more about [Markdown syntax here](https://www.markdownguide.org/). Visual Studio Code has great Markdown support–I use it and Markdown for virtually all of the writing I do. As you read the [raw code here](https://github.com/ASNA/avr-windows-dfu-example/blob/main/Form1.vr) you’ll notice that Markdown has a simple syntax for inserting things such as images and links.

You need to have Python and Pycco installed on your PC. See [python.org](https://www.python.org/) for how to get and install Python (it’s free). Instructions for installing custom modules (such as Pycco) [are here](https://docs.python.org/release/3.9.1/installing/index.html). (An older version of Python may already be present on your Windows PC. If so, you could try using it–but generally, it’s better to install Python 3.9x).

To annotate one of your projects, copy the Pycco folder from this project (use the download zip file link near the top of the article) into the root of your AVR project. Then from the `pycco` folder run the `annotate-code.bat` batch file from a command line. That command produces a `pycco-docs` folder with your source code annotated in HTML files. A top-level directory of source members (with your folder structure preserved) is in the file named `master_index.html.`

The `run-pycco.py` Python script in the `pycco` directory does the work of annotating your source.

Near the end of that script you’ll see these two lines:

```
cmd = f'pycco {file} -d ./pycco-docs -l javascript -p'           os.system(cmd)
```

This Python code results in the command line:

```
pycco {file} -d ./pycco-docs -l javascript -p'
```

being run for each file in your project (where `{file}` is the name of a source member in your project). This line calls Pycco for each project member and is what generates its annotated HTML file.  Pycco supports many languages, but unfortunately, it doesn’t support AVR directly. However, AVR comment rules match JavaScript’s so the `-l` flag tells Pycco to use JavaScript commenting rules.

To determine the files for Pycco to process, the `run-pycco.py` script uses this Python structure (formally, it’s a Python tuple):

```
searches = ('global.asax', 'web.config', '*.aspx', '**/_.aspx', '_.vr', '**/_.vr', 'app_code/_.vr' )
```

This structure names either specific files or directories. For example, the `*_/_.vr` syntax includes any files with a `.vr` extension in any folder.

Another tuple specifies found files to exclude:

```
ignored_files = ('^._designer.vr', '^._assemblyinfo.vr')       
```

This tuple causes any file ending in either `designer.vr` or `assemblyinfo.vr` to be excluded.

I tweaked the Pycco CSS a little to get the green and blue bars on the annotation.

I’m not a fan of overly commented code and Pycco comments certainly fall into that category. However, there may be merit in a team following some good coding conventions and making their annotated code available–and Pycco is great for published, teaching-style code.

It’s beyond the scope of this article, but to make the Pycco-generated annotated pages available on the Web, I’m using a cool feature of GitHub called [GitHub Pages](https://pages.github.com/) to provide what is essentially a static site host for HTML pages. With just a batch file I can commit project changes to Git, generate the Pycco files, and then push both the project and Pycco changes up to GitHub. GitHub is truly one of the modern wonders of the world!

I know this Pycco section is out in the weeds for many of you, but thought I would include it for the curious (and I got tired of trying to find the last project for which I did this and figuring out how to do it again. Now I have a little documentation.)