import { getParams } from './params';
import { syncApps } from '../../services/sync-apps';

export const onPush = async function onPush() {
  const params = getParams();
  await syncApps(params);
};
