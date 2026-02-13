# FactoryFlow Solutions – Fault Management Prototype

This repository contains a **prototype web application** for FactoryFlow Solutions.  
The aim of the prototype is to explore **page structure, semantic HTML, and database-connected sections** before completing a full solution.

This is **not a finished system**. It is a learning and experimentation project.

---

## Project purpose

FactoryFlow Solutions works with manufacturing companies to help them report, track, and resolve factory faults.

This prototype focuses on:
- Structuring a page using semantic HTML
- Connecting a front end to a Supabase database
- Separating responsibilities across different sections of a single page
- Preparing space for future features such as status updates and messaging

---

## Folder structure

Your project must use this structure:

```

project-folder
│
├── index.html
│
└── static
├── style.css
└── app.js


- `index.html` contains all HTML and page sections
- `static/style.css` contains all styling
- `static/app.js` contains JavaScript for Supabase connection only

---

## Section overview (very important)

The page is divided into **six main sections** using semantic `<section>` elements.

### Section 1 – Fault Logging (CRUD)

This section is **already provided**.

It:
- Uses a form to submit fault data
- Inserts records into a Supabase table
- Displays a list of existing faults
- Demonstrates Create and Read functionality

You should:
- Understand how the form structure works
- Observe how data is sent to Supabase
- Avoid changing the core logic unless instructed

---

### Section 2 – Fault Report Viewer (Read + Filter)

This section is **already provided**.

It:
- Retrieves data from Supabase
- Filters results using conditions (similar to `SELECT … WHERE`)
- Displays results in a table format

You should:
- Understand how reports differ from input forms
- Observe how filtering changes the data returned
- Avoid adding validation or advanced logic at this stage

---

### Section 3 – Fault Status Updates (Content Design)

You must create this section.

This section should:
- Explain how customers can view fault progress
- Include headings, paragraphs, and lists
- Show what information users would expect to see

Examples of content:
- “Current fault status”
- “Last updated”
- “Assigned technician”
- “Estimated resolution time”

This section does **not** connect to the database yet.

---

### Section 4 – Messaging System (Content Design)

You must create this section.

This section should:
- Describe how customers and support staff communicate
- Include placeholder message examples
- Use semantic HTML only

Examples of content:
- Message threads
- Support replies
- Timestamps
- System notifications

This section is **design-only** at this stage.

---

### Section 5 – User Guidance and Help

You must create this section.

This section should:
- Help users understand how to use the system
- Provide clear instructions and tips
- Be written in plain, professional language

Examples:
- How to log a fault correctly
- What information to include
- What happens after a fault is submitted

---

### Section 6 – Company Information / Trust

You must create this section.

This section should:
- Build trust in FactoryFlow Solutions
- Explain services and expertise
- Use text and images appropriately

Examples:
- About the company
- Support availability
- Industry experience

---

## Rules for Sections 3–6

When completing Sections 3–6:
- Use semantic HTML (`<section>`, `<h2>`, `<p>`, `<ul>`, `<img>`)
- Keep content realistic and relevant to the scenario
- Do not connect these sections to Supabase yet
- Do not copy code from Sections 1 or 2
- Do not add JavaScript logic

These sections are about **structure, layout, and content planning**.

---

## Styling rules

- All styling must be in `static/style.css`
- Do not use inline styles
- Do not use `<style>` tags in HTML
- Keep styling consistent and readable

---

## JavaScript rules

- JavaScript must stay in `static/app.js`
- JavaScript should only handle Supabase connectivity
- No validation, no animations, no advanced logic yet

---

## What is being assessed

This prototype supports assessment of:
- Code organisation
- Use of semantic HTML
- Logical separation of features
- Preparation for Task 2 development

A clear structure now makes later development easier and more reliable.

---

## Next steps

Once Sections 3–6 are complete:
- Functionality will be expanded
- Status updates and messaging will be connected to the database
- Testing and iteration evidence will be added

Follow instructions carefully and commit your work regularly.
