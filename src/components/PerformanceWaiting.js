import React from 'react';
import { useParams, Link } from 'react-router-dom';

function PerformanceWaiting() {
  const { performanceId } = useParams();

  return (
    <div className="content">
      <h2>공연 대기열</h2>
      <p>공연 ID: {performanceId}</p>
      <p>현재 대기 순번: 15번</p>
      <p>예상 대기 시간: 약 5분</p>
      <Link to={`/performances/${performanceId}/select`}>좌석 선택으로 이동</Link>
    </div>
  );
}

export default PerformanceWaiting;