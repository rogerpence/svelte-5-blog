---
title: Demo page for css
description: Astro notes
tags:
  - astro
  - powershell
  - cs
  - css
date_added: 2023-04-16
date_updated: 2023-04-16
date_published: 
pinned: false
---

This is the first line of text in the demo page used to tweak CSS for markdown documents. 

This is a paragraph [ASNA.com](https://asna.com) with an anchor tag. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 

- number one bullet
- number two bullet
- number three bullet

## This is a subheading

This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

```py
def load_template(template_file):
    full_template_path = os.path.join(DATA_PATH, TEMPLATES_PATH, template_file)
    if not os.path.exists(full_template_path):
        print_error(f'Template file not found: {template_file}')
        sys.exit(1)

    template_filename = os.path.basename(full_template_path)
    template_path = os.path.dirname(full_template_path)
    template_loader = jinja2.FileSystemLoader(searchpath=template_path, 
                                              encoding=ENCODING)
    template_env = jinja2.Environment(loader=template_loader, 
                                      lstrip_blocks=True, trim_blocks=True)
```    
  
<figcaption>Figure 1. Some code  </figcaption>

This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
