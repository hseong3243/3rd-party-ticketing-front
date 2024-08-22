import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import config from '../config';
import useAuthStore from '../store';
import useCounterStore from '../counterStore';

function PerformanceSelect() {
  const { performanceId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const { accessToken } = useAuthStore(state => ({ accessToken: state.accessToken }));
  const setRemainingCount = useCounterStore(state => state.setRemainingCount);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/performances/${performanceId}/seats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'performanceId': `${performanceId}`
          },
        });

        if (!response.ok) {
          throw new Error('좌석 정보를 불러오는 데 실패했습니다.');
        }

        const data = await response.json();

        if ('remainingCount' in data) {
          // 대기열 정보
          setRemainingCount(data.remainingCount);
          setIsWaiting(true);
        } else {
          // 좌석 정보
          const sortedSeats = data.items.sort((a, b) => a.seatId - b.seatId);
          const numberedSeats = sortedSeats.map((seat, index) => ({
            ...seat,
            displayNumber: index + 1
          }));
          setSeats(numberedSeats);
          setIsWaiting(false);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSeats();
  }, [performanceId, accessToken, setRemainingCount]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (isWaiting) return <div>대기열에 진입했습니다. 잠시만 기다려주세요.</div>;

  const selectSeat = (seatId) => {
    setSelectedSeat(seatId);
  };

  const rows = [];
  for (let i = 0; i < seats.length; i += 15) {
    rows.push(seats.slice(i, i + 15));
  }

  return (
    <div className="content">
      <h2>좌석 선택</h2>
      <p>공연 ID: {performanceId}</p>
      <div className="seat-grid" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', gap: '5px' }}>
            {row.map((seat) => (
              <button
                key={seat.seatId}
                className={`seat ${seat.seatAvailable ? 'available' : 'unavailable'} ${selectedSeat === seat.seatId ? 'selected' : ''}`}
                disabled={!seat.seatAvailable}
                onClick={() => seat.seatAvailable && selectSeat(seat.seatId)}
                style={{
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '12px',
                  border: '1px solid #ccc',
                  backgroundColor: selectedSeat === seat.seatId ? '#4CAF50' : 
                                   seat.seatAvailable ? '#fff' : '#ff0000',
                  cursor: seat.seatAvailable ? 'pointer' : 'not-allowed',
                  color: selectedSeat === seat.seatId ? '#fff' : 
                         seat.seatAvailable ? '#000' : '#fff'
                }}
              >
                {seat.seatAvailable ? seat.displayNumber : 'X'}
              </button>
            ))}
          </div>
        ))}
      </div>
      <p>선택된 좌석: {selectedSeat ? seats.find(seat => seat.seatId === selectedSeat)?.displayNumber : '없음'}</p>
      <Link to={`/performances/${performanceId}/payment`} 
            style={{ 
              pointerEvents: !selectedSeat ? 'none' : 'auto',
              opacity: !selectedSeat ? 0.5 : 1
            }}>
        결제하기
      </Link>
    </div>
  );
}

export default PerformanceSelect;