import type { AgentPolicy } from "./contracts.js";

export function assertSkillAllowedForAgent(agent: AgentPolicy, skillName: string): void {
  if (!agent.allowedSkills.includes(skillName)) {
    throw new Error(`Skill ${skillName} is not allowed for agent ${agent.id}`);
  }
}
