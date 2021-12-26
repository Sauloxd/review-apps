import { render } from 'mustache';
import { App } from '../../../../interface';
import { toHtml } from '../../to-html';

const html = toHtml(__dirname, 'card.html');

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
