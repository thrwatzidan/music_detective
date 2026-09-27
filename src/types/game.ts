export type PerformanceType = 
  | 'instrumental_solo'   // أداء آلي منفرد
  | 'instrumental_group'  // أداء آلي جماعي
  | 'vocal_solo'         // أداء غنائي منفرد
  | 'vocal_group';       // أداء غنائي جماعي (الكورال)

export type GameMode = 'mixed' | 'visual' | 'audio';

export interface PerformanceInfo {
  id: PerformanceType;
  title: string;
  shortTitle: string;
  badge: string;
  icon: string;
  colorName: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  accentClass: string;
  description: string;
  conceptRule: string;
  keywords: string[];
}

export interface RoundData {
  id: number;
  mode: 'visual' | 'audio' | 'mixed';
  type: PerformanceType;
  title: string;
  subtitle: string;
  boyPrompt: string;
  scenarioDescription: string;
  instrumentOrPerformer: string;
  visualSceneType: 'organ_solo' | 'band_group' | 'singer_solo' | 'choir_group' | 'oud_solo' | 'orchestra_group' | 'school_solo_singer' | 'children_choir';
  audioTrackType: 'solo_organ' | 'group_ensemble' | 'solo_voice' | 'choir_harmony' | 'solo_oud' | 'brass_orchestra';
  successMessage: string;
  hintMessage: string;
  explanation: string;
}

export type SchoolStation = {
  id: number;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  targetStars: number;
};
