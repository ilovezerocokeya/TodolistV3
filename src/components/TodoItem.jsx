import "./TodoItem.css";
import { memo, useContext  } from "react";
import {TodoDispatchContext} from "../App";

const TodoItem = ({ id, isDone, content, date }) => {

  const {handleUpdate, handleDelete} = useContext(TodoDispatchContext);
  
  const handleCheckboxChange = () => {
    handleUpdate(id);
  };

  const handleDeleteButtonClick = () => {
    handleDelete(id);
  };

  return (
    <div className="TodoItem">
      <input type="checkbox" checked={isDone} onChange={handleCheckboxChange} />
      <div className="content">{content}</div>
      <div className="date">{new Date(date).toLocaleDateString()}</div>
      <button onClick={handleDeleteButtonClick}>삭제</button>
    </div>
  );
};


export default memo(TodoItem);