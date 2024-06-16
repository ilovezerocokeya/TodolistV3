import { memo, useContext, useRef, useState } from "react";
import "./Editor.css";
import { TodoDispatchContext } from "../App";

const Editor = () => {
  const { handleCreate } = useContext(TodoDispatchContext);
  const [content, setContent] = useState("");
  const contentRef = useRef();

  // 입력 필드의 값이 변경될 때 호출되는 함수입니다.
  const handleChangeContent = (e) => {
    setContent(e.target.value);
  };

  // 입력 필드에서 키를 누를 때 호출되는 함수입니다.
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // 추가 버튼을 클릭하거나 엔터 키를 누를 때 호출되는 함수입니다.
  const handleSubmit = () => {
    if (content.trim() === "") {
      contentRef.current.focus();
      return;
    }
    handleCreate(content.trim());
    setContent("");
  };

  return (
    <div className="Editor">
      <input
        value={content}
        onChange={handleChangeContent}
        onKeyDown={handleKeyDown}
        placeholder="해야 할 일을 입력해 주세요"
        ref={contentRef}
      />
      <button onClick={handleSubmit}>추가</button>
    </div>
  );
};

export default memo(Editor);