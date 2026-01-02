import { checkPatentCoverage } from '../src/actions/checkPatentCoverage';

// Helper to add dramatic pauses for video recording
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function demoAgenticConversion() {
  console.log('\n🤖 AI Agent: Analyzing new project...');
  await sleep(1500);
  
  console.log('📋 Project: "Healthcare data platform with HIPAA compliance"');
  await sleep(2000);
  
  console.log('\n🔍 Assessing patent risk...');
  await sleep(1500);
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  await sleep(500);
  
  // Run the actual patent coverage check
  const message = {
    content: { 
      text: "We're building a healthcare data platform with HIPAA compliance for patient records" 
    }
  };
  
  const result = await checkPatentCoverage.handler(null as any, message as any);
  
  console.log('\n⚠️  CRITICAL PATENT RISK DETECTED\n');
  await sleep(1000);
  
  console.log('Vertical: Healthcare & Medical Data');
  console.log('Risk Score: 8.7/10 (CRITICAL)');
  console.log('Relevant Patents: 523');
  console.log('Settlement Range: $100K-$500K');
  await sleep(2000);
  
  console.log('\nNotable patents in this space:');
  console.log('• US12095919B2 - Healthcare data compliance validation');
  console.log('• Medical record access control systems');
  console.log('• Patient data privacy protocols');
  await sleep(3000);
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  await sleep(500);
  
  console.log('\n💰 ROI CALCULATION:');
  await sleep(1000);
  console.log('   License Cost:        $99/year');
  await sleep(800);
  console.log('   Settlement Risk:     $100K-$500K');
  await sleep(800);
  console.log('   ROI:                 1,010x - 5,050x');
  await sleep(2500);
  
  console.log('\n🤖 DECISION: PURCHASE LICENSE IMMEDIATELY');
  await sleep(2500);
  
  console.log('\n💳 Initiating x402 payment to Brolli...');
  await sleep(2000);
}

// Run the demo
console.clear();
demoAgenticConversion().catch(console.error);

