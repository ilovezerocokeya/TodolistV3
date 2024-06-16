import "./TodoItem.css";
import { memo, useContext, useState, useRef } from "react";
import { TodoDispatchContext } from "../App";

const TodoItem = ({ id, isDone, content, date }) => {
  const { handleUpdate, handleDelete, handleUpdateContent } = useContext(TodoDispatchContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(content);
  const contentRef = useRef();

  const handleCheckboxChange = () => {
    handleUpdate(id);
  };

  const handleDeleteButtonClick = () => {
    handleDelete(id);
  };

  const handleEditButtonClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      contentRef.current.focus();
    }, 0); // Ensure the input is focused after the state is set
  };

  const handleSaveButtonClick = () => {
    if (newContent.trim() === "") {
      contentRef.current.focus();
      return;
    }
    handleUpdateContent(id, newContent.trim());
    setIsEditing(false);
  };

  const handleContentChange = (e) => {
    setNewContent(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveButtonClick();
    }
  };

  return (
    <div className="TodoItem">
      <input type="checkbox" checked={isDone} onChange={handleCheckboxChange} />
      {isEditing ? (
        <input
          type="text"
          value={newContent}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          ref={contentRef}
        />
      ) : (
        <div className="content">{content}</div>
      )}
      <div className="date">{new Date(date).toLocaleDateString()}</div>
      <button onClick={handleDeleteButtonClick}>삭제</button>
      {isEditing ? (
        <button onClick={handleSaveButtonClick}>저장</button>
      ) : (
        <button onClick={handleEditButtonClick}>수정</button>
      )}
    </div>
  );
};

export default memo(TodoItem);