import React from 'react';
import { useParams, Link } from 'react-router-dom';

function PerformancePayment() {
  const { performanceId } = useParams();

  return (
    <div className="content">
      <h2>공연 결제</h2>
      <p>공연 ID: {performanceId}</p>
      <p>선택한 좌석: A-15</p>
      <p>결제 금액: 50,000원</p>
      <button>결제하기</button>
      <Link to="/">홈으로 돌아가기</Link>
    </div>
  );
}

export default PerformancePayment;