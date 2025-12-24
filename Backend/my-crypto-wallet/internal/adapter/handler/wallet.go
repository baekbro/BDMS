package handler

import (
	"math/big"
	"math"
	"net/http"
	"my-crypto-wallet/internal/adapter/blockchain"
	"github.com/gin-gonic/gin"
)

// WalletHandler : 블록체인 클라이언트를 가지고 있는 구조체
type WalletHandler struct {
	Client *blockchain.EthereumClient
}

// GetBalance : GET /balance?address=0x... 요청을 처리하는 함수
func (h *WalletHandler) GetBalance(c *gin.Context) {
	// 1. URL 쿼리 파라미터에서 주소 가져오기
	address := c.Query("address")
	if address == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "address 파라미터가 필요합니다."})
		return
	}

	// 2. 블록체인에서 잔액 조회 (Wei 단위)
	balanceWei, err := h.Client.GetBalance(address)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 3. Wei -> ETH 변환 (보기 좋게)
	balanceEth := new(big.Float).SetInt(balanceWei)
	balanceEth = balanceEth.Quo(balanceEth, big.NewFloat(math.Pow10(18)))

	// 4. JSON으로 응답 (Express의 res.json과 동일)
	c.JSON(http.StatusOK, gin.H{
		"address": address,
		"balance_wei": balanceWei.String(),
		"balance_eth": balanceEth.String(),
	})
}
// ... 기존 import 아래에 추가 ...

// TransferRequest : 송금 요청 때 받을 데이터 틀 (JSON)
type TransferRequest struct {
	PrivateKey string `json:"private_key"` // 보내는 사람 키
	ToAddress  string `json:"to_address"`  // 받는 사람 주소
	Amount     string `json:"amount"`      // 보낼 금액 (ETH 단위, 예: "0.001")
}

// Transfer : POST /transfer 요청을 처리하는 함수
func (h *WalletHandler) Transfer(c *gin.Context) {
	var req TransferRequest

	// 1. 사용자가 보낸 JSON 데이터를 읽어서 변수에 넣기
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "데이터 형식이 잘못되었습니다."})
		return
	}

	// 2. ETH 단위 문자열 -> Wei 단위 big.Int 로 변환
	// (1 ETH = 10^18 Wei)
	amountEth, success := new(big.Float).SetString(req.Amount)
	if !success {
		c.JSON(http.StatusBadRequest, gin.H{"error": "금액 숫자가 이상합니다."})
		return
	}
	
	amountWei := new(big.Float).Mul(amountEth, big.NewFloat(math.Pow10(18)))
	amountInt := new(big.Int)
	amountWei.Int(amountInt) // Float -> Int 변환

	// 3. 블록체인으로 송금 실행
	txHash, err := h.Client.TransferETH(req.PrivateKey, req.ToAddress, amountInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "송금 실패: " + err.Error()})
		return
	}

	// 4. 성공 결과 응답
	c.JSON(http.StatusOK, gin.H{
		"message": "송금 성공!",
		"tx_hash": txHash,
		"link":    "https://sepolia.etherscan.io/tx/" + txHash,
	})
}