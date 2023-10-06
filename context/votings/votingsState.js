import React, {useReducer, useContext} from 'react';
import Request from '../../Config/axios';
import AuthContext from '../autentication/authContext';
import VotingsContext from './votingsContext';
import VotingsReducer from './votingsReducer';
import {
  LOAD_VOTINGS_SUCCESS,
  LOAD_VOTINGS_ERRORS,
  CREATE_VOTINGS_SUCCESS,
  CREATE_VOTINGS_ERROR,
  CLEAR_VOTINGS_ERROR,
  CLEAR_VOTINGS,
  LOAD_QUESTIONS_SUCCESS,
  LOAD_QUESTIONS_ERROR,
  CREATE_ANSWERS_SUCCESS,
  CREATE_ANSWERS_ERROR,
  LOAD_RESULTS_ERROR,
  LOAD_RESULTS_SUCCESS,
  LOAD_CHARTS_ERROR,
  LOAD_CHARTS_SUCCESS,
} from '../../types';
import RNFetchBlob from 'rn-fetch-blob';
import {BACKEND_URL} from '../../Config/environment';
import {randomColor} from '../../utils/helpers';
import {colors} from '../../utils/Colors';
import {Platform} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

const votingsState = props => {
  const initialState = {
    votings: [],
    questions: [],
    charts: [],
    results: [],
    loading: true,
    errors: [],
    message: null,
    error: null,
    created: false,
    answer_created: false,
  };

  const [state, dispatch] = useReducer(VotingsReducer, initialState);
  // authContext
  const authContext = useContext(AuthContext);
  const {token, user} = authContext;

  const filterVoting = data => {
    const vote = [];
    //user id logged
    const id = user.id;

    data?.map(function (item) {
      item.voters.map(function (user) {
        if (user.user_id === id && user.attend === 1) {
          vote.push({
            vote_id: item.id,
            description: item.description,
            status: item.status,
            user_id: user.id,
            voters: item.voters,
          });
        }
      });
    });
    return vote;
  };

  //load documents from user
  const loadVotings = async () => {
    try {
      const res = await Request.get('/owner/voting', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });
      const votings = filterVoting(res.data.data);
      dispatch({
        type: LOAD_VOTINGS_SUCCESS,
        payload: votings,
      });
    } catch (error) {
      dispatch({
        type: LOAD_VOTINGS_ERRORS,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const formatQuestion = questions => {
    const data = [];
    const sorted = questions.sort((a, b) => (a.id < b.id ? -1 : 1));
    let answers;
    sorted.map(function (question) {
      if (question.answers_question != '[]') {
        answers = JSON.parse(question.answers_question);
      } else {
        answers = [];
      }

      data.push({
        description: question.description,
        id: question.id,
        vote_id: question.vote_id,
        answers: question.answers,
        status: JSON.parse(question.status),
        answers_question: answers,
      });
    });

    return data;
  };

  const getAnswersByuser = (users, questions) => {
    const data = [];
    users.map(function (user) {
      questions.map(function (question) {
        const answers = question.answers.filter(
          item => item.list_user_id === user.id,
        );
        data.push({
          name: user.name,
          attend: user.attend,
          id: user.id,
          percentage: user.percentage,
          questions: {
            id: question.id,
            description: question.description,
            answer: answers,
          },
        });
      });
    });

    return data;
  };

  const responseByuser = (users, questions) => {
    const data = [];
    let questionSave = [];
    let info = [];
    const responses = getAnswersByuser(users, questions);

    users.map(function (user) {
      const res = responses.filter(item => item.id === user.id);
      res.map(function (question) {
        if (question.questions.answer.length === 0) {
          info.push(user);
        } else {
          questionSave.push({
            description: question.questions.description,
            id: question.questions.id,
            answer: question.questions.answer,
          });
        }
      });

      data.push({
        id: user.id,
        filiales: user.filiales,
        percentage: user.percentage,
        name: user.name,
        question: questionSave.sort((a, b) => (a.id < b.id ? -1 : 1)),
      });
      questionSave = [];
    });

    return getAbstinence(responses);
  };

  const getAbstinence = data => {
    const info = [];
    const filterUsers = data.filter(item => item.questions.answer.length === 0);
    filterUsers.map(function (user) {
      info.push({
        id: user.questions.id,
        percentage: user.percentage,
      });
    });
    let sum = Object.values(
      info.reduce((acc, curr) => {
        (acc[curr.id] = acc[curr.id] || {
          id: curr.id,
          answer_percentage: 0,
        }).answer_percentage += parseFloat(curr.percentage);
        return acc;
      }, {}),
    );

    return sum;
  };

  const searchVoter = (data, voterID) => {
    const questions = [];
    const id = voterID;
    data.map(function (item) {
      const answers = item.answers.filter(answer => answer.list_user_id === id);
      if (answers.length === 0) {
        questions.push(item);
      }
    });
    const result = searchStateQuestion(questions);
    const questionsFormat = verifyAnswers(result);
    return questionsFormat;
  };

  const verifyAnswers = info => {
    const data = [];
    let answers;
    const options = [
      {id: 1, answer: 'De acuerdo'},
      {id: 2, answer: 'Desacuerdo'},
      {id: 2, answer: 'Abstenerse'},
    ];

    info.map(function (question) {
      if (JSON.parse(question.answers_question).length > 0) {
        answers = JSON.parse(question.answers_question);
      } else {
        answers = options;
      }

      data.push({
        id: question.id,
        vote_id: question.vote_id,
        description: question.description,
        status: JSON.parse(question.status),
        answers: question.answers,
        answers_question: answers,
      });
    });

    return data;
  };

  const searchStateQuestion = data => {
    const questions = [];
    data.map(function (item) {
      const status = JSON.parse(item.status);
      if (status.Abierta) {
        questions.push(item);
      }
    });
    return questions;
  };

  const getResultsQuestions = (responses, questions) => {
    const chartCustomAnswer = getChartCustomAnswer(responses, questions);
    const chartAnswers = getChartByanswer(responses, questions);
    const result = chartAnswers.concat(chartCustomAnswer);
    result.sort(function (a, b) {
      return a.id - b.id;
    });
    return result;
  };

  const getChartCustomAnswer = (abstinence, questions) => {
    const filterQuestions = questions.filter(
      item => item.answers_question.length > 0,
    );

    let finalResults = [];

    let optionsLabel = [];
    const sumAbstinence = abstinence;

    const data = [];

    if (filterQuestions.length > 0) {
      filterQuestions.map(function (question) {
        const getAbstinence = sumAbstinence.filter(
          item => item.id === question.id,
        );

        question.answers_question.map(function (answer) {
          optionsLabel.push({
            id: answer.id,
            answer: answer.answer,
          });
        });

        let sum = Object.values(
          question.answers.reduce((acc, curr) => {
            (acc[curr.answer] = acc[curr.answer] || {
              id: curr.id,
              answer: curr.answer,
              answer_percentage: 0,
            }).answer_percentage += parseFloat(curr.answer_percentage);
            return acc;
          }, {}),
        );

        sum.map(function (percentage) {
          optionsLabel.map(function (label, index) {
            if (percentage.answer === label.answer) {
              finalResults.push({
                name: label.answer,
                percentage: percentage.answer_percentage,
                color: index + 1 <= 10 ? colors[index] : randomColor(),
                legendFontColor: '#7F7F7F',
                legendFontSize: RFValue(12),
              });
            }
          });
        });

        const options =
          getAbstinence.length > 0
            ? finalResults.concat([
                {
                  name: 'No votó',
                  percentage: getAbstinence[0].answer_percentage,
                  color:
                    finalResults.length < 10
                      ? colors[finalResults.length]
                      : randomColor(),
                  legendFontColor: '#7F7F7F',
                  legendFontSize: RFValue(12),
                },
              ])
            : finalResults;

        data.push({
          id: question.id,
          count: question.answers.length,
          title: question.description,
          options: options,
          finished: question.status.Finalizar,
        });

        finalResults = [];
      });
    }
    data.sort((a, b) => (a.id < b.id ? -1 : 1));
    return data;
  };

  const getChartByanswer = (abstinence, questions) => {
    const filterQuestions = questions.filter(
      item => item.answers_question.length === 0,
    );

    const sumAbstinence = abstinence;

    const data = [];

    if (filterQuestions.length > 0) {
      filterQuestions.map(function (question) {
        const getAbstinence = sumAbstinence.filter(
          item => item.id === question.id,
        );

        let sum = Object.values(
          question.answers.reduce((acc, curr) => {
            (acc[curr.answer] = acc[curr.answer] || {
              answer: curr.answer,
              answer_percentage: 0,
            }).answer_percentage += parseFloat(curr.answer_percentage);
            return acc;
          }, {}),
        );

        const filterAgree = sum.filter(item => item.answer === 'De acuerdo');
        const filterDisagreement = sum.filter(
          item => item.answer === 'Desacuerdo',
        );
        const filterAbstinence = sum.filter(
          item => item.answer === 'Abstenerse',
        );

        const agree =
          filterAgree.length === 0 ? 0 : filterAgree[0].answer_percentage;
        const disagreement =
          filterDisagreement.length === 0
            ? 0
            : filterDisagreement[0].answer_percentage;

        const abstinence =
          filterAbstinence.length === 0
            ? 0
            : filterAbstinence[0].answer_percentage;

        const noVoters =
          getAbstinence.length === 0 ? 0 : getAbstinence[0].answer_percentage;

        const options =
          getAbstinence.length > 0
            ? [
                {
                  name: 'De acuerdo',
                  color: colors[0],
                  legendFontColor: '#7F7F7F',
                  legendFontSize: RFValue(12),
                  percentage: agree,
                },
                {
                  name: 'Desacuerdo',
                  color: colors[1],
                  legendFontColor: '#7F7F7F',
                  legendFontSize: RFValue(12),
                  percentage: disagreement,
                },
                {
                  name: 'Abstinencia',
                  color: colors[2],
                  legendFontColor: '#7F7F7F',
                  legendFontSize: RFValue(12),
                  percentage: abstinence,
                },
                {
                  name: 'No votó',
                  color: colors[3],
                  legendFontColor: '#7F7F7F',
                  legendFontSize: RFValue(12),
                  percentage: noVoters,
                },
              ]
            : [
                {
                  name: 'De acuerdo',
                  color: colors[0],
                  legendFontColor: '#7F7F7F',
                  legendFontSize: RFValue(12),
                  percentage: agree,
                },
                {
                  name: 'Desacuerdo',
                  color: colors[1],
                  legendFontColor: '#7F7F7F',
                  legendFontSize: RFValue(12),
                  percentage: disagreement,
                },
                {
                  name: 'Abstinencia',
                  color: colors[2],
                  legendFontColor: '#7F7F7F',
                  legendFontSize: RFValue(12),
                  percentage: abstinence,
                },
              ];

        data.push({
          id: question.id,
          count: question.answers.length,
          title: question.description,
          options: options,
          finished: question.status.Finalizar,
        });
      });
    }
    data.sort((a, b) => (a.id < b.id ? -1 : 1));

    return data;
  };

  const loadQuestions = async (id, voterID) => {
    try {
      const res = await Request.get('/owner/vote/questions/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      const questions = searchVoter(res.data.data, voterID);

      dispatch({
        type: LOAD_QUESTIONS_SUCCESS,
        payload: questions,
      });
    } catch (error) {
      dispatch({
        type: LOAD_QUESTIONS_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const loadCharts = async (id, voters) => {
    try {
      const res = await Request.get('/owner/vote/questions/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      const responses = responseByuser(voters, res.data.data);

      const formatQuestions = formatQuestion(res.data.data);

      const charts = getResultsQuestions(responses, formatQuestions);

      dispatch({
        type: LOAD_CHARTS_SUCCESS,
        payload: charts,
      });
    } catch (error) {
      dispatch({
        type: LOAD_CHARTS_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const createVoting = async data => {
    const formData = [
      {name: 'name', data: data.name},
      {name: 'lastname', data: data.lastname},
      {name: 'document_id', data: data.document_id},
      {name: 'document_type', data: data.document_type},
      {name: 'email', data: data.email},
      {name: 'role_id', data: data.role_id.toString()},
      {name: 'authorized', data: data.authorized.toString()},
    ];

    if (data?.file) {
      data.file.forEach(file =>
        formData.push({
          name: 'file[]',
          filename: file.name,
          type: file.type,
          data:
            Platform.OS === 'ios'
              ? 'RNFetchBlob-file://' +
                decodeURI(
                  file.uri.replace('file:///', '').replace('file://', ''),
                )
              : RNFetchBlob.wrap(file.uri),
        }),
      );
    }

    if (data.password.trim() !== '') {
      formData.push({
        name: 'password',
        data: data.password,
      });
      formData.push({
        name: 'password_confirmation',
        data: data.password_confirmation,
      });
    }

    await RNFetchBlob.fetch(
      'POST',
      BACKEND_URL + '/owner/voting',
      {
        Authorization: `Bearer ${token}`,
      },
      formData,
    )
      .then(resp => {
        const data = JSON.parse(resp.data);
        const {errors} = data;
        if (!errors) {
          dispatch({
            type: CREATE_VOTINGS_SUCCESS,
            payload: data.data || {},
          });
        } else {
          dispatch({
            type: CREATE_VOTINGS_ERROR,
            payload: errors,
          });
        }
      })
      .catch(err => {
        dispatch({
          type: CREATE_VOTINGS_ERROR,
          payload: err?.response?.data?.errors || [],
        });
      });
  };

  const createAnswer = async data => {
    try {
      const res = await Request.post('/owner/answers', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: CREATE_ANSWERS_SUCCESS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: CREATE_ANSWERS_ERROR,
        payload:
          error?.response?.data?.errors ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const loadEndsVotings = async () => {
    try {
      const res = await Request.get('/owner/voting/ends', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      const votings = res.data.data || [];

      dispatch({
        type: LOAD_RESULTS_SUCCESS,
        payload: votings,
      });
    } catch (error) {
      dispatch({
        type: LOAD_RESULTS_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //clearErrors for state
  const clearErrors = () => {
    dispatch({
      type: CLEAR_VOTINGS_ERROR,
      payload: [],
    });
  };

  const clear = () => {
    dispatch({
      type: CLEAR_VOTINGS,
      payload: [],
    });
  };

  return (
    <VotingsContext.Provider
      value={{
        votings: state.votings,
        questions: state.questions,
        results: state.results,
        charts: state.charts,
        loading: state.loading,
        errors: state.errors,
        message: state.message,
        error: state.error,
        created: state.created,
        answer_created: state.answer_created,
        loadVotings,
        clearErrors,
        createVoting,
        clear,
        loadQuestions,
        createAnswer,
        loadEndsVotings,
        loadCharts,
      }}>
      {props.children}
    </VotingsContext.Provider>
  );
};

export default votingsState;
