import { syncApp } from '../../services/sync-app';
import { getParams } from './params';

export async function onPullRequestSynchronized() {
  const params = getParams();
  await syncApp(params);
}
