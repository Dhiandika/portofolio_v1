---
title: "Hello World"
description: "Determines the greeting based on the time of day."
publishedDate: "2023-10-27"
tags: ["javascript", "console"]
---

```javascript
function greet() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

console.log(greet());
```
