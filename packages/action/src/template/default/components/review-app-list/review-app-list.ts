import { render } from 'mustache';
import { Manifest } from '../../../../interface';
import { toHtml } from '../../to-html';
import { Card } from '../card/card';

const html = toHtml(__dirname, 'review-app-list.html');

export const ReviewAppList = (reviewApps: Manifest) => {
  return Object.entries(reviewApps)
    .map(([slug, reviewApp]) => {
      const emptyPlaceholder =
        reviewApp.apps?.length === 0 ? 'No apps available yet' : '';

      return render(
        html,
        {
          slug,
          emptyPlaceholder,
        },
        {
          children: reviewApp.apps
            ?.map((app, index) => {
              return `
                  <div class="col-sm">
                    ${Card(app)}
                  </div>
                  ${
                    index % 4 === 3
                      ? `
                      <div class="w-100"></div>
                    `
                      : ''
                  }
                `;
            })
            .join('\n'),
        }
      );
    })
    .join('\n');
};
