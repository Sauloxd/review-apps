import { render } from 'mustache';
import { App } from '../../../../interface';

const html = `
<div class="card" style="width: 18rem;">
  <div class="card-body">
    <h5 class="card-title">{{name}}</h5>
    <h6 class="card-subtitle mb-2 text-muted">#{{headCommitShort}}</h6>
    <h6 class="card-subtitle mb-2 text-muted">{{updatedAt}}</h6>
    <a href="{{href}}" class="card-link">App</a>
    {{> children}}
  </div>
</div>
`;

export const Card = (app: App) =>
  render(
    html,
    {
      name: app.name,
      headCommitShort: app.headCommitId.slice(0, 12),
      updatedAt: app.updatedAt.toLocaleString(),
      href: app.href,
    },
    {
      children: app.pullRequestUrl
        ? render(
            `
          <a href="{{pullRequestUrl}}" class="card-link">Pull Request</a>
        `,
            { pullRequestUrl: app.pullRequestUrl }
          )
        : '',
    }
  );
