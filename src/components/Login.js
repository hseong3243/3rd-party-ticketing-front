import React from 'react';

function Login({ onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 로그인 로직을 추가합니다.
    onLogin(); // 임시로 로그인 성공으로 처리
  };

  return (
    <div className="content">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">이메일:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">비밀번호:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login;