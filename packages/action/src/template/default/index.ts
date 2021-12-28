import { layout } from './layout';
import { Manifest } from '../../interface';
import { Body } from './components/body/body';

export const defaultPage = (reviewApps: Manifest) => {
  const body = Body({ reviewApps })

  return layout({ children: body });
};
