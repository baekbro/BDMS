import React from 'react';

function Header() {
  return (
    <header className="top-header">
      <div className="logo">BDMS</div>
      <nav className="main-nav">
        <a href="#!">개인정보</a>
        <a href="#!" className="active">개인발급여</a>
        <a href="#!">증명서발급</a>
        <a href="#!">BDMS</a>
        <a href="#!">과세자료신고</a>
        <a href="#!">4대보험관리</a>
      </nav>
      <div className="company-info">
        주식회사 창업지원단
      </div>
    </header>
  );
}

export default Header;