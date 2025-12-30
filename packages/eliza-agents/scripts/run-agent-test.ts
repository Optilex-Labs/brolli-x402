import { brolliSalesAgentCharacter, checkPatentCoverage } from '../index';
import { classifyTopicByKeywords, getTopicById } from '../src/faq';

async function simulateAgentConversation() {
  console.log('🤖 Brolli Sales Agent - Conversation Simulation\n');
  console.log(`Agent: ${brolliSalesAgentCharacter.name}`);
  console.log(`Product: ${brolliSalesAgentCharacter.productName}`);
  console.log(`Tagline: ${brolliSalesAgentCharacter.tagline}\n`);
  
  const testScenarios = [
    {
      category: "General Inquiry",
      messages: [
        "What is Brolli?",
        "How much does it cost?",
        "Can my team buy multiple licenses?"
      ]
    },
    {
      category: "Patent Risk Assessment",
      messages: [
        "We're building a healthcare data platform",
        "What's my patent risk for a stablecoin?",
        "Our research platform needs data provenance"
      ]
    },
    {
      category: "Technical Details",
      messages: [
        "What does US12095919B2 cover?",
        "How do you calculate risk scores?",
        "How much do patent settlements cost?"
      ]
    }
  ];
  
  for (const scenario of testScenarios) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`📂 ${scenario.category}`);
    console.log('='.repeat(70));
    
    for (const userMessage of scenario.messages) {
      console.log(`\n👤 User: "${userMessage}"`);
      
      // Step 1: Check if action should trigger
      const shouldTriggerAction = await checkPatentCoverage.validate(
        null as any,
        { content: { text: userMessage } } as any
      );
      
      if (shouldTriggerAction) {
        // Step 2: Run action
        const actionResponse = await checkPatentCoverage.handler(
          null as any,
          { content: { text: userMessage } } as any
        );
        
        console.log(`\n🤖 Agent (Action: ${actionResponse.action}):`);
        console.log(actionResponse.text);
        
        if (actionResponse.data) {
          console.log(`\n📊 Metadata:`, JSON.stringify(actionResponse.data, null, 2));
        }
      } else {
        // Step 3: Check FAQ
        const topicId = classifyTopicByKeywords(userMessage);
        const topic = getTopicById(topicId);
        
        console.log(`\n🤖 Agent (FAQ: ${topicId}):`);
        if (topic) {
          console.log(topic.answer);
        } else {
          console.log(`[Would use character's general conversational response]`);
        }
      }
    }
  }
  
  console.log(`\n${'='.repeat(70)}`);
  console.log('✅ Conversation simulation complete!');
}

simulateAgentConversation().catch(console.error);

