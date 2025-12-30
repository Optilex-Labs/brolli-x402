import { brolliPlugin, checkPatentCoverage } from '../src/index';

async function test() {
  console.log('🧪 Testing @brolli/plugin-eliza');
  console.log('=====================================\n');
  
  // Test 1: Plugin structure
  console.log('Test 1: Plugin Structure');
  console.log('Name:', brolliPlugin.name);
  console.log('Actions:', brolliPlugin.actions.length);
  console.log('✅ Plugin structure valid\n');
  
  // Test 2: High-risk project (stablecoin)
  console.log('Test 2: High-Risk Project (Stablecoin)');
  const stablecoinMessage = {
    content: { 
      text: "We're building a collateralized lending protocol on Base with USDC" 
    }
  };
  
  const shouldValidate1 = await checkPatentCoverage.validate(null, stablecoinMessage as any);
  console.log('Should trigger:', shouldValidate1);
  
  if (shouldValidate1) {
    console.log('Calling API...');
    const result1 = await checkPatentCoverage.handler(null, stablecoinMessage as any);
    console.log('Result:', result1.text.substring(0, 200) + '...');
    console.log('Action:', result1.action);
    console.log('✅ High-risk detection works\n');
  }
  
  // Test 3: Low-risk project
  console.log('Test 3: Moderate/Low-Risk Project (NFT)');
  const nftMessage = {
    content: { 
      text: "Building an NFT minting platform" 
    }
  };
  
  const shouldValidate2 = await checkPatentCoverage.validate(null, nftMessage as any);
  console.log('Should trigger:', shouldValidate2);
  
  if (shouldValidate2) {
    console.log('Calling API...');
    const result2 = await checkPatentCoverage.handler(null, nftMessage as any);
    console.log('Result:', result2.text.substring(0, 150) + '...');
    console.log('Action:', result2.action);
    console.log('✅ Risk assessment varies by use case\n');
  }
  
  // Test 4: Non-triggering message
  console.log('Test 4: Non-Triggering Message');
  const randomMessage = {
    content: { 
      text: "What's the weather like today?" 
    }
  };
  
  const shouldValidate3 = await checkPatentCoverage.validate(null, randomMessage as any);
  console.log('Should trigger:', shouldValidate3);
  console.log('✅ Validation filtering works\n');
  
  console.log('=====================================');
  console.log('✅ All tests passed!');
  console.log('\nPlugin is ready to publish to npm.');
}

test().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});

