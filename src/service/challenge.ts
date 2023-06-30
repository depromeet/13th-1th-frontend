import {
  ChallengeFilter,
  ChallengeResponse,
  ChallengeSearchResponse,
} from '@/shared/types/challenge';

import { httpClient } from '.';

export const searchChallengeList = async (
  filters: ChallengeFilter,
): Promise<ChallengeSearchResponse> => {
  const { data } = await httpClient.get('/challenge/search', {
    params: filters,
  });
  return data;
};

export const fetchChallengeById = async (
  id: number,
): Promise<ChallengeResponse> => {
  const { data } = await httpClient.get(`/challenge/${id}`);
  return data;
};

export const joinChallenge = async (
  id?: number,
): Promise<ChallengeResponse> => {
  return httpClient.post(`/challenge/join/${id}`);
};