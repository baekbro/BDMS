package blockchain

import (
	"context"
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/ethclient"
)

// EthereumClient 구조체 정의
type EthereumClient struct {
	Client *ethclient.Client
}

// NewEthereumClient: 이더리움 네트워크에 연결하는 생성자 함수
func NewEthereumClient(rpcURL string) (*EthereumClient, error) {
	// 1. ethclient.Dial을 통해 노드와 연결 시도
	client, err := ethclient.Dial(rpcURL)
	if err != nil {
		return nil, fmt.Errorf("이더리움 클라이언트 연결 실패: %v", err)
	}

	return &EthereumClient{Client: client}, nil
}

// GetLatestBlockNumber: 현재 가장 최신 블록 번호를 가져오는 함수
func (ec *EthereumClient) GetLatestBlockNumber() (*big.Int, error) {
	// 2. HeaderByNumber(nil)은 최신 헤더(블록 정보)를 가져옵니다.
	header, err := ec.Client.HeaderByNumber(context.Background(), nil)
	if err != nil {
		return nil, fmt.Errorf("블록 정보 조회 실패: %v", err)
	}

	return header.Number, nil
}