import { checkPatentCoverage } from '../src/actions/checkPatentCoverage';

async function runTests() {
  console.log('🧪 Testing Patent Coverage Action\n');

  const testMessages = [
    { text: "We're building a stablecoin for remittances", expectedVertical: "payments", expectedRisk: 8.5 },
    { text: "Our DeFi lending protocol is launching soon", expectedVertical: "lending", expectedRisk: 7.8 },
    { text: "We're tokenizing real estate", expectedVertical: "rwa", expectedRisk: 8.2 },
    { text: "Building an NFT marketplace", expectedVertical: "nft", expectedRisk: 5.1 },
    { text: "Creating a DEX with an AMM", expectedVertical: "dex", expectedRisk: 6.2 },
    { text: "We have zkProofs for privacy", expectedVertical: "identity", expectedRisk: 8.1 },
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
        console.log(`   Action: ${result.action}`);
        passed++;
      } else {
        console.log(`   ❌ FAILED: Got ${result.data?.vertical || 'unknown'} (${result.data?.riskScore || 'N/A'})`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ ERROR: ${error instanceof Error ? error.message : String(error)}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('✅ All action trigger tests passed!');
  } else {
    console.log('❌ Some tests failed.');
    process.exit(1);
  }
}

runTests().catch(console.error);

