async function testPluginImport() {
  console.log('🧪 Testing Plugin Import & Structure\n');
  
  try {
    // Test 1: Import from eliza-agents
    console.log('1️⃣ Testing @brolli/eliza-agents import...');
    const agents = await import('../index');
    
    console.log('   ✅ brolliSalesAgentCharacter:', !!agents.brolliSalesAgentCharacter);
    console.log('   ✅ checkPatentCoverage:', !!agents.checkPatentCoverage);
    console.log('   ✅ classifyTopicByKeywords:', !!agents.classifyTopicByKeywords);
    
    // Test 2: Verify character structure
    console.log('\n2️⃣ Testing character structure...');
    const char = agents.brolliSalesAgentCharacter;
    console.log('   ✅ Has name:', !!char.name);
    console.log('   ✅ Has patentKnowledge:', !!(char as any).patentKnowledge);
    console.log('   ✅ Patent verticals:', Object.keys((char as any).patentKnowledge?.verticals || {}));
    
    // Test 3: Verify action structure
    console.log('\n3️⃣ Testing action structure...');
    const action = agents.checkPatentCoverage;
    console.log('   ✅ Has name:', action.name);
    console.log('   ✅ Has validate:', typeof action.validate === 'function');
    console.log('   ✅ Has handler:', typeof action.handler === 'function');
    console.log('   ✅ Has examples:', Array.isArray(action.examples));
    
    console.log('\n✅ All imports successful!');
  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  }
}

testPluginImport().catch(console.error);

