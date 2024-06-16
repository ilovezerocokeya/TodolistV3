import { useState, useMemo, useContext } from "react";
import "./List.css";
import TodoItem from "./TodoItem";
import { TodoStateContext } from "../App";

const List = () => {
  const todos = useContext(TodoStateContext); 
  const [search, setSearch] = useState("");

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const getFilteredData = () => {
    if (search === "") {
      return todos;
    }
    return todos.filter((todo) =>
      todo.content.toLowerCase().includes(search.toLowerCase())
    );
  };

  const filteredTodos = getFilteredData();

  const { totalCount, doneCount, notDoneCount } = useMemo(() => {
    const totalCount = todos.length;
    const doneCount = todos.filter((todo) => todo.isDone).length;

    const notDoneCount = totalCount - doneCount;

    return {
      totalCount,
      doneCount,
      notDoneCount,
    };
  }, [todos]);

  const workingTodos = filteredTodos.filter((todo) => !todo.isDone);
  const doneTodos = filteredTodos.filter((todo) => todo.isDone);

  return (
    <div className="List">
      <h4>Todo List🌱</h4>
      <div className="board">
        <div>전체: {totalCount}</div>
        <div>진행중: {notDoneCount}</div>
        <div>완료: {doneCount}</div>
      </div>
      <input
        value={search}
        onChange={handleChangeSearch}
        placeholder="검색어를 입력하세요"
      />
      <div className="todos_wrapper">
        <h5>하는중...</h5>
        {workingTodos.map((todo) => (
          <TodoItem key={todo.id} {...todo} />
        ))}
        <h5>다했당!!!</h5>
        {doneTodos.map((todo) => (
          <TodoItem key={todo.id} {...todo} />
        ))}
      </div>
    </div>
  );
};

export default List;