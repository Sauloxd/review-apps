import { syncApps } from '../../services/sync-apps';
import { getParams } from './params';

export async function onPullRequestSynchronized() {
  const params = getParams();
  await syncApps(params);
}
