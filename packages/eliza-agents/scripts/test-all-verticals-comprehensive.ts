import { checkPatentCoverage } from '../src/actions/checkPatentCoverage';

async function testAllVerticals() {
  console.log('🧪 Testing All 8 Verticals - Comprehensive Coverage\n');
  
  const verticalTests = [
    { text: "healthcare data platform", expected: "healthcare", risk: 8.7 },
    { text: "stablecoin payment", expected: "payments", risk: 8.5 },
    { text: "tokenizing real estate", expected: "rwa", risk: 8.2 },
    { text: "zkProof identity", expected: "identity", risk: 8.1 },
    { text: "DeFi lending protocol", expected: "lending", risk: 7.8 },
    { text: "research data provenance", expected: "research", risk: 6.8 },
    { text: "DEX with AMM", expected: "dex", risk: 6.2 },
    { text: "NFT marketplace", expected: "nft", risk: 5.1 },
  ];
  
  let passed = 0;
  let failed = 0;
  
  console.log('Testing each vertical with keyword matching...\n');
  
  for (const test of verticalTests) {
    const shouldRun = await checkPatentCoverage.validate(
      null as any,
      { content: { text: test.text } } as any
    );
    
    if (!shouldRun) {
      console.log(`❌ ${test.expected}: Action didn't trigger for "${test.text}"`);
      failed++;
      continue;
    }
    
    const result = await checkPatentCoverage.handler(
      null as any,
      { content: { text: test.text } } as any
    );
    
    if (result.data?.vertical === test.expected && result.data?.riskScore === test.risk) {
      console.log(`✅ ${test.expected.padEnd(12)}: ${result.data.riskScore}/10 (${result.action})`);
      passed++;
    } else {
      console.log(`❌ ${test.expected.padEnd(12)}: Expected ${test.risk}, got ${result.data?.riskScore || 'N/A'} (vertical: ${result.data?.vertical || 'unknown'})`);
      failed++;
    }
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Final Results: ${passed}/8 passed, ${failed}/8 failed`);
  console.log('='.repeat(60));
  
  if (failed > 0) {
    console.log('\n⚠️  Some tests failed. Review the output above.');
    process.exit(1);
  } else {
    console.log('\n✅ All vertical tests passed!');
  }
}

testAllVerticals().catch(console.error);

