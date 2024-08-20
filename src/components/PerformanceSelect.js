import React from 'react';
import { useParams, Link } from 'react-router-dom';

function PerformanceSelect() {
  const { performanceId } = useParams();

  return (
    <div className="content">
      <h2>좌석 선택</h2>
      <p>공연 ID: {performanceId}</p>
      <p>좌석 선택 UI가 여기에 들어갑니다.</p>
      <Link to={`/performances/${performanceId}/payment`}>결제하기</Link>
    </div>
  );
}

export default PerformanceSelect;