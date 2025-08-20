import React, { useEffect } from 'react';
import { useTestState } from '../hooks/useTestState';
import { questions } from '../data/questions';
import { LandingPage } from './pages/LandingPage';
import { SciencePage } from './pages/SciencePage';
import { QuestionPage } from './pages/QuestionPage';
import { InfoPage } from './pages/InfoPage';
import { ResultPage } from './pages/ResultPage';
import { PageTransition } from './PageTransition';

export const CreativeDNATest: React.FC = () => {
  const {
    state,
    nextPage,
    setCurrentPage,
    selectAnswer,
    updateUserInfo,
    calculateResult,
    restartTest
  } = useTestState();

  const handleStartTest = () => {
    nextPage(); // Go to Science page (page 2)
  };

  const handleContinueFromScience = () => {
    setCurrentPage(3); // Go to first question (page 3)
  };

  const handleSkipScience = () => {
    setCurrentPage(3); // Go to first question (page 3)
  };

  const handleQuestionAnswer = (questionId: number, optionId: number, scores: any) => {
    selectAnswer(questionId, optionId, scores);
  };

  const handleNextQuestion = () => {
    const questionIndex = state.currentPage - 3; // Current question index (0-based)
    
    if (questionIndex < questions.length - 1) {
      nextPage(); // Next question
    } else {
      setCurrentPage(11); // Go to info page
    }
  };

  const handleInfoSubmit = (name: string, email: string, region: string, emailSubscription: boolean) => {
    updateUserInfo({ name, email, region, emailSubscription });
    calculateResult();
    setCurrentPage(12); // Go to result page
  };

  const handleShare = () => {
    if (navigator.share && state.result) {
      navigator.share({
        title: `I'm ${state.result.title}! What's your Creative DNA?`,
        text: `I just discovered my Creative DNA with HOTO - I'm ${state.result.title}! Take the test and find out yours.`,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      const shareText = `I'm ${state.result?.title}! What's your Creative DNA? Take the HOTO Creative DNA Test: ${window.location.href}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Share text copied to clipboard!');
      }).catch(() => {
        alert('Please copy this text to share: ' + shareText);
      });
    }
  };

  const handleRestart = () => {
    restartTest();
  };

  // Prevent default touch behaviors to improve swipe experience
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', preventDefault, { passive: false });
    document.addEventListener('touchmove', preventDefault, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventDefault);
      document.removeEventListener('touchmove', preventDefault);
    };
  }, []);

  // Render current page
  const renderCurrentPage = () => {
    switch (state.currentPage) {
      case 1:
        return <LandingPage onStart={handleStartTest} />;
      
      case 2:
        return (
          <SciencePage 
            onContinue={handleContinueFromScience} 
            onSkip={handleSkipScience} 
          />
        );
      
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
        const questionIndex = state.currentPage - 3;
        const currentQuestion = questions[questionIndex];
        return (
          <QuestionPage
            question={currentQuestion}
            questionNumber={questionIndex + 1}
            totalQuestions={questions.length}
            selectedOption={state.answers[currentQuestion.id]}
            onSelectOption={(optionId, scores) => 
              handleQuestionAnswer(currentQuestion.id, optionId, scores)
            }
            onNext={handleNextQuestion}
          />
        );
      
      case 11:
        return (
          <InfoPage
            onContinue={handleInfoSubmit}
            initialData={state.userInfo}
          />
        );
      
      case 12:
        return state.result ? (
          <ResultPage
            result={state.result}
            userName={state.userInfo.name}
            onRestart={handleRestart}
            onShare={handleShare}
          />
        ) : null;
      
      default:
        return <LandingPage onStart={handleStartTest} />;
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <PageTransition pageKey={`page-${state.currentPage}`}>
        {renderCurrentPage()}
      </PageTransition>
    </div>
  );
};