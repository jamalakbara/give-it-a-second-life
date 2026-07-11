# Task 01: Project Scaffold

## Goal
Initialize the Next.js project with TypeScript, Tailwind CSS, design tokens, fonts, and the base layout shell.

## Scope
- In: create-next-app setup, fonts (Playfair Display + Inter), design tokens from `docs/DESIGN_SYSTEM.md`, base layout (header + footer shells)
- Out: page content, data layer, components beyond layout shell

## Checklist
- [x] Scaffold Next.js (TypeScript, ESLint, Tailwind, App Router, no src/, `@/*` alias) into project root keeping `docs/` and `.mcp.json`
- [x] Add Playfair Display + Inter via `next/font/google` (weights 400, 600)
- [x] Configure design tokens (colors, font sizes, spacing, radius) per DESIGN_SYSTEM §9
- [x] Base layout: sticky header shell + footer shell, max-width 1400px content container
- [x] `.env.local` with placeholders (`NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_ADMIN_PASSWORD`), `.gitignore` covers env files
- [x] `npm run dev` boots without errors
