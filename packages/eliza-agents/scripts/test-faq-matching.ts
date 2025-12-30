import { classifyTopicByKeywords } from '../src/faq';

console.log('🧪 Testing FAQ Keyword Matching\n');

const testQueries = [
  { query: "What's my patent risk for stablecoins?", expectedTopic: "patent_risk_assessment" },
  { query: "How do you calculate risk scores?", expectedTopic: "risk_score_explanation" },
  { query: "How much do patent settlements cost?", expectedTopic: "settlement_costs" },
  { query: "What does US12095919B2 cover?", expectedTopic: "us12095919b2_coverage" },
  { query: "What is Brolli?", expectedTopic: "what_is_brolli" },
];

let passed = 0;
let failed = 0;

for (const { query, expectedTopic } of testQueries) {
  const result = classifyTopicByKeywords(query);
  const status = result === expectedTopic ? '✅' : '❌';
  
  if (result === expectedTopic) {
    passed++;
  } else {
    failed++;
  }
  
  console.log(`${status} Query: "${query}"`);
  console.log(`   Expected: ${expectedTopic}, Got: ${result}\n`);
}

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('✅ All FAQ keyword matching tests passed!');
} else {
  console.log('❌ Some tests failed. Review the keyword mappings.');
  process.exit(1);
}

