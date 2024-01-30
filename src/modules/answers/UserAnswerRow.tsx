import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Tooltip } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { UserAnswerAppData } from '@/config/appData';
import { useSettings } from '@/modules/context/SettingsContext';

const UserAnswerRow: FC<{
  userAnswerAppData: UserAnswerAppData;
}> = ({ userAnswerAppData }) => {
  const { t } = useTranslation('translations', { keyPrefix: 'ANSWERS' });
  const { answer = '—' } = userAnswerAppData.data;
  const { answer: correctAnswer } = useSettings();

  const hasAnswer = !correctAnswer?.content;
  const isCorrect =
    answer === correctAnswer?.content ? (
      <Tooltip title={t('TABLE.TOOLTIP.CORRECT')}>
        <CheckIcon color="success" />
      </Tooltip>
    ) : (
      <Tooltip title={t('TABLE.TOOLTIP.INCORRECT')}>
        <ClearIcon color="error" />
      </Tooltip>
    );

  return (
    <TableRow>
      <TableCell>{userAnswerAppData.creator?.name}</TableCell>
      <TableCell>{answer}</TableCell>
      <TableCell>
        {hasAnswer ? (
          <Tooltip title={t('TABLE.TOOLTIP.UNDEFINED')}>
            <QuestionMarkIcon color="warning" />
          </Tooltip>
        ) : (
          isCorrect
        )}
      </TableCell>
    </TableRow>
  );
};

export default UserAnswerRow;
