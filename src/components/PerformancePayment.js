import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

function PerformancePayment() {
  const { performanceId } = useParams();
  const location = useLocation();
  const { seatId, seatNumber } = location.state || {};

  const seatInfo = seatNumber ? `좌석 번호: ${seatNumber} (ID: ${seatId})` : '좌석 정보 없음';

  // 버튼을 위한 공통 스타일
  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    color: 'white',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  };

  return (
    <div className="content" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>공연 결제</h2>
      <p>공연 ID: {performanceId}</p>
      <p>선택한 좌석: {seatInfo}</p>
      <p>결제 금액: 50,000원</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button style={buttonStyle}>
          결제하기
        </button>
        <Link to="/" style={{ ...buttonStyle, backgroundColor: '#f44336' }}>
          홈
        </Link>
      </div>
    </div>
  );
}

export default PerformancePayment;