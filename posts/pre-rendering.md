---
title: 'Two Forms of Pre-rendering'  
date: '2022-05-09'  
---

Next.js has two form of pre-rendering: **Static Generation** and **Server-side Rendering**.
The difference is in **when** it generates the HTML for the page.  

- **Static Generation** is the pre-rendering method that generates the HTML at **build time**.
The pre-rendered HTML is then __reused__ on each request.  
- **Server-side Rendering** is the pre-rendering method that generates the HTML on **each request**.  

Importantly, Next.js lets you **choose** which pre-rendering form to use for each page.
You can create a "hybrid" Next.js app by using Static Generation for most pages and using 
Server-side Generation for others.  
