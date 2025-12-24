package main

import (
	"log"
	"my-crypto-wallet/internal/adapter/blockchain"
	"my-crypto-wallet/internal/adapter/handler" // 방금 만든 핸들러 패키지

	"github.com/gin-gonic/gin"
)

func main() {
	// 1. 이더리움 네트워크 연결 (서버 켜질 때 한 번만 연결)
	rpcURL := "https://1rpc.io/sepolia"
	ethClient, err := blockchain.NewEthereumClient(rpcURL)
	if err != nil {
		log.Fatalf("❌ 이더리움 연결 실패: %v", err)
	}
	log.Println("✅ 이더리움 클라이언트 연결 완료")

	// 2. Gin 웹 서버 생성 (Express의 app = express() 와 비슷)
	r := gin.Default()

	// 3. 핸들러 초기화 (의존성 주입)
	walletHandler := &handler.WalletHandler{Client: ethClient}

	// 4. 라우팅 설정
	// GET /balance 요청이 오면 walletHandler.GetBalance 함수 실행
	r.GET("/balance", walletHandler.GetBalance)
	r.POST("/transfer", walletHandler.Transfer)
	// 5. 서버 시작 (8080 포트)
	log.Println("🚀 서버가 8080 포트에서 시작되었습니다!")
	r.Run(":8080")
}