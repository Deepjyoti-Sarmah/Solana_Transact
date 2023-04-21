// import React from 'react'
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Connection, LAMPORTS_PER_SOL, Keypair, Transaction, SystemProgram } from "@solana/web3.js";
import {
    TOKEN_PROGRAM_ID,
    getOrCreateAssociatedTokenAccount,
    createTransferInstruction,
    TokenAccountNotFoundError,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { ENV, Strategy, TokenInfo, TokenListProvider } from "@solana/spl-token-registry";
import { WalletSendTransactionError } from "@solana/wallet-adapter-base";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { useEffect, useState } from "react";


interface TokenAccount {
    owner: string;
    mint: string;
    balance: number;
    decimalPlaces: number;
    name?: string;
    symbol?: string;
}

const HomePage = () =>  {
    const tokenAccInitialState: TokenAccount = {
        balance: 0,
        decimalPlaces: 0,
        mint:"",
        owner:"", 
    };

    const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(new Map());
    const [tokenAccounts, setTokenAccounts] = useState<TokenAccount[]>([]);
    const [selectedAcc, setSelectedAcc] = useState<TokenAccount>(tokenAccInitialState);
    const [transferAmount, setTransferAmount] = useState(0);
    const [receiverAddress, setReceiverAddress] = useState("");
    const [isValidAmount, setIsValidAmount] = useState(true);
    const [isValidAddress, setIsValidAddress] = useState(true);
    const [explorerLink, setExplorerLink] = useState("");
    const [transferStatus, setTransferStatus] = useState(false);
    const [ataStatus, setAtaStatus] = useState("NOT_INITIALIZED");
    const [isLoading, setIsLoading] = useState(false);

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    useEffect(() => {
        setTokenAccounts([]);
    }, [publicKey]);

    useEffect(() => {
        new TokenListProvider()
            .resolve(Strategy.Static)
            .then((tokens) => {
                const tokenList = tokens.filterByChainId(ENV.Devnet).getList();

                setTokenMap(
                    tokenList.reduce((map, item) => {
                        map.set(item.address, item);
                        return map;
                    }, new Map())
                );
        });
    }, []);

    useEffect(() => {
        if (!connection || !publicKey) {
            return;
        }
        getTokenInWallet(publicKey.toString(), connection);
    }, [connection, publicKey]);

    async function getTokenInWallet(wallet:string, solanaConnection: Connection) {
        //Get solana token data
        if (publicKey) {
            connection.getBalance(publicKey).then((solBalance) => {
                let solTokenAcc: TokenAccount = {
                    owner: publicKey.toString(),
                    mint: "SOLANA_MINT_ADDRESS",
                    balance: solBalance/ LAMPORTS_PER_SOL,
                    decimalPlaces: 10,
                    name: "Solana",
                    symbol: "SOL",
                };

                setTokenAccounts((prev) => [...prev, solTokenAcc]);
            });
        }

        //Get other tokens in wallet
        const accounts = await solanaConnection.getParsedProgramAccounts(TOKEN_PROGRAM_ID,{
            filters: [
                {
                    dataSize: 165, // number of bytes
                }, {
                    memcmp: {
                        offset: 32, //number of bytes
                        bytes: wallet, //base58 encoded string
                    },
                },
            ],
        });

        accounts.forEach(async (account, i) => {
            let tokenAcc: TokenAccount = {
                owner: "",
                mint: "",
                balance: 0,
                decimalPlaces: 0,
            };
            const parsedAccountInfo: any = account.account.data;
            const mint = parsedAccountInfo["parsed"]["info"]["mint"];
            const decimals = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["decimals"];
            const tokenBalance = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
            tokenAcc.owner = account.pubkey.toString();
            tokenAcc.mint = mint;
            tokenAcc.balance = tokenBalance;
            tokenAcc.decimalPlaces = decimals;

            //Try to fetch matadata
            try {
                const mintPubKey = new PublicKey(mint);
                let pda = await (Metadata as any).getPDA(mintPubKey);
                let res = await (Metadata as any).load(connection, pda);

                tokenAcc.name = res.data.data.name;
                tokenAcc.symbol = res.data.data.data.symbol;
            } catch( TypeError) {
                console.error(TypeError);
            }

            try {
                const token = tokenMap.get(mint);
                if(token) {
                    tokenAcc.name = token.name;
                    tokenAcc.symbol = token.symbol;
                }
            } catch (error) {
                console.error(error);
            }
            setTokenAccounts((prev) => [...prev, tokenAcc]);
        });
    };

    

    return (
    <>
        <div className='bg-gradient-to-b from-gray-600 to-gray-950 min-h-screen text-white flex flex-col '>
            <form >
                <div className='container mx-auto max-w-7xl pt-20 md:pt-64 pb-12 px-4 text-center flex-grow-0'>
                    <h1 className='text-3xl md:text-5xl font-extrabold tracking-tight'>
                        <span className='bg-clip-text text-transparent bg-gradient-to-b from-purple-300 to-blue-500'>
                            Solana Transfer
                        </span>
                    </h1>
                </div>
                
                <div className='w-11/12 md:w-6/12 mx-auto mb-3 text-white'>
                    <label htmlFor="recipientAdress"
                        className='text-xl font-bold' >
                            Enter recipient adress
                        <input type="text" name="recipientAdress" placeholder='Enter address'
                            className='px-3 py-3 text-gray-600 placeholder-blueGray-300 relative bg-white rounded text-md border-0 shadow outline-none focus:outline-none focus:ring w-full'
                        />
                    </label>
                </div>
                
                <div className='w-11/12 md:w-6/12 mx-auto mb-3 text-white'>
                    <label htmlFor="amount"
                        className='text-xl font-bold'
                    >   Amount
                        <input type="number" name="amount" min={0}
                            className='px-3 py-3 text-gray-600 placeholder-blueGray-300 relative bg-white rounded text-md border-0 shadow outline-none focus:outline-none focus:ring w-full'
                        />
                    </label>
                </div>
                
                <div className='w-11/12 md:w-6/12 mx-auto mb-3 text-white'>
                    <label htmlFor='selectedTokenAccount'
                        className='text-xl font-bold'
                    >
                        Choose token
                        <select id='selectedTokenAccount' name='selectedTokenAccount'
                            className='px-3 py-3 text-gray-500 placeholder-blueGray-300 relative bg-white rounded text-md border-0 shadow outline-none focus:outline-none focus:ring w-full'
                        >
                            <option>
                                Select a token
                            </option>
                        </select>
                    </label>
                </div>
                    
                <div className='m-1 flex flex-col items-center'>
                    <button type="submit"
                        className='bg-blue-600  text-white active:bg-blue-800 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                    >Submit</button>
                </div>
            </form>
        </div >
    </>
    )
}


export default HomePage;