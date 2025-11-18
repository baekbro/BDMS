import React from 'react';
import './main.css';

import { FaFilePdf, FaRegQuestionCircle } from 'react-icons/fa';
import { GoMegaphone } from 'react-icons/go';
import { BsPerson } from 'react-icons/bs';
import Header from '../Components/header';

export default function Main() {
  return (
    <div className="app-container">
      <Header />
      {/* 2. 서브 네비게이션 */}
      <nav className="sub-nav">
        <a href="#" className="active">개인발급여</a>
        <a href="#">개인연말정산</a>
      </nav>

      {/* 3. 메인 컨텐츠 + 사이드바 래퍼 */}
      <div className="page-wrapper">

        {/* 3-1. 메인 컨텐츠 (왼쪽 영역) */}
        <main className="main-content">
          
          {/* 상단 6개 메뉴 그리드 */}
          <section className="menu-grid">
            <MenuCard 
              title="전자세금계산서"
              links={["세금계산서 발급", "화사정보 관리", "거래처 관리", "거래항목 관리"]}
            />
            <MenuCard 
              title="인사급여"
              links={["임직원관리", "급여대장관리", "4대보험관리", "신규직원입사", "기준직원퇴사", "급여시뮬레이션"]}
            />
            <MenuCard 
              title="회계관리"
              links={["통장거래관리", "증빙거래관리", "자산관리", "재무제표", "매출거래관리", "공통매입관리"]}
            />
            <MenuCard 
              title="세금납부"
              links={["세금납부관리", "부가가치세신고", "원천세신고", "과세자료관리", "연말정산신고", "법인세관리"]}
            />
            <MenuCard 
              title="BDMS"
              links={["BDMS공지", "사내공지", "작업요청", "문의요청", "증명서발급"]}
            />
            <MenuCard 
              title="환경설정"
              links={["회사정보", "주주명부", "차량관리", "4대보험공단", "급여항목관리"]}
            />
          </section>

          {/* 하단 공지사항 및 요청사항 */}
          <section className="bottom-content">
            
            {/* 공지사항 */}
            <div className="notice-board">
              <div className="board-header">
                <h3>공지사항 및 업무매뉴얼</h3>
                <a href="#" className="more-link">더보기 &gt;</a>
              </div>
              <ul className="notice-list">
                <li>
                  <span>2023.10.26</span>
                  <strong>[News] 2023년 10월 기준 사업 급여업무 매뉴얼...</strong>
                  <FaFilePdf className="pdf-icon" />
                  <span>BDMS</span>
                  <span>147</span>
                </li>
                <li>
                  <span>2022.01.05</span>
                  <strong>[News] 2022년 두루누리/일자리안정자금/일용직국...</strong>
                  <span>BDMS</span>
                  <span>308</span>
                </li>
                <li>
                  <span>2021.12.16</span>
                  <strong>[FAQ] 우편물 송달지 변경에 대한 안내</strong>
                  <span className="pdf-icon-placeholder">국세청</span>
                  <span>BDMS</span>
                  <span>153</span>
                </li>
                {/* ...기타 항목... */}
              </ul>
            </div>

            {/* 요청 및 업무 리스트 */}
            <div className="status-boxes">
              <div className="status-box">
                <div className="board-header">
                  <h3>요청 및 질문사항</h3>
                  <a href="#" className="more-link">더보기 &gt;</a>
                </div>
                <p className="no-content">등록된 요청 및 질문사항이 없습니다.</p>
              </div>
              <div className="status-box">
                <div className="board-header">
                  <h3>수행하실 업무리스트</h3>
                  <a href="#" className="more-link">더보기 &gt;</a>
                </div>
                <p className="no-content">등록된 업무리스트가 없습니다.</p>
              </div>
            </div>

          </section>
        </main>

        {/* 3-2. 사이드바 (오른쪽 영역) */}
        <aside className="sidebar">
          
          {/* 로그인 정보 */}
          <div className="sidebar-box user-info">
            <div className="user-info-header">
              <span>2025년 11월 15일 오후 7:11</span>
              <button className="logout-button">로그아웃</button>
            </div>
            <p className="welcome-message"><strong>김석진 님</strong>, 안녕하세요.</p>
            <div className="user-actions">
              <button><GoMegaphone /> 업무요청</button>
              <button><FaRegQuestionCircle /> 질문답변</button>
              <button><BsPerson /> 개인정보</button>
            </div>
          </div>

          {/* 개인정보 */}
          <div className="sidebar-box">
            <h4>개인정보 : 급여명세서 ...</h4>
            <p>4대보험 ... 과세자료관리 ... <a href="#">내역보기</a></p>
            <p>작업요청 · 증명서발급 ... <a href="#">문의요청</a></p>
          </div>

          {/* 상담문의 */}
          <div className="sidebar-box">
            <h4>상담문의 1544-3572</h4>
            <p>(월~금 10:00~18:00, 점심 12~13시 제외)</p>
          </div>
          
          {/* 바로가기 링크 */}
          <div className="sidebar-box quick-links">
            <a href="#" className="quick-link">BDMS 경영관리시스템 사용안내 &gt;</a>
            <a href="#" className="quick-link">기업회원 신규가입 및 이용안내 &gt;</a>
            <a href="#" className="quick-link">기업회원 소속 임직원 이용안내 &gt;</a>
          </div>

          {/* 오시는 길 */}
          <div className="sidebar-box quick-links">
            <a href="#" className="quick-link">오시는 길 &gt;</a>
          </div>

          {/* 외부 링크 (국세청 등) */}
          <div className="external-links">
            <img src="https://via.placeholder.com/130x50.png?text=e세로+로고" alt="e세로" />
            <img src="https://via.placeholder.com/130x50.png?text=HomeTax+로고" alt="Hometax" />
          </div>

        </aside>
      </div>
    </div>
  );
}

// 반복되는 메뉴 카드를 위한 재사용 컴포넌트
function MenuCard({ title, links }) {
  return (
    <div className="menu-card">
      <h3>{title}</h3>
      <ul>
        {links.map((link) => (
          <li key={link}><a href="#">{link}</a></li>
        ))}
      </ul>
    </div>
  );
}