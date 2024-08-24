import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const getCommonHeaders = useCallback((includeContentType = true) => {
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'performanceId': `${performanceId}`
    };
    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }, [accessToken, performanceId]);

  const fetchSeats = useCallback(async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/performances/${performanceId}/seats`, {
        method: 'GET',
        headers: getCommonHeaders()
      });

      if (!response.ok) {
        throw new Error('좌석 정보를 불러오는 데 실패했습니다.');
      }

      const data = await response.json();

      if ('remainingCount' in data) {
        setRemainingCount(data.remainingCount);
        setIsWaiting(true);
        navigate(`/performances/${performanceId}/waiting`);
      } else {
        setSeats(data.items);
        setIsWaiting(false);
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [performanceId, getCommonHeaders, setRemainingCount, navigate]);

  useEffect(() => {
    fetchSeats();

    const eventSource = new EventSource(`${config.API_URL}/api/subscribe/performances/${performanceId}`, {
      headers: getCommonHeaders(false)
    });

    eventSource.onopen = () => {
      console.log("SSE 연결됨");
    }

    eventSource.addEventListener('SELECT', (event) => {
      console.log("SELECT 이벤트 수신:", event);
      try {
        const data = JSON.parse(event.data);
        console.log("파싱된 데이터:", data);
        if (data.status === "SELECTED") {
          setSeats(prevSeats => {
            console.log("이전 좌석 상태:", prevSeats);
            const updatedSeats = prevSeats.map(seat => 
              String(seat.seatId) === data.seatId ? { ...seat, seatAvailable: false } : seat
            );
            console.log("업데이트된 좌석 상태:", updatedSeats);
            return updatedSeats;
          });
        }
      } catch (error) {
        console.error("이벤트 데이터 파싱 오류:", error);
      }
    });

    eventSource.onerror = (error) => {
      console.error('SSE 에러:', error);
      eventSource.close();
    };

    return () => {
      console.log("이벤트 소스 닫힘");
      eventSource.close();
    };
  }, [performanceId, getCommonHeaders, fetchSeats]);

  const selectSeat = useCallback((seatId) => {
    setSelectedSeat(seatId);
  }, []);

  const handlePayment = useCallback(async () => {
    if (selectedSeat) {
      try {
        const sseResponse = await fetch(`${config.API_URL}/api/performances/${performanceId}/seats/${selectedSeat}/select`, {
          method: 'POST',
          headers: getCommonHeaders()
        });

        if (!sseResponse.ok) {
          throw new Error('SSE 이벤트 발생에 실패했습니다.');
        }

        const dbResponse = await fetch(`${config.API_URL}/api/seats/select`, {
          method: 'POST',
          headers: getCommonHeaders(),
          body: JSON.stringify({
            seatId: selectedSeat
          })
        });

        if (!dbResponse.ok) {
          throw new Error('좌석 선택에 실패했습니다.');
        }

        const selectedSeatInfo = seats.find(seat => seat.seatId === selectedSeat);
        navigate(`/performances/${performanceId}/payment`, { 
          state: { 
            seatId: selectedSeat, 
            seatCode: selectedSeatInfo.seatCode 
          } 
        });
      } catch (err) {
        setError(err.message);
      }
    }
  }, [selectedSeat, performanceId, getCommonHeaders, seats, navigate]);

  const getShortSeatCode = useCallback((seatCode) => {
    return seatCode.slice(-3);
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (isWaiting) return <div>대기열에 진입했습니다. 잠시만 기다려주세요.</div>;

  const rows = [];
  for (let i = 0; i < seats.length; i += 10) {
    rows.push(seats.slice(i, i + 10));
  }

  return (
    <div className="content">
      <h2>좌석 선택</h2>
      <p>공연 ID: {performanceId}</p>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }}>
      <div className="seat-grid" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', gap: '5px' }}>
            {row.map((seat) => (
              <button
                key={seat.seatId}
                className={`seat ${seat.seatAvailable ? 'available' : 'unavailable'} ${selectedSeat === seat.seatId ? 'selected' : ''}`}
                disabled={!seat.seatAvailable}
                onClick={() => seat.seatAvailable && selectSeat(seat.seatId)}
                style={{
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '10px',
                  border: '1px solid #ccc',
                  backgroundColor: selectedSeat === seat.seatId ? '#4CAF50' : 
                                   seat.seatAvailable ? '#fff' : '#ff0000',
                  cursor: seat.seatAvailable ? 'pointer' : 'not-allowed',
                  color: selectedSeat === seat.seatId ? '#fff' : 
                         seat.seatAvailable ? '#000' : '#fff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  padding: '0 2px'
                }}
              >
                {getShortSeatCode(seat.seatCode)}
              </button>
            ))}
          </div>
        ))}
      </div>
      </div>
      <p>선택된 좌석: {selectedSeat ? seats.find(seat => seat.seatId === selectedSeat)?.seatCode : '없음'}</p>
      <button 
        onClick={handlePayment}
        disabled={!selectedSeat}
        style={{ 
          opacity: selectedSeat ? 1 : 0.5,
          cursor: selectedSeat ? 'pointer' : 'not-allowed'
        }}
      >
        결제하기
      </button>
    </div>
  );
}

export default PerformanceSelect;