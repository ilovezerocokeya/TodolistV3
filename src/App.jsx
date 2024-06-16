import {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useMemo,
} from "react";
import List from "./components/List";
import Header from "./components/Header";
import Editor from "./components/Editor";

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
    default:
      return state; // 기본적으로 현재 상태를 반환
  }
}

export const TodoStateContext = createContext();
export const TodoDispatchContext = createContext();

const App = () => {
  // 로컬 스토리지에서 초기 상태를 가져옴
  const [todos, dispatch] = useReducer(reducer, [], () => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // ID 레퍼런스를 초기화
  const idRef = useRef(
    todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1
  );

  // todos 상태가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // 새로운 Todo 항목을 생성하는 함수
  const handleCreate = useCallback((content) => {
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current++,
        content,
        isDone: false,
        date: new Date().getTime(),
      },
    });
  }, []);

  // Todo 항목의 isDone 값을 토글하는 함수
  const handleUpdate = useCallback((targetId) => {
    dispatch({
      type: "UPDATE",
      targetId,
    });
  }, []);

  // Todo 항목을 삭제하는 함수
  const handleDelete = useCallback((targetId) => {
    dispatch({
      type: "DELETE",
      targetId,
    });
  }, []);

  const memoizedDispatch = useMemo(() => {
    return { handleCreate, handleUpdate, handleDelete }
  }, []);

  return (
    <div className="App">
      <Header />

      <TodoStateContext.Provider value={todos}>
        <TodoDispatchContext.Provider
          value={memoizedDispatch}
        >
          <Editor />
          <List />
        </TodoDispatchContext.Provider>
      </TodoStateContext.Provider>
    </div>
  );
};

export default App;
