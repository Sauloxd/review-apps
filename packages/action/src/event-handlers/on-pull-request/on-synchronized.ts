import { UserInput } from '../../interface';
import { syncApps } from '../../services/sync-apps';
import { getParams } from './params';

export async function onPullRequestSynchronized(userInput: UserInput) {
  const params = getParams();
  await syncApps(params, userInput);
}
