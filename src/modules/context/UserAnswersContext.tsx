import {
  FC,
  ReactElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { AppData, PermissionLevel, PermissionLevelCompare } from '@graasp/sdk';

import debounce from 'lodash.debounce';
import sortBy from 'lodash.sortby';

import {
  AppDataType,
  UserAnswerAppData,
  getDefaultUserAnswerAppData,
} from '@/config/appData';
import { DEBOUNCE_SAVE_MS } from '@/config/constants';
import { hooks, mutations } from '@/config/queryClient';
import { UserAnswer, UserAnswerStatus } from '@/interfaces/userAnswer';

import { useSettings } from './SettingsContext';

type UserAnswersContextType = {
  userAnswer?: UserAnswer;
  setAnswer: (answer: string) => void;
  submitAnswer: () => void;
  deleteAnswer: (id?: UserAnswerAppData['id']) => void;
  allAnswersAppData?: UserAnswerAppData[];
  status: 'loading' | 'error' | 'success';
};

const defaultContextValue: UserAnswersContextType = {
  setAnswer: () => null,
  submitAnswer: () => null,
  deleteAnswer: () => null,
  status: 'loading',
};

const UserAnswersContext =
  createContext<UserAnswersContextType>(defaultContextValue);

export const UserAnswersProvider: FC<{
  children: ReactElement | ReactElement[];
}> = ({ children }) => {
  const { data, isSuccess, status } = hooks.useAppData<UserAnswer>({
    type: AppDataType.UserAnswer,
  });
  const [userAnswerAppData, setUserAnswerAppData] =
    useState<UserAnswerAppData>();
  const [allAnswersAppData, setAllAnswersAppData] =
    useState<UserAnswerAppData[]>();

  const cachePayload = useRef<UserAnswer>();
  // const debouncedPatch = useRef<ReturnType<typeof debounce>>();
  const { mutate: postAppData } = mutations.usePostAppData();
  const { mutate: patchAppData } = mutations.usePatchAppData();
  const { mutate: deleteAppData } = mutations.useDeleteAppData();
  const { permission, accountId } = useLocalContext();

  const { general } = useSettings();
  const { autosubmit } = general;

  const isAdmin = useMemo(
    () => PermissionLevelCompare.gte(permission, PermissionLevel.Admin),
    [permission],
  );
  useEffect(() => {
    if (isSuccess) {
      const allAns = data.filter(
        (d: AppData) => d.type === AppDataType.UserAnswer,
      ) as UserAnswerAppData[];
      setAllAnswersAppData(allAns);
      setUserAnswerAppData(
        sortBy(allAns, ['createdAt'])
          .reverse()
          .find((d) => d.account.id === accountId),
      );
    }
  }, [isSuccess, data, accountId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const patchCachedUserAnswer = useCallback(
    debounce((payload) => {
      patchAppData(payload);
    }, DEBOUNCE_SAVE_MS),
    [patchAppData],
  );

  const setAnswer = useMemo(
    () =>
      (answer: string): void => {
        const payloadData = {
          answer,
          status: autosubmit
            ? UserAnswerStatus.Submitted
            : UserAnswerStatus.Saved,
        };
        if (userAnswerAppData?.id) {
          // Eventually useless
          cachePayload.current = payloadData;
          patchCachedUserAnswer({
            ...userAnswerAppData,
            data: cachePayload.current,
          });
        } else {
          postAppData(getDefaultUserAnswerAppData(payloadData));
        }
      },
    [autosubmit, patchCachedUserAnswer, postAppData, userAnswerAppData],
  );

  const submitAnswer = useMemo(
    () => (): void => {
      if (userAnswerAppData?.id) {
        const payloadData = {
          ...userAnswerAppData.data,
          status: UserAnswerStatus.Submitted,
        };
        patchAppData({
          ...userAnswerAppData,
          data: payloadData,
        });
      } else {
        throw new Error('No answer to submit.');
      }
    },
    [patchAppData, userAnswerAppData],
  );

  const deleteAnswer = useMemo(
    () =>
      (id?: UserAnswerAppData['id']): void => {
        if (id) {
          deleteAppData({ id });
        } else if (userAnswerAppData) {
          deleteAppData({ id: userAnswerAppData?.id });
        }
      },
    [deleteAppData, userAnswerAppData],
  );
  const contextValue = useMemo(
    () => ({
      userAnswer: userAnswerAppData?.data,
      setAnswer,
      submitAnswer,
      allAnswersAppData: isAdmin ? allAnswersAppData : undefined,
      deleteAnswer,
      status,
    }),
    [
      allAnswersAppData,
      deleteAnswer,
      isAdmin,
      setAnswer,
      status,
      submitAnswer,
      userAnswerAppData?.data,
    ],
  );

  return (
    <UserAnswersContext.Provider value={contextValue}>
      {children}
    </UserAnswersContext.Provider>
  );
};

const useUserAnswers = (): UserAnswersContextType =>
  useContext(UserAnswersContext);

export default useUserAnswers;
