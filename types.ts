export interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export enum JobSeekerSituation {
  SAME_ROLE_JUMP = '职场人-同岗位跳槽',
  CAREER_CHANGE = '职场人-转岗跳槽',
  GRADUATE_WITH_INTERNSHIP = '在校生-找实习',
  GRADUATE_NO_INTERNSHIP = '在校生-找正职',
}

export interface ResumeOutput {
  customizedResume: string;
  greetingMessage: string;
  companyName: string;
  positionName: string;
}
