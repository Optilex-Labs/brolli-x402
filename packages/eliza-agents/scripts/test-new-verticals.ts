import { checkPatentCoverage } from '../src/actions/checkPatentCoverage';

async function testNewVerticals() {
  console.log('🧪 Testing New Verticals: Healthcare & Research\n');

  const testMessages = [
    { text: "We're building a healthcare data platform for patient records", expectedVertical: "healthcare", expectedRisk: 8.7 },
    { text: "Our platform stores medical records on blockchain with HIPAA compliance", expectedVertical: "healthcare", expectedRisk: 8.7 },
    { text: "Building a research data provenance system for academic institutions", expectedVertical: "research", expectedRisk: 6.8 },
    { text: "We're creating an open science platform for peer review", expectedVertical: "research", expectedRisk: 6.8 },
  ];

  let passed = 0;
  let failed = 0;

  for (const { text, expectedVertical, expectedRisk } of testMessages) {
    console.log(`\n📝 Query: "${text}"`);
    console.log(`   Expected: ${expectedVertical} (${expectedRisk}/10)`);
    
    try {
      const shouldRun = await checkPatentCoverage.validate(null as any, { content: { text } } as any);
      
      if (!shouldRun) {
        console.log(`   ❌ FAILED: Action didn't trigger`);
        failed++;
        continue;
      }
      
      const result = await checkPatentCoverage.handler(null as any, { content: { text } } as any);
      
      if (result.data && result.data.vertical === expectedVertical && result.data.riskScore === expectedRisk) {
        console.log(`   ✅ PASSED: ${result.data.vertical} (${result.data.riskScore}/10)`);
        console.log(`   Risk Tier: ${result.data.recommendation}`);
        passed++;
      } else {
        console.log(`   ❌ FAILED: Got ${result.data?.vertical || 'unknown'} (${result.data?.riskScore || 'N/A'})`);
        console.log(`   Full response: ${result.text.substring(0, 150)}...`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ ERROR: ${error instanceof Error ? error.message : String(error)}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('✅ All new vertical tests passed!');
  } else {
    console.log('❌ Some tests failed.');
    process.exit(1);
  }
}

testNewVerticals().catch(console.error);

