import React, { useEffect, useMemo } from 'react';
import { useTestState } from '../hooks/useTestState';
import { questions, creativeProfiles } from '../data/questions';
import { LandingPage } from './pages/LandingPage';
import { QuestionPage } from './pages/QuestionPage';
import { InfoPage } from './pages/InfoPage';
import { ResultPage } from './pages/ResultPage';
import { SwipePageContainer } from './SwipePageContainer';
import { track, trackLinkOpenedOnce } from '../lib/analytics';
import { AudioController } from './AudioController';

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
    setCurrentPage(2); // Go directly to first question
    track({ name: 'start_test' })
  };

  const handleQuestionAnswer = (questionId: number, optionId: number, scores: any) => {
    selectAnswer(questionId, optionId, scores);
    track({ name: 'question_answered', props: { question_id: questionId, option_id: optionId, scores } })
  };

  const handleNextQuestion = () => {
    const questionIndex = state.currentPage - 2; // Current question index (0-based)
    
    if (questionIndex < questions.length - 1) {
      nextPage(); // Next question
    } else {
      setCurrentPage(10); // Go to info page
    }
  };

  const handleInfoSubmit = (name: string, email: string, region: string, emailSubscription: boolean) => {
    updateUserInfo({ name, email, region, emailSubscription });
    calculateResult();
    setCurrentPage(11); // Go to result page
    // store plain email as requested
    track({ name: 'info_submitted', props: { name, email: email || null, region, emailSubscription } })
  };

  const handleShare = () => {
    // This is now just a placeholder as the ResultPage handles sharing internally
    // The function is passed to maintain the expected API between components
    console.log('Share initiated from parent component');
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
    
    // 页面2-9: 问题页面
    questions.forEach((question, index) => {
      const pageNumber = index + 2;
      const isCurrentPage = state.currentPage === pageNumber;
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
          isCurrentPage={isCurrentPage}
        />
      );
    });
    
    // 页面10: 信息页面
    pages.push(
      <InfoPage
        key="info"
        onContinue={handleInfoSubmit}
        initialData={state.userInfo}
      />
    );
    
    // 页面11: 结果页面
    pages.push(
      state.result ? (
        <ResultPage
          key="result"
          result={state.result}
          userName={state.userInfo.name}
          userRegion={state.userInfo.region}
          onRestart={handleRestart}
          onShare={handleShare}
        />
      ) : <div key="result" className="flex items-center justify-center h-full">Loading...</div>
    );
    
    return pages;
  }, [state.answers, state.userInfo, state.result, state.currentPage]);

  // 页面切换处理 - 禁止回退
  const handlePageChange = (newIndex: number) => {
    const newPageNumber = newIndex + 1;
    // 只允许前进，不允许后退
    if (newPageNumber >= state.currentPage && newPageNumber <= 11) {
      setCurrentPage(newPageNumber);
    }
  };

  // 禁用滑动功能后，不需要防止触摸行为
  // useEffect(() => {
  //   // 滑动已禁用，移除触摸事件监听
  // }, []);

  const currentIndex = state.currentPage - 1; // 转换为0基础索引
  const debugParam = typeof window !== 'undefined'
    ? (new URLSearchParams(window.location.search).get('debug') || window.location.hash.replace('#', ''))
    : undefined;
  const isDebugBuilder = debugParam?.toLowerCase() === 'builder' || debugParam?.toLowerCase() === 'maker';
  const isQuestionPage = state.currentPage >= 2 && state.currentPage <= 9;
  const questionIndex = state.currentPage - 2; // 0-based for questions
  const progress = isQuestionPage
    ? Math.min(Math.max(((questionIndex + 1) / questions.length) * 100, 0), 100)
    : 0;

  // Track when result is available
  useEffect(() => {
    if (state.result) {
      track({ name: 'result_computed', props: { result_type: state.result.type } })
    }
  }, [state.result])

  if (isDebugBuilder) {
    return (
      <div className="h-full overflow-hidden">
        <ResultPage
          result={creativeProfiles.MAKER}
          userName={state.userInfo.name || 'Debug User'}
          userRegion={state.userInfo.region || 'United States'}
          onRestart={handleRestart}
          onShare={handleShare}
        />
      </div>
    );
  }

  useEffect(() => { trackLinkOpenedOnce() }, [])

  return (
    <div className="h-full overflow-hidden relative">
      <AudioController />
      {isQuestionPage && (
        <div
          className="absolute top-0 left-0 right-0 z-50"
          style={{ paddingTop: 'calc(16px + env(safe-area-inset-top))' }}
        >
          <div className="px-6 pb-2">
            <div className="rounded-full" style={{ height: '6px', backgroundColor: '#6c6a6aff', width: '90%', margin: '0 auto' }}>
              <div
                className="h-full rounded-full transition-[width]"
                style={{
                  width: `${progress}%`,
                  backgroundColor: '#FFED00',
                  transition: 'width 1400ms cubic-bezier(0.22, 1, 0.36, 1)'
                }}
              />
            </div>
          </div>
        </div>
      )}

      <SwipePageContainer
        currentIndex={currentIndex}
        onPageChange={handlePageChange}
        enableSwipe={false}
      >
        {allPages}
      </SwipePageContainer>
    </div>
);
};

// Note: hashing removed per requirement (store plain email in analytics props)
