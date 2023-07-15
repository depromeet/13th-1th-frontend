import { useMutation, useQuery } from '@tanstack/react-query';

import {
  fetchChallengeById,
  joinChallenge,
  searchChallengeList,
} from '@/service/challenge';
import { ChallengeFilter } from '@/shared/types/challenge';

import { challengeKeys } from './queryKey';

export const useChallengeQuery = (id: number) => {
  return useQuery({
    queryKey: challengeKeys.detail(id),
    queryFn: () => fetchChallengeById(id),
  });
};

export const useJoinChallenge = (id?: number) => {
  return useMutation({
    mutationFn: () => joinChallenge(id),
  });
};

export const useChallengeSearch = (filters: ChallengeFilter) => {
  return useQuery({
    queryKey: challengeKeys.list(filters),
    queryFn: () => searchChallengeList(filters),
  });
};
