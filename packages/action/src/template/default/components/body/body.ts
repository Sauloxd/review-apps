import { render } from 'mustache';
import { Manifest } from '../../../../interface';
import { ReviewAppList } from '../review-app-list/review-app-list';

const html = `
<div class="container">
  <div class="row">
    <div class="col-sm">
      <h1 style="margin-top: 32px; margin-bottom: 16px;">
        {{pageTitle}}
      </h1>
    </div>
  </div>
  {{emptyPlaceholder}}
  {{> children}}
</div>
`;

export const Body = ({ reviewApps }: { reviewApps: Manifest }) => {
  const emptyPlaceholder =
    Object.keys(reviewApps).length === 0 ? 'No apps available yet' : '';

  return render(
    html,
    {
      pageTitle: 'Static review apps collection',
      emptyPlaceholder,
    },
    {
      children: ReviewAppList(reviewApps),
    }
  );
};
