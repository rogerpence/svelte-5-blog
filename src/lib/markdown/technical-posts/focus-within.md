---
title: CSS focus-within pseudo selector
description: CSS focus-within pseudo selector
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - css
---
```
<!DOCTYPE html>
<html>
<head>
<title>01</title>
<meta charset="utf-8">
<link rel="stylesheet" href="style.css">
</head>
<body>

    <h1>Focus Within</h1>

    <div class="form-container">
        <input type="password" class="password" placeholder="Choose Password" />
        <div class="password-prompt">* Must use 3 digits, 4 letters, 1 caplized letter, 2 dogs, and 2.4 special characters</div>
    </div>

</body>
</html>
```

```
.form-container {
    position: relative;
    z-index: 2;
}

.password-prompt {
    opacity: 0;
    transition: all .5s ease-in-out;
    position: absolute;
    transform: translateY(40px);
    top: 40;
    z-index: 1;
    pointer-events: none;
}

.form-container:focus-within .password-prompt{
    opacity: 1;
    transform: translateY(5px);
}
```