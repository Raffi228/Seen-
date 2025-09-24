
export interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export enum JobSeekerSituation {
  REGULAR_UPDATE = '例行更新简历',
  SAME_ROLE_JUMP = '同岗位涨薪跳槽',
  CAREER_CHANGE = '转行转岗跳槽',
  GRADUATE_WITH_INTERNSHIP = '应届生有实习经验找工作',
  GRADUATE_NO_INTERNSHIP = '无实习经验找工作',
}

export interface ResumeOutput {
  customizedResume: string;
  greetingMessage: string;
}
