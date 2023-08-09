import { api } from '../config/reducers/apiSlice';
import { IDemand } from '../models/demands.model';
import { Experiment } from '../models/experiments.model';
import { Issue } from '../models/issues.models';
import { Release, ReleaseType } from './releases.service';

export type ExperimentDemand = Omit<IDemand, 'experiments' | 'demandLogs' | 'description'>;
export type ExperimentIssue = Omit<Issue, 'experiment' | 'issueComments'>;
export type ExperimentRelease = Omit<Release, 'experiment'>;
export type ExperimentReleaseResponse = Omit<Release, 'releaseType' | 'experiment'> & {
  releaseType: ReleaseType;
};

export interface ExperimentShow extends Experiment {
  demands: ExperimentDemand[];
  issues: ExperimentIssue[];
  releases: ExperimentRelease[];
  experiments: Experiment[];
  latest_english_release?: ExperimentRelease;
  latest_spanish_release?: ExperimentRelease;
  latest_android_release?: ExperimentRelease;
  latest_webgl_release?: ExperimentRelease;
}

export interface ExperimentShowResponse extends Experiment {
  demands: ExperimentDemand[];
  issues: ExperimentIssue[];
  releases: ExperimentReleaseResponse[];
  experiments: Experiment[];
  latest_english_release?: ExperimentRelease;
  latest_spanish_release?: ExperimentRelease;
  latest_android_release?: ExperimentRelease;
  latest_webgl_release?: ExperimentRelease;
}

export const experimentsApi = api.injectEndpoints({
  endpoints: (build) => ({
    allExperiments: build.query<Experiment[], void>({
      query: () => 'experiments/all',
      providesTags: ['Experiments'],
    }),
    showExperiments: build.query<ExperimentShowResponse, number>({
      query: (id) => `experiments/show/${id}`,
      providesTags: ['Experiments'],
      transformResponse: (response: ExperimentShow) => {
        const res: ExperimentReleaseResponse[] = [];
        response.releases.forEach((release) => {
          if (release.releaseType.length === 1) {
            res.push({ ...release, releaseType: release.releaseType[0] });
          }
          if (release.releaseType.length > 1) {
            release.releaseType.forEach((releaseType) => res.push({ ...release, releaseType }));
          }
        });
        return { ...response, releases: res };
      },
    }),
  }),
});

export const { useAllExperimentsQuery, useShowExperimentsQuery } = experimentsApi;
