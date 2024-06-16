import { memo } from "react";
import "./Header.css";

const Header = () => {
  const date = new Date();
  const formattedDate = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/(\.)/g, '. ');

  return (
    <div className='Header'>
      <h2>오늘은 🗓️</h2>
      <h1>{formattedDate}</h1>
    </div>
  );
};

const memoizedHeader = memo(Header);

export default memoizedHeader;