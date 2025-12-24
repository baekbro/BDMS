import { useState } from 'react'
import './App.css'

function App() {
  // 1. 조회 관련 상태
  const [address, setAddress] = useState('') 
  const [balanceData, setBalanceData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // 2. 송금 관련 상태 (새로 추가됨)
  const [toAddress, setToAddress] = useState('')
  const [sendAmount, setSendAmount] = useState('')
  const [transferLoading, setTransferLoading] = useState(false)
  const [transferMsg, setTransferMsg] = useState(null)

  // --- 잔액 조회 함수 ---
  const handleCheckBalance = () => {
    if (!address) {
      alert('지갑 주소를 입력해주세요!')
      return
    }
    setLoading(true)
    setError(null)
    setTransferMsg(null) // 송금 메시지 초기화

    fetch(`/api/balance?address=${address}`)
      .then((res) => {
        if (!res.ok) return res.text().then(text => { throw new Error(text) })
        return res.json()
      })
      .then((data) => {
        console.log('조회 성공:', data)
        setBalanceData(data)
      })
      .catch((err) => {
        console.error('조회 에러:', err)
        setError(err.message)
        setBalanceData(null)
      })
      .finally(() => setLoading(false))
  }

  // --- 송금 함수 (새로 추가됨) ---
  const handleTransfer = () => {
    if (!address || !toAddress || !sendAmount) {
      alert('보내는 사람, 받는 사람, 금액을 모두 입력해주세요.')
      return
    }

    setTransferLoading(true)
    setTransferMsg(null)

    // 백엔드로 보낼 데이터 준비
    const payload = {
      from: address,       // 내 주소
      to: toAddress,       // 받는 사람 주소
      amount: parseFloat(sendAmount) // 보낼 수량 (숫자로 변환)
    }

    fetch('/api/transfer', {
      method: 'POST', // 송금은 데이터를 생성하므로 POST 사용
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload) // 데이터를 JSON 문자로 변환해서 전송
    })
      .then((res) => {
        if (!res.ok) return res.text().then(text => { throw new Error(text) })
        return res.json()
      })
      .then((data) => {
        console.log('송금 성공:', data)
        setTransferMsg(`✅ 송금 성공! (${sendAmount} ETH)`)
        // 송금 후 잔액이 바뀌었으니 다시 조회!
        handleCheckBalance()
        // 입력창 비우기
        setSendAmount('') 
      })
      .catch((err) => {
        console.error('송금 에러:', err)
        alert(`송금 실패: ${err.message}`)
      })
      .finally(() => {
        setTransferLoading(false)
      })
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>🪙 Crypto Wallet</h1>
      
      {/* 1. 지갑 주소 입력 및 조회 */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <input 
          type="text" 
          placeholder="내 지갑 주소 (From)" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ padding: '10px', width: '60%', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={handleCheckBalance}
          disabled={loading}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {loading ? '...' : '조회'}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>⚠️ {error}</div>}

      {/* 2. 잔액 표시 카드 */}
      {balanceData && (
        <div style={{ padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', backgroundColor: '#f9f9f9', marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#555' }}>내 잔액</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>
            {parseFloat(balanceData.balance_eth).toLocaleString()} <span style={{ fontSize: '1.2rem', color: '#888' }}>ETH</span>
          </div>
        </div>
      )}

      {/* 3. 송금하기 UI (잔액 조회가 성공했을 때만 보여줌) */}
      {balanceData && (
        <div style={{ borderTop: '2px dashed #eee', paddingTop: '30px' }}>
          <h3>💸 송금하기 (Transfer)</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="받는 사람 주소 (To Address)" 
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              style={{ padding: '10px', width: '80%', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            
            <div style={{ display: 'flex', gap: '10px', width: '85%', justifyContent: 'center' }}>
              <input 
                type="number" 
                placeholder="수량 (ETH)" 
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                style={{ padding: '10px', flex: 1, borderRadius: '5px', border: '1px solid #ccc' }}
              />
              <button 
                onClick={handleTransfer}
                disabled={transferLoading}
                style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                {transferLoading ? '전송 중...' : '보내기'}
              </button>
            </div>
          </div>

          {/* 송금 성공 메시지 */}
          {transferMsg && (
            <div style={{ marginTop: '20px', color: '#28a745', fontWeight: 'bold' }}>
              {transferMsg}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App