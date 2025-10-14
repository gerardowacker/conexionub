export default async function getBaseUrl() {
    const vercelUrl = process.env.VERCEL_URL;
    const env = process.env.VERCEL_ENV;

    if (vercelUrl) {
        return `https://${vercelUrl}`;
    }

    if (env === 'development') {
        return 'http://localhost:3000';
    }

    return '';
}

export async function getDeploymentInfo() {
    const repoOwner = process.env.VERCEL_GIT_REPO_OWNER;
    const repoSlug = process.env.VERCEL_GIT_REPO_SLUG;
    const repoUrl = repoOwner && repoSlug
        ? `https://github.com/${repoOwner}/${repoSlug}`
        : null;

    return {
        repoUrl,
        commitAuthor: process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME ?? 'Desconocido',
        commitId: process.env.VERCEL_GIT_COMMIT_SHA ?? 'N/A',
        environment: process.env.VERCEL_ENV ?? 'development',
    };
}