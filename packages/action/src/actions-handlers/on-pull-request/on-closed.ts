import { removeApp } from '../../services/remove-app';
import { getParams } from './params';

export async function onPullRequestClosed() {
  const params = getParams();
  await removeApp(params);
}
