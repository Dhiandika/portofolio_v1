---
title: "Why I Still Use Vanilla CSS"
publishedDate: "2026-02-16"
subtitle: "Frameworks are great, but understanding the core is better."
topics: ["Coding", "CSS", "Web Dev"]
canonicalUrl: "https://medium.com/@npemburu6/why-i-still-use-vanilla-css-dummy"
excerpt: "Tailwind is efficient, React is powerful, but sometimes you just need raw CSS variables and a dream."
coverImage: "/images/blog/hello-world.png"
---

## The Trap of Abstraction

We build layers upon layers of abstraction.
Tailwind > CSS.
React > DOM.
Next.js > Server.

But at the end of the day, the browser only speaks one language.

### Control the Chaos

When you write raw CSS, you own the chaos. You aren't fighting a framework's opinion; you are fighting the browser's rendering engine directly.

```css
.card {
    border: 4px solid #000;
    box-shadow: 8px 8px 0px #000;
    transition: all 0.2s ease;
}

.card:hover {
    transform: translate(-4px, -4px);
    box-shadow: 12px 12px 0px #000;
}
```

That's it. No `hover:shadow-xl` magic. Just physics and math.
