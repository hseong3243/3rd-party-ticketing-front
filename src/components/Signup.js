import React from 'react';

function Signup() {
  return (
    <div className="content">
      <h2>회원가입</h2>
      <form>
        <div>
          <label htmlFor="username">사용자 이름:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div>
          <label htmlFor="email">이메일:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">비밀번호:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">가입하기</button>
      </form>
    </div>
  );
}

export default Signup;