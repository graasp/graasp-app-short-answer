import type { Database } from '@graasp/apps-query-client';
import {
  AccountType,
  AppItemFactory,
  CompleteMember,
  Context,
  LocalContext,
  MemberFactory,
  PermissionLevel,
} from '@graasp/sdk';

import { API_HOST } from '@/config/env';

export const mockMembers: CompleteMember[] = [
  MemberFactory({
    id: '1',
    name: 'current-member',
    email: 'a@graasp.org',
    type: AccountType.Individual,
    createdAt: new Date('1996-09-08T19:00:00').toISOString(),
    updatedAt: new Date().toISOString(),
  }),
  MemberFactory({
    id: 'mock-member-id-2',
    name: 'mock-member-2',
    email: 'b@graasp.org',
    type: AccountType.Individual,
    createdAt: new Date('1995-02-02T15:00:00').toISOString(),
    updatedAt: new Date().toISOString(),
  }),
];

export const mockItem = AppItemFactory({
  name: 'app-short-answer',
  creator: mockMembers[0],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const defaultMockContext: LocalContext = {
  apiHost: API_HOST,
  permission: PermissionLevel.Admin,
  context: Context.Builder,
  itemId: mockItem.id,
  memberId: mockMembers[0].id,
  accountId: mockMembers[0].id,
};

const buildDatabase = (members?: CompleteMember[]): Database => ({
  appData: [],
  appActions: [],
  members: members ?? mockMembers,
  appSettings: [],
  items: [mockItem],
  uploadedFiles: [],
});

export default buildDatabase;
