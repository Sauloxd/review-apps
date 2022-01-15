import { getParams } from './params';
import { syncApps } from '../../services/sync-apps';
import { UserInput } from '../../interface';

export const onPush = async function onPush(userInput: UserInput) {
  const params = getParams();
  await syncApps(params, userInput);
};
