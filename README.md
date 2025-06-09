# Strapi + Next.js POC

## Tech Stack

- Next.js 15 ( React 19 )
- Strapi 5
- Tailwind CSS 4
- TypeScript
- Pnpm as package manager
- Turbo as monorepo manager

## Project Structure

```plain
strapi-next
├── server
│   ├── src
│   │   ├── api                 # Strapi API routes
│   │   ├── components          # Strapi components
│   │   ├── config              # Strapi config
│   │   ├── content-types       # Strapi content types
│   │   ├── data                # Strapi data
│   │   ├── plugins             # Strapi plugins
│   │   ├── public              # Strapi public files
│   │   ├── routes              # Strapi routes
│   │   ├── scripts             # Strapi scripts
│   │   ├── services            # Strapi services
│   │   └── utils               # Strapi utils
├── next-app
│   ├── src
│   │   ├── app                 # Next.js app router
│   │   ├── app/components      # UI components
│   └── package.json
```
