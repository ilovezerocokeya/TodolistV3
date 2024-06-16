import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useRef,
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
      return [action.data, ...state]; // 새로운 항목을 앞에 추가
    case "UPDATE":
      return state.map((item) =>
        item.id === action.targetId ? { ...item, isDone: !item.isDone } : item
      ); // 해당 항목의 isDone 값을 토글
    case "DELETE":
      return state.filter((item) => item.id !== action.targetId); // 해당 항목을 필터링하여 제거
    case "UPDATE_CONTENT":
      return state.map((item) =>
        item.id === action.targetId ? { ...item, content: action.newContent } : item
      ); // 해당 항목의 content 값을 업데이트
    case "SET_TODOS":
      return action.todos; // 새로운 투두리스트로 설정
    default:
      return state; // 기본적으로 현재 상태를 반환
  }
}

export const TodoStateContext = createContext();
export const TodoDispatchContext = createContext();

const App = () => {
  const [todos, dispatch] = useReducer(reducer, []);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const savedTodos = localStorage.getItem(`todos_${currentDate}`);
    if (savedTodos) {
      dispatch({ type: "SET_TODOS", todos: JSON.parse(savedTodos) });
    } else {
      dispatch({ type: "SET_TODOS", todos: [] });
    }
  }, [currentDate]);

  useEffect(() => {
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