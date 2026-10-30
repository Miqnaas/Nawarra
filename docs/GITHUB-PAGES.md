# GitHub Pages

The production site is published to the repository's `gh-pages` branch. Vite uses relative asset URLs so the application works under `/Nawarra/` as well as on a root domain.

## One-time repository setting

Open https://github.com/Miqnaas/Nawarra/settings/pages and select:

- Source: **Deploy from a branch**
- Branch: **gh-pages**
- Folder: **/(root)**

Save. Once GitHub's Pages deployment completes, the expected address is:

https://miqnaas.github.io/Nawarra/

The address is not evidence of a completed deployment. Check the deployment status in repository settings or Actions. A private repository may require an eligible GitHub plan or visibility changes; do not change repository visibility without the owner's decision.

## Update the deployed build

Run `npm ci`, `npm test`, and `npm run build` from the source checkout. Publish the contents of `dist/` to the root of `gh-pages`, preserving that branch's history and any existing custom-domain `CNAME`. Include an empty `.nojekyll` file. Do not publish source files, dependencies, reference videos, or the full repository as the website artifact.

Pushing source to `main` alone does not refresh this branch-based deployment. There is no automatic deployment workflow installed.
