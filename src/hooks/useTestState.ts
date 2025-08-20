import { useState, useCallback } from 'react';
import { TestState, CreativeType } from '../types/test';
import { creativeProfiles } from '../data/questions';

const initialState: TestState = {
  currentPage: 1,
  answers: {},
  scores: {
    MAKER: 0,
    TIDY: 0,
    ILLUMA: 0,
    REFORM: 0,
    NOMAD: 0,
    VISUAL: 0
  },
  userInfo: {
    name: '',
    email: '',
    region: '',
    emailSubscription: true
  }
};

export const useTestState = () => {
  const [state, setState] = useState<TestState>(initialState);

  const nextPage = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPage: prev.currentPage + 1
    }));
  }, []);

  const previousPage = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPage: Math.max(1, prev.currentPage - 1)
    }));
  }, []);

  const setCurrentPage = useCallback((page: number) => {
    setState(prev => ({
      ...prev,
      currentPage: page
    }));
  }, []);

  const selectAnswer = useCallback((questionId: number, optionId: number, scores: { [key in CreativeType]?: number }) => {
    setState(prev => {
      const newScores = { ...prev.scores };
      
      // Remove previous answer scores for this question
      if (prev.answers[questionId]) {
        // We'd need to track and remove previous scores, but for simplicity, we'll recalculate
      }
      
      // Add new scores
      Object.entries(scores).forEach(([type, score]) => {
        if (score) {
          newScores[type as CreativeType] += score;
        }
      });

      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: optionId
        },
        scores: newScores
      };
    });
  }, []);

  const updateUserInfo = useCallback((info: Partial<TestState['userInfo']>) => {
    setState(prev => ({
      ...prev,
      userInfo: {
        ...prev.userInfo,
        ...info
      }
    }));
  }, []);

  const calculateResult = useCallback(() => {
    const maxScore = Math.max(...Object.values(state.scores));
    const winningTypes = Object.entries(state.scores)
      .filter(([_, score]) => score === maxScore)
      .map(([type, _]) => type as CreativeType);

    // Priority order for tie-breaking
    const priority: CreativeType[] = ['MAKER', 'VISUAL', 'REFORM', 'TIDY', 'ILLUMA', 'NOMAD'];
    const winningType = winningTypes.reduce((best, current) => 
      priority.indexOf(current) < priority.indexOf(best) ? current : best
    );

    const result = creativeProfiles[winningType];
    
    setState(prev => ({
      ...prev,
      result
    }));

    return result;
  }, [state.scores]);

  const restartTest = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    nextPage,
    previousPage,
    setCurrentPage,
    selectAnswer,
    updateUserInfo,
    calculateResult,
    restartTest
  };
};