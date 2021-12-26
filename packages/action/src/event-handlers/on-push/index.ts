import { getParams } from './params';
import { syncApp } from '../../services/sync-app';

export const onPush = async function onPush() {
  const params = getParams();
  await syncApp(params);
};
