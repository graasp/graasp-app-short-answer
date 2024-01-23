import { FC } from 'react';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { UserAnswerAppData } from '@/config/appData';

const UserAnswerRow: FC<{
  userAnswerAppData: UserAnswerAppData;
}> = ({ userAnswerAppData }) => {
  const { answer = '—' } = userAnswerAppData.data;
  return (
    <TableRow>
      <TableCell>{userAnswerAppData.creator?.name}</TableCell>
      <TableCell>{answer}</TableCell>
    </TableRow>
  );
};

export default UserAnswerRow;
