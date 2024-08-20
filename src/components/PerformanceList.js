import React from 'react';
import { Link } from 'react-router-dom';

function PerformanceList() {
  const performances = [
    { id: 1, title: '햄릿', date: '2024-09-01' },
    { id: 2, title: '오페라의 유령', date: '2024-09-15' },
    { id: 3, title: '레 미제라블', date: '2024-10-01' },
  ];

  return (
    <div className="content">
      <h2>공연 목록</h2>
      <ul>
        {performances.map((performance) => (
          <li key={performance.id}>
            <h3>{performance.title}</h3>
            <p>날짜: {performance.date}</p>
            <Link to={`/performances/${performance.id}/waiting`}>대기열 참여</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PerformanceList;