import type { Plugin } from '@ai16z/eliza';
import { checkPatentCoverage } from './actions/checkPatentCoverage';

export const brolliPlugin: Plugin = {
  name: 'brolli',
  description: 'Patent risk assessment for blockchain projects using Brolli knowledge graph',
  actions: [checkPatentCoverage],
  evaluators: [],
  providers: [],
  services: []
};

export default brolliPlugin;

// Re-export action for direct use
export { checkPatentCoverage };

