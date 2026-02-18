import React from 'react';
import { Subject, Teacher, Specialization, SchoolInfo, ClassInfo, ScheduleSettingsData } from '../types';
import ScheduleSettingsPage from './schedule/ScheduleSettingsPage';

interface Props {
  subjects: Subject[];
  teachers: Teacher[];
  specializations: Specialization[];
  schoolInfo: SchoolInfo;
  classes: ClassInfo[];
  gradeSubjectMap: Record<string, string[]>;
  scheduleSettings: ScheduleSettingsData;
  setScheduleSettings: React.Dispatch<React.SetStateAction<ScheduleSettingsData>>;
}

const ScheduleSettings: React.FC<Props> = (props) => {
  return <ScheduleSettingsPage {...props} />;
};

export default ScheduleSettings;
