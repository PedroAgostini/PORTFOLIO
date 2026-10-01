# Security Policy

## Reporting a vulnerability

Please report security issues privately to `contatopedrodeagostini@gmail.com`.
Include the affected URL, reproduction steps and potential impact. Do not open a public issue for an unpatched vulnerability.

## Deployment baseline

The production build is static and contains no server-side application secrets. Vercel and Netlify deployments apply the security headers versioned in this repository. GitHub Pages provides HTTPS, while the document-level Content Security Policy supplies the protections that can be expressed without custom response headers.

