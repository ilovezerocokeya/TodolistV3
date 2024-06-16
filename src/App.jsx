import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import List from "./components/List";
import Header from "./components/Header";
import Editor from "./components/Editor";
import Calendar from "./components/Calendar";

// reducer 함수 정의
function reducer(state, action) {
  switch (action.type) {
    case "CREATE":
      return [action.data, ...state];
    case "UPDATE":
      return state.map((item) =>
        item.id === action.targetId ? { ...item, isDone: !item.isDone } : item
      );
    case "DELETE":
      return state.filter((item) => item.id !== action.targetId);
    case "UPDATE_CONTENT":
      return state.map((item) =>
        item.id === action.targetId ? { ...item, content: action.newContent } : item
      );
    case "SET_TODOS":
      return action.todos;
    default:
      return state;
  }
}

// 로컬 스토리지에서 초기 상태 가져오기
const getInitialTodos = (currentDate) => {
  const savedTodos = localStorage.getItem(`todos_${currentDate}`);
  console.log(`Fetching todos for date: ${currentDate}`, savedTodos); // 디버깅 로그 추가
  return savedTodos ? JSON.parse(savedTodos) : [];
}

export const TodoStateContext = createContext();
export const TodoDispatchContext = createContext();

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);
  const [todos, dispatch] = useReducer(reducer, [], () => getInitialTodos(currentDate));

  // currentDate가 변경될 때 로컬 스토리지에서 데이터를 가져옴
  useEffect(() => {
    const savedTodos = localStorage.getItem(`todos_${currentDate}`);
    console.log(`Fetching todos for date: ${currentDate}`, savedTodos); // 디버깅 로그 추가
    if (savedTodos) {
      dispatch({ type: "SET_TODOS", todos: JSON.parse(savedTodos) });
    } else {
      dispatch({ type: "SET_TODOS", todos: [] });
    }
  }, [currentDate]);

  // todos 상태가 변경될 때 로컬 스토리지에 저장
  useEffect(() => {
    console.log(`Saving todos for date: ${currentDate}`, todos); // 디버깅 로그 추가
    localStorage.setItem(`todos_${currentDate}`, JSON.stringify(todos));
  }, [todos, currentDate]);

  const handleCreate = useCallback((content) => {
    dispatch({
      type: "CREATE",
      data: {
        id: Date.now(),
        content,
        isDone: false,
        date: new Date().getTime(),
      },
    });
  }, []);

  const handleUpdate = useCallback((targetId) => {
    dispatch({
      type: "UPDATE",
      targetId,
    });
  }, []);

  const handleDelete = useCallback((targetId) => {
    dispatch({
      type: "DELETE",
      targetId,
    });
  }, []);

  const handleUpdateContent = useCallback((targetId, newContent) => {
    dispatch({
      type: "UPDATE_CONTENT",
      targetId,
      newContent,
    });
  }, []);

  const handleDateChange = (date) => {
    setCurrentDate(date);
  };

  return (
    <div className="App container">
      <Header />
      <Calendar currentDate={currentDate} onDateChange={handleDateChange} />
      <TodoStateContext.Provider value={todos}>
        <TodoDispatchContext.Provider
          value={{ handleCreate, handleUpdate, handleDelete, handleUpdateContent }}
        >
          <Editor />
          <List />
        </TodoDispatchContext.Provider>
      </TodoStateContext.Provider>
    </div>
  );
};

export default App;