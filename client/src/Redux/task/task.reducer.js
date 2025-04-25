import { TASKS_FAILURE, TASKS_REQUEST, TASKS_SUCCESS } from "./task.action";

const initialTasks = {
  isTasksLoading: false,
  isTasksError: null,
  AllTasks: { tasks: [], total: 0 },
};

export const reducer = (state = initialTasks, { type, payload }) => {
  switch (type) {
    case TASKS_REQUEST:
      return {
        ...state,
        isTasksLoading: true,
        isTasksError: null,
      };
    case TASKS_SUCCESS:
      return {
        ...state,
        isTasksLoading: false,
        isTasksError: null,
        AllTasks: {
          tasks: payload.tasks,
          total: payload.total,
        },
      };
    case TASKS_FAILURE:
      return {
        ...state,
        isTasksLoading: false,
        isTasksError: payload,
      };
    default:
      return state;
  }
};
