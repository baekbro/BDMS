package blockchain


import (
	"context"
	"fmt"
	"math/big"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"crypto/ecdsa" 
    // "github.com/ethereum/go-ethereum/common/hexutil"
    "github.com/ethereum/go-ethereum/crypto" 
    "github.com/ethereum/go-ethereum/core/types"
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

// GetBalance : 특정 지갑 주소의 잔액(Wei 단위)을 조회합니다.
func (c *EthereumClient) GetBalance(address string) (*big.Int, error) {
    // 1. 문자열 주소를 Go가 이해하는 주소 타입으로 변환
    account := common.HexToAddress(address)
    // 2. 잔액 조회 (BlockNumber를 nil로 하면 최신 상태 기준)
    // 주의: c.client 부분은 구조체 필드명에 따라 c.Client 일 수도 있습니다!
    return c.Client.BalanceAt(context.Background(), account, nil)
}

// func CreateWallet() (string, string, error) {
//     // 1. 개인키(Private Key) 생성 (ECDSA 알고리즘)
//     privateKey, err := crypto.GenerateKey()
//     if err != nil {
//         return "", "", err
//     }

//     // 2. 개인키를 문자열(Hex)로 변환 (저장하거나 볼 수 있게)
//     privateKeyBytes := crypto.FromECDSA(privateKey)
//     privateKeyHex := hexutil.Encode(privateKeyBytes)[2:] // 앞의 "0x" 제거

//     // 3. 공개키(Public Key) 추출
//     publicKey := privateKey.Public()
//     publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
//     if !ok {
//         return "", "", err
//     }

//     // 4. 공개키로 지갑 주소(Address) 생성
//     address := crypto.PubkeyToAddress(*publicKeyECDSA).Hex()

//     return privateKeyHex, address, nil
// }

// LoadWallet : 개인키(Hex 문자열)를 입력받아 지갑 정보를 불러옵니다.
func LoadWallet(privateKeyHex string) (string, error) {
    // 1. 개인키 문자열을 ECDSA 키로 변환
    // (만약 "0x"가 붙어있다면 제거하고 처리해야 합니다. 여기서는 crypto.HexToECDSA가 처리)
    // 보통 입력할 때 "0x" 없이 64자리 문자열만 넣거나, 코드에서 잘라내야 합니다.
    // 여기서는 간단히 앞의 "0x"가 있다면 잘라내는 처리를 추가하겠습니다.
    if len(privateKeyHex) > 2 && privateKeyHex[:2] == "0x" {
        privateKeyHex = privateKeyHex[2:]
    }

    privateKey, err := crypto.HexToECDSA(privateKeyHex)
    if err != nil {
        return "", err
    }

    // 2. 공개키 추출 및 주소 변환 (CreateWallet과 동일한 로직)
    publicKey := privateKey.Public()
    publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
    if !ok {
        return "", fmt.Errorf("공개키 변환 오류")
    }

    address := crypto.PubkeyToAddress(*publicKeyECDSA).Hex()
    
    return address, nil
}

// TransferETH : 특정 주소로 이더리움을 송금합니다.
func (c *EthereumClient) TransferETH(privKeyHex string, toAddrStr string, amountWei *big.Int) (string, error) {
    // 1. 개인키 정리 (0x 제거 및 변환)
    if len(privKeyHex) > 2 && privKeyHex[:2] == "0x" {
        privKeyHex = privKeyHex[2:]
    }
    privateKey, err := crypto.HexToECDSA(privKeyHex)
    if err != nil {
        return "", err
    }

    // 2. 보내는 사람(From) 주소 추출
    publicKey := privateKey.Public()
    publicKeyECDSA, _ := publicKey.(*ecdsa.PublicKey)
    fromAddress := crypto.PubkeyToAddress(*publicKeyECDSA)

    // 3. 받는 사람(To) 주소 변환
    toAddress := common.HexToAddress(toAddrStr)

    // 4. Nonce 가져오기 (거래 순서 번호)
    nonce, err := c.Client.PendingNonceAt(context.Background(), fromAddress)
    if err != nil {
        return "", err
    }

    // 5. 가스비(수수료) 설정
    gasLimit := uint64(21000) // 일반적인 이더리움 송금은 21,000 가스 고정
    gasPrice, err := c.Client.SuggestGasPrice(context.Background())
    if err != nil {
        return "", err
    }

    // 6. 트랜잭션(봉투) 생성 (Legacy 방식)
    tx := types.NewTransaction(nonce, toAddress, amountWei, gasLimit, gasPrice, nil)

    // 7. 서명(Sign) - 내 개인키로 도장 찍기
    chainID, err := c.Client.NetworkID(context.Background())
    if err != nil {
        return "", err
    }
    signedTx, err := types.SignTx(tx, types.NewEIP155Signer(chainID), privateKey)
    if err != nil {
        return "", err
    }

    // 8. 전송(Send) - 네트워크에 뿌리기
    err = c.Client.SendTransaction(context.Background(), signedTx)
    if err != nil {
        return "", err
    }

    // 트랜잭션 해시(영수증 번호) 반환
    return signedTx.Hash().Hex(), nil
}