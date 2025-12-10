module.exports = {
  branches: ["develop", { name: "hotfix", channel: "hotfix", prerelease: "hotfix" }],
  repositoryUrl: "https://gitlab.forge.education.gouv.fr/orion/orion.git",
  plugins: [
    "@semantic-release/commit-analyzer",
    [
      "@semantic-release/exec",
      {
        prepareCmd: `.bin/product release:app \${nextRelease.version} push`,
      },
    ],
    [
      "@semantic-release/gitlab",
      {
        gitlabUrl: "https://gitlab.forge.education.gouv.fr",
        successComment: false,
        failComment: false,
      },
    ],
  ],
};
