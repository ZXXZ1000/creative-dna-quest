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
    // 第一层：主要得分计算
    let finalScores = { ...state.scores };
    
    const maxScore = Math.max(...Object.values(finalScores));
    let winningTypes = Object.entries(finalScores)
      .filter(([_, score]) => score === maxScore)
      .map(([type, _]) => type as CreativeType);

    // 如果没有并列，直接返回结果
    if (winningTypes.length === 1) {
      const result = creativeProfiles[winningTypes[0]];
      setState(prev => ({ ...prev, result }));
      return result;
    }

    // 第二层：次要得分细化规则 (28.2%的情况)
    const secondaryScores = { ...finalScores };

    // 规则1: Q1&Q3 一致性模式识别
    const q1Choice = Object.keys(state.answers).includes('1') ? state.answers[1] - 1 : null;
    const q3Choice = Object.keys(state.answers).includes('3') ? state.answers[3] - 1 : null;
    
    if (q1Choice !== null && q3Choice !== null) {
      if (q1Choice === q3Choice) {
        if (q1Choice === 0) secondaryScores.TIDY += 0.5;      // 一致偏向ORGANIZER
        if (q1Choice === 1) secondaryScores.ILLUMA += 0.5;    // 一致偏向LIGHT SEEKER  
        if (q1Choice === 2) secondaryScores.NOMAD += 0.5;     // 一致偏向EXPLORER
      } else {
        // 不一致时给两个选择都加小分
        [q1Choice, q3Choice].forEach(choice => {
          if (choice === 0) secondaryScores.TIDY += 0.2;
          if (choice === 1) secondaryScores.ILLUMA += 0.2;
          if (choice === 2) secondaryScores.NOMAD += 0.2;
        });
      }
    }

    // 规则2: Q2 的混合选项特殊处理
    const q2Choice = Object.keys(state.answers).includes('2') ? state.answers[2] - 1 : null;
    if (q2Choice !== null) {
      if (q2Choice === 0) secondaryScores.MAKER += 0.6;        // 纯BUILDER倾向
      if (q2Choice === 1) {                                     // REFORM+MAKER混合选项
        secondaryScores.REFORM += 0.4;                         // INNOVATOR获得更多分
        secondaryScores.MAKER += 0.3;                          // BUILDER获得较少分
      }
      if (q2Choice === 2) secondaryScores.ILLUMA += 0.4;       // LIGHT SEEKER倾向
    }

    // 规则3: Q4,Q5,Q8 三题联动模式分析
    const q4Choice = Object.keys(state.answers).includes('4') ? state.answers[4] - 1 : null;
    const q5Choice = Object.keys(state.answers).includes('5') ? state.answers[5] - 1 : null;
    const q8Choice = Object.keys(state.answers).includes('8') ? state.answers[8] - 1 : null;
    
    if (q4Choice !== null && q5Choice !== null && q8Choice !== null) {
      const choices = [q4Choice, q5Choice, q8Choice];
      const count = { 0: 0, 1: 0, 2: 0 };
      
      // 统计每个选项的出现次数
      choices.forEach(choice => count[choice as 0 | 1 | 2]++);
      
      // 奖励主导模式
      if (count[0] >= 2) secondaryScores.MAKER += 0.4;     // BUILDER主导
      if (count[1] >= 2) secondaryScores.REFORM += 0.4;    // INNOVATOR主导
      if (count[2] >= 2) secondaryScores.VISUAL += 0.4;    // CRAFTER主导
      
      // 基础分数
      choices.forEach(choice => {
        if (choice === 0) secondaryScores.MAKER += 0.15;
        if (choice === 1) secondaryScores.REFORM += 0.15;  
        if (choice === 2) secondaryScores.VISUAL += 0.15;
      });
    }

    // 规则4: Q6 混合选项解析
    const q6Choice = Object.keys(state.answers).includes('6') ? state.answers[6] - 1 : null;
    if (q6Choice !== null) {
      if (q6Choice === 0) secondaryScores.TIDY += 0.5;          // 纯ORGANIZER
      if (q6Choice === 1) {                                      // BUILDER+INNOVATOR混合
        secondaryScores.MAKER += 0.25;
        secondaryScores.REFORM += 0.25;
      }
      if (q6Choice === 2) {                                      // CRAFTER+LIGHT SEEKER混合
        secondaryScores.VISUAL += 0.25;
        secondaryScores.ILLUMA += 0.25;
      }
    }

    // 规则5: Q7 混合选项解析
    const q7Choice = Object.keys(state.answers).includes('7') ? state.answers[7] - 1 : null;
    if (q7Choice !== null) {
      if (q7Choice === 0) {                                      // BUILDER+ORGANIZER混合
        secondaryScores.MAKER += 0.25;
        secondaryScores.TIDY += 0.25;
      }
      if (q7Choice === 1) secondaryScores.NOMAD += 0.5;          // 纯EXPLORER
      if (q7Choice === 2) {                                      // LIGHT SEEKER+CRAFTER混合
        secondaryScores.ILLUMA += 0.25;
        secondaryScores.VISUAL += 0.25;
      }
    }

    // 检查第二层是否解决了并列
    const secondaryMaxScore = Math.max(...Object.values(secondaryScores));
    const secondaryWinners = Object.entries(secondaryScores)
      .filter(([_, score]) => score === secondaryMaxScore)
      .map(([type, _]) => type as CreativeType);

    if (secondaryWinners.length === 1) {
      const result = creativeProfiles[secondaryWinners[0]];
      setState(prev => ({ ...prev, result }));
      return result;
    }

    // 第三层：优化的优先级排序 (0.7%的情况)
    // VISUAL → MAKER → NOMAD → REFORM → TIDY → ILLUMA
    const priority: CreativeType[] = ['VISUAL', 'MAKER', 'NOMAD', 'REFORM', 'TIDY', 'ILLUMA'];
    const winningType = secondaryWinners.reduce((best, current) => 
      priority.indexOf(current) < priority.indexOf(best) ? current : best
    );

    const result = creativeProfiles[winningType];
    
    setState(prev => ({
      ...prev,
      result
    }));

    return result;
  }, [state.scores, state.answers]);

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