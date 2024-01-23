import { ChangeEvent, useEffect, useMemo, useState } from 'react';

import { Box, Button, Grid, TextField, Typography } from '@mui/material';

import { Data, useLocalContext } from '@graasp/apps-query-client';
import { AppData } from '@graasp/sdk';

import isEqual from 'lodash.isequal';

import { hooks, mutations } from '@/config/queryClient';
import { PLAYER_VIEW_CY } from '@/config/selectors';
import SubmitButton from '@/modules/common/SubmitButton';

function isAnswer(appData: AppData): boolean {
  return appData.type === 'answer';
}

const PlayerView = (): JSX.Element => {
  const { permission } = useLocalContext();
  const { data: appContext } = hooks.useAppContext();
  const { data: appData } = hooks.useAppData();
  const { mutate: postAppData } = mutations.usePostAppData();

  // use effect to get required app data
  let savedAnswer = '';

  const [answer, setAnswer] = useState<string>(savedAnswer);

  useEffect(() => {
    if (appData) {
      const savedAnswerObject = appData?.find(isAnswer);
      if (savedAnswerObject) {
        savedAnswer = savedAnswerObject.data.answer;
        setAnswer(savedAnswer);
      }
    }
  }, [appData]);

  const disableSave = useMemo(() => {
    if (isEqual(savedAnswer, answer)) {
      return true;
    }
    return false;
  }, [answer, savedAnswer]);

  const handleChangeAnswer = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setAnswer(value);
  };

  const handleSubmitAnswer = (): void => {
    postAppData({ data: { answer }, type: 'answer', visibility: 'member' });
  };

  return (
    <div data-cy={PLAYER_VIEW_CY}>
      Player as {permission}
      <Box p={2} sx={{ mb: 20 }}>
        <pre>{JSON.stringify(appData, null, 2)}</pre>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8}>
            <TextField fullWidth value={answer} onChange={handleChangeAnswer} />
          </Grid>
          <Grid item xs={4}>
            <SubmitButton disabled={disableSave} handler={handleSubmitAnswer}>
              Submit
            </SubmitButton>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};
export default PlayerView;
