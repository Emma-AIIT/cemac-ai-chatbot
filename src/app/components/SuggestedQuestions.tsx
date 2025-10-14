'use client';

/**
 * Props interface for SuggestedQuestions component
 */
interface SuggestedQuestionsProps {
  /** Callback function called when a suggested question is selected */
  onQuestionSelect: (question: string) => void;
}

/**
 * SuggestedQuestions Component
 * 
 * Displays a grid of suggested questions to help users get started.
 * Only shows when there's just the welcome message (messages.length === 1).
 * Provides quick access to common queries about CEMAC products and services.
 */
export const SuggestedQuestions = ({ onQuestionSelect }: SuggestedQuestionsProps) => {
  const suggestedQuestions = [
    "What are the seals",
    "How big is the seal",
    "Show me door hardware options",
    "Help with a commercial project"
  ];

  const handleQuestionClick = (question: string) => {
    onQuestionSelect(question);
  };

  const handleKeyPress = (event: React.KeyboardEvent, question: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onQuestionSelect(question);
    }
  };

  return (
    <div className="fade-in flex justify-center w-full">
      <div className="mb-6 max-w-4xl w-full">
        <p className="text-sm text-gray-500 text-center mb-4">
          Try asking about:
        </p>
        
        {/* Desktop: 2x2 grid, Mobile: 2x1 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuestionClick(question)}
              onKeyDown={(e) => handleKeyPress(e, question)}
              className="bg-white border-2 border-gray-200 hover:border-orange-500 rounded-xl px-4 py-3 text-left transition-all duration-200 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              aria-label={`Ask: ${question}`}
              tabIndex={0}
            >
              <span className="text-[14px] text-gray-700 font-medium">
                {question}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
