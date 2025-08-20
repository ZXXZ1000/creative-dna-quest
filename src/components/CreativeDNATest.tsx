import React, { useEffect, useMemo } from 'react';
import { useTestState } from '../hooks/useTestState';
import { questions } from '../data/questions';
import { LandingPage } from './pages/LandingPage';
import { SciencePage } from './pages/SciencePage';
import { QuestionPage } from './pages/QuestionPage';
import { InfoPage } from './pages/InfoPage';
import { ResultPage } from './pages/ResultPage';
import { SwipePageContainer } from './SwipePageContainer';

export const CreativeDNATest: React.FC = () => {
  const {
    state,
    nextPage,
    previousPage,
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

  // 生成所有页面组件
  const allPages = useMemo(() => {
    const pages = [];
    
    // 页面1: 首页
    pages.push(
      <LandingPage key="landing" onStart={handleStartTest} />
    );
    
    // 页面2: 科学页面
    pages.push(
      <SciencePage 
        key="science"
        onContinue={handleContinueFromScience} 
        onSkip={handleSkipScience} 
      />
    );
    
    // 页面3-10: 问题页面
    questions.forEach((question, index) => {
      const pageNumber = index + 3;
      pages.push(
        <QuestionPage
          key={`question-${question.id}`}
          question={question}
          questionNumber={index + 1}
          totalQuestions={questions.length}
          selectedOption={state.answers[question.id]}
          onSelectOption={(optionId, scores) => 
            handleQuestionAnswer(question.id, optionId, scores)
          }
          onNext={handleNextQuestion}
        />
      );
    });
    
    // 页面11: 信息页面
    pages.push(
      <InfoPage
        key="info"
        onContinue={handleInfoSubmit}
        initialData={state.userInfo}
      />
    );
    
    // 页面12: 结果页面
    pages.push(
      state.result ? (
        <ResultPage
          key="result"
          result={state.result}
          userName={state.userInfo.name}
          onRestart={handleRestart}
          onShare={handleShare}
        />
      ) : <div key="result" className="flex items-center justify-center h-full">Loading...</div>
    );
    
    return pages;
  }, [state.answers, state.userInfo, state.result]);

  // 页面切换处理
  const handlePageChange = (newIndex: number) => {
    const newPageNumber = newIndex + 1;
    if (newPageNumber >= 1 && newPageNumber <= 12) {
      setCurrentPage(newPageNumber);
    }
  };

  // 防止默认触摸行为以改善滑动体验
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      // 防止多点触控
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', preventDefault, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', preventDefault);
    };
  }, []);

  const currentIndex = state.currentPage - 1; // 转换为0基础索引

  return (
    <div className="min-h-screen overflow-hidden">
      <SwipePageContainer
        currentIndex={currentIndex}
        onPageChange={handlePageChange}
        enableSwipe={true}
      >
        {allPages}
      </SwipePageContainer>
    </div>
  );
};