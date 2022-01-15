import { render } from 'mustache';
import { Manifest } from '../../../../interface';
import { Card } from '../card/card';

const html = `
<div>
  <div class="row">
    <div class="col-sm">
      <h2 style="margin-top: 30px;">
        {{slug}}
      </h2>
    </div>
  </div>
  <div class="row">
    {{emptyPlaceholder}}
    {{> children}}
  </div>
</div>
`;

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
