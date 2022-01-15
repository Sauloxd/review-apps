import { UserInput } from '../../interface';
import { removeApp } from '../../services/remove-app';
import { getParams } from './params';

export async function onPullRequestClosed(userInput: UserInput) {
  const params = getParams();
  await removeApp(params, userInput);
}
