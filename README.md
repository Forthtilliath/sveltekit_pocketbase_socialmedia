# Code Share

A collaborative platform for sharing code snippets. Built with SvelteKit and powered by PocketBase.

## Technologies

- SvelteKit
- PocketBase
- TypeScript

## Usage

To get started, clone the repository:
```bash
git clone https://github.com/Forthtilliath/sveltekit_pocketbase_socialmedia.git code-share
```

Then, run the following command in the `code-share` directory:
```bash
npm install
```

Finally, launch the development server, in twice terminals:
```bash
npm run pb:server
```
```bash
npm run dev
```

You will need to create an account first in pocketbase admin. Create a ``.env`` file with the following content:
```bash
PRIVATE_POCKETBASE_EMAIL="EMAIL_USED_IN_POCKETBASE_ADMIN"
PRIVATE_POCKETBASE_PASSWORD="PASSWORD_USED_IN_POCKETBASE_ADMIN"
```
