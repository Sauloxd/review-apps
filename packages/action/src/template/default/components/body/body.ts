import { render } from 'mustache';
import { Manifest } from '../../../../interface';
import { toHtml } from '../../to-html';
import { ReviewAppList } from '../review-app-list/review-app-list';

const html = toHtml(__dirname, 'body.html');

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
