import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Plugin } from "../../registry.js";
import { register as getPositioning } from "./tools/get-positioning.js";
import { register as getMessaging } from "./tools/get-messaging.js";
import { register as getCopywritingFormulas } from "./tools/get-copywriting-formulas.js";
import { register as getAwarenessStages } from "./tools/get-awareness-stages.js";
import { register as getPersuasion } from "./tools/get-persuasion.js";
import { register as getVoice } from "./tools/get-voice.js";
import { register as getBrandStrategy } from "./tools/get-brand-strategy.js";
import { register as getGtm } from "./tools/get-gtm.js";
import { register as getChannels } from "./tools/get-channels.js";
import { register as getGrowthModel } from "./tools/get-growth-model.js";
import { register as getAntiPatterns } from "./tools/get-anti-patterns.js";
import { register as brief } from "./tools/brief.js";
import { register as getVoiceOfCustomer } from "./tools/get-voice-of-customer.js";
import { register as getIcp } from "./tools/get-icp.js";
import { register as getPricing } from "./tools/get-pricing.js";

function register(server: McpServer): void {
  getPositioning(server);
  getMessaging(server);
  getCopywritingFormulas(server);
  getAwarenessStages(server);
  getPersuasion(server);
  getVoice(server);
  getBrandStrategy(server);
  getGtm(server);
  getChannels(server);
  getGrowthModel(server);
  getAntiPatterns(server);
  getVoiceOfCustomer(server);
  getIcp(server);
  getPricing(server);
  brief(server);
}

export const marketingPlugin: Plugin = {
  name: "marketing",
  register,
};
