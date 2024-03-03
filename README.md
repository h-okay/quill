# Quill

![Quill](/public/quill.png)

### Introduction

Quill project allows users to upload PDF files and engage in conversations with a Language Model (LLM) customized with the content of the uploaded files.

### Getting Started

Check out live at [quill.hakanokay.dev](https://quill.hakanokay.dev)

You can test **Pro Plan** features without making any real payments during checkout:

- **Email:** Use the email you used signing up
- **Card Number:** 4242 4242 4242 4242.
- **Expiraton Date:** Use a valid future date, such as 12/34.
- **CVC:** Use any three-digit CVC (four digits for American Express cards).
- Use any value you like for other form fields.

### Technologies Used

- [React](https://react.dev/) - The library for web and native user interfaces
- [Typescript](https://www.typescriptlang.org/) - TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale
- [Next.js](https://nextjs.org/) - The React Framework for the Web
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework packed with classes
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs
- [Planetscale](https://planetscale.com/) - The ultimate MySQL database platform
- [Pinecone](https://www.pinecone.io/) - Pinecone serverless lets you deliver remarkable GenAI applications faster, at up to 50x lower cost
- [Uploadthing](https://uploadthing.com/) - File Uploads For Next.js Developers
- [Langchain](https://www.langchain.com/) - Applications that can reason. Powered by LangChain
- [Kinde](https://kinde.com/) - Auth for modern applications

### Installation

To install and run this project locally, follow these steps:

**Requirements**

- Node.js 18+
- Planetscale account + a MySQL database created on the platform
- Pinecone account + an index created on the platform
- Uploadthing account
- Kinde account

**After setting up the platforms, you can do the following:**

1. **Clone the repository and install the depencencies**

   ```bash
   git clone https://github.com/h-okay/quill.git
   cd quill
   npm/yarn/bun/pnpm install
   ```

2. **Setup the environment**

   Create an `.env` file and copy the contents of the `.env.template`, populate the fields by using the credentials you are given by the platform in the requirements.

3. **Run the application locally**

   After populating the `.env` file run the development server, open your web browser and navigate to http://localhost:3000

   ```bash
   npm run dev
   ```

### Feedback

Any feedback or suggestions are welcome. Please feel free to reach out to me via [email](mailto:hokay.ca@gmail.com).

### License

This project is licensed under the MIT License - see the LICENSE file for details.
