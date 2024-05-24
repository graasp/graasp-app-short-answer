import { PLAYER_VIEW_CY } from '@/config/selectors';

import { UserAnswersProvider } from '../context/UserAnswersContext';
import QuestionView from '../question-view/QuestionView';

const PlayerView = (): JSX.Element => (
  <div data-cy={PLAYER_VIEW_CY}>
    <UserAnswersProvider>
      <QuestionView />
    </UserAnswersProvider>
  </div>
);
export default PlayerView;
