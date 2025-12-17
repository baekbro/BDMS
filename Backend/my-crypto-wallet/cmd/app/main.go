package main

import (
	"fmt"
	"log"
	"my-crypto-wallet/internal/adapter/blockchain" // 패키지 경로 주의!
)

func main() {
	// 1. 연결할 이더리움 노드 주소 (Sepolia 테스트넷 공용 RPC URL)
	// (Infura나 Alchemy 키 없이도 쓸 수 있는 공용 노드입니다)
	rpcURL := "https://rpc.sepolia.org" 

	fmt.Println("🔗 이더리움(Sepolia) 네트워크 연결 시도 중...")

	// 2. 클라이언트 생성 (연결)
	ethClient, err := blockchain.NewEthereumClient(rpcURL)
	if err != nil {
		log.Fatalf("❌ 연결 오류 발생: %v", err)
	}
	fmt.Println("✅ 이더리움 클라이언트 연결 성공!")

	// 3. 최신 블록 번호 가져오기
	blockNum, err := ethClient.GetLatestBlockNumber()
	if err != nil {
		log.Fatalf("❌ 블록 조회 오류 발생: %v", err)
	}

	fmt.Printf("🧱 현재 Sepolia 네트워크의 최신 블록 번호: %s\n", blockNum.String())
}