import { api } from '../config/reducers/apiSlice';

export interface Practice {
  id: number;
  experiment_id: number;
  name: string;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ObjectCompetence {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Unity {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CompetenceArea {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Curriculum {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Competence {
  id: number;
  curriculum_id: number;
  competence_area_id: number;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
  competence_area: CompetenceArea;
  curriculum: Curriculum;
}

export interface Skills {
  id: number;
  competence_id: number;
  code: string;
  description: string;
  notes: string;
  created_at: string;
  updated_at: string;
  practices: Practice[];
  objects: ObjectCompetence[];
  unities: Unity[];
  competence: Competence;
}

export interface CreateSkillProps {
  code: string;
  description: string;
  notes: string;
  practices: number[];
  objects: string[];
  unities: string[];
}

export interface CreateSkills {
  curriculum_name: string;
  competence_area_name: string;
  competence_description: string;
  competence_code: string;
  skills: CreateSkillProps[];
}

export type UpdateSkillProps = Omit<CreateSkills, 'skills'> & {
  skill: CreateSkillProps;
};

export type UpdateSkill = Partial<UpdateSkillProps> & { id: number };

export const skillsApi = api.injectEndpoints({
  endpoints: (build) => ({
    allSkills: build.query<Skills[], void>({
      query: () => 'skills/all',
      providesTags: ['Skills'],
    }),
    curriculumName: build.query<Curriculum[], void>({
      query: () => 'curriculums/all',
    }),
    competenceAreaName: build.query<CompetenceArea[], void>({
      query: () => 'competenceAreas/all',
    }),
    allObjects: build.query<ObjectCompetence[], void>({
      query: () => 'skills/allObjects',
      providesTags: ['Objects'],
    }),
    allUnities: build.query<Unity[], void>({
      query: () => 'skills/allUnities',
    }),
    competencesName: build.query<
      Omit<Competence, 'competence_area' | 'curriculum'>[],
      { curriculum?: string; competenceArea?: string }
    >({
      query: ({ curriculum, competenceArea }) => ({
        url: 'competences/all',
        method: 'GET',
        params: {
          curriculum,
          competenceArea,
        },
      }),
      providesTags: ['Competences'],
    }),
    createSkill: build.mutation<void, CreateSkills>({
      query: (body) => ({
        url: 'skills/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Skills'],
    }),
    showSkill: build.query<Skills, number>({
      query: (id) => ({
        url: `skills/show/${id}`,
        method: 'GET',
      }),
      providesTags: ['Skills'],
      transformResponse: (response: Skills[]) => response[0],
    }),
    deleteSkill: build.mutation<void, number>({
      query: (id) => ({
        url: `skills/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Skills'],
    }),
    updateSkill: build.mutation<void, UpdateSkill>({
      query: (body) => ({
        url: `skills/update/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Skills'],
    }),
  }),
});

export const {
  useAllSkillsQuery,
  useCurriculumNameQuery,
  useCompetenceAreaNameQuery,
  useCompetencesNameQuery,
  useCreateSkillMutation,
  useAllObjectsQuery,
  useAllUnitiesQuery,
  useDeleteSkillMutation,
  useUpdateSkillMutation,
  useShowSkillQuery,
} = skillsApi;
