# Portfolio

My personal portfolio website, featuring an interactive 3D desk scene in the Contact section.

**Live site:** [portfoliobyinsaffinser.vercel.app](https://portfoliobyinsaffinser.vercel.app)

<!-- Add a screenshot or GIF of the site here -->
<!-- ![Portfolio preview](./public/preview.png) -->

## Features

- **Interactive 3D contact scene**: a desk built with react-three-fiber where the laptop mirrors your message as you type, the envelope opens your email client, and desk props link to my socials (LinkedIn, GitHub, Instagram, Resume).
- **Working contact form**: messages are sent straight to my inbox via EmailJS.
- **Responsive design**: styled with Tailwind CSS.
- **Fast dev and build**: powered by Vite with hot module replacement.

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | React |
| Build tool | Vite |
| Styling | Tailwind CSS |
| 3D | three.js, @react-three/fiber, @react-three/drei |
| Email | EmailJS |
| Linting | ESLint |
| Hosting | Vercel |

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Installation

```bash
git clone https://github.com/Insaf-Finser/Portfolio.git
cd Portfolio
npm install
```

### Environment variables

The contact form uses EmailJS. Create a `.env` file in the project root:

```env
VITE_EMAILJS_SERVICE_ID=service_id
VITE_EMAILJS_TEMPLATE_ID=template_id
VITE_EMAILJS_PUBLIC_KEY=public_key
VITE_EMAILJS_TO_EMAIL=your_email
```

The `.env` file is ignored by Git. The EmailJS public key is intended for client-side use; do not put private credentials in `VITE_` variables.

### Run locally

```bash
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview
```

## Project Structure

```text
Portfolio/
├── public/          # Static assets (images, 3D models, resume)
├── src/             # Components, sections, and styles
├── index.html       # App entry point
├── vite.config.js   # Vite configuration
└── eslint.config.js # Lint rules
```

## Deployment

The site is deployed on [Vercel](https://vercel.com). Pushes to `main` trigger a new deployment. To deploy your own copy, import the repo in Vercel and add the environment variables above in the project settings.

## Roadmap

- Improve 3D models and lighting in the desk scene
- Add more project case studies

## Contact

- GitHub: [@Insaf-Finser](https://github.com/Insaf-Finser)
- Portfolio: [portfoliobyinsaffinser.vercel.app](https://portfoliobyinsaffinser.vercel.app)

## License

This project is open for reference. Add a license (for example MIT) if you want others to reuse the code.