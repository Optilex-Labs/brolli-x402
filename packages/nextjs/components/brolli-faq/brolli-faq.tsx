import { brolliSalesFaq } from "@brolli/eliza-agents";

function getFaqTopics() {
  return brolliSalesFaq.topics.filter(t => t.id !== "unknown");
}

export function BrolliFaq() {
  const topics = getFaqTopics();

  return (
    <section className="w-full max-w-5xl mx-auto px-5 py-12">
      <div className="bg-base-200 rounded-3xl border border-base-300 p-8">
        {/* Parent collapsible wrapper for entire FAQ */}
        <details className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-2xl">
          <summary className="collapse-title text-2xl font-bold">
            FAQ
            <span className="block text-xs text-base-content/70 font-normal mt-1">
              Not legal advice.
            </span>
          </summary>
          <div className="collapse-content pt-4">
            <div className="space-y-3">
              {topics.map(topic => (
                <details 
                  key={topic.id} 
                  className="collapse collapse-arrow bg-base-200 border border-base-300 rounded-xl"
                >
                  <summary className="collapse-title text-base font-semibold">
                    {topic.title}
                  </summary>
                  <div className="collapse-content">
                    <p className="text-sm whitespace-pre-wrap text-base-content/80">
                      {topic.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}


