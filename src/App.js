import React, { useEffect, useState } from "react";
import { ethers } from "ethers"; // Import ethers.js library
import StakingA from "./abis/StakingA.json";
import Token from "./abis/Token.json";
import "./App.css";
import Swal from "sweetalert2";

// Smart Contract Address (replace with your own)
const StakingAAddress = "0x11652D7B587b7cffd5a3683A0d9991164c2DB0f3";
const TokenAddress = "0x09e6E20FF399c2134C14232E172ce8ba2b03017E";

const App = () => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);
  const [isMetaMaskLoggedIn, setIsMetaMaskLoggedIn] = useState(true);
  const [walletAddress, setWalletAddress] = useState(StakingAAddress);
  const [walletAddressS, setWalletAddressS] = useState('');
  const [TotalStaked, setTotalStaked] = useState(0);
  const [KendiStakelerimG, setKendiStakelerimG] = useState([]);
  const [stakeAmount, setstakeAmount] = useState(0);
  const [TXH, setTXH] = useState(1);
  const [LoadBalanceD, setLoadBalanceD] = useState(1);
  const [StakeOption, setStakeOption] = useState(0);
  const [Loading, setLoading] = useState(0);
  const [ONEbalance, setONEbalance] = useState(0);
  const [tokenMiktari, settokenMiktari] = useState(0);
  const [HowTo, setHowTo] = useState(0);
  const [Rules, setRules] = useState(0);
  const [APY, setAPY] = useState(0);

  useEffect(() => {
    const loadBalance = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          let ONEbalance = await provider.getBalance(address);
          ONEbalance = parseInt(ONEbalance);
          ONEbalance = ONEbalance / 10 ** 18;

          let addressS = address.toString();
          addressS =
            ethers.utils.getAddress(addressS).slice(0, 6) +
            "..." +
            ethers.utils.getAddress(addressS).slice(-4);

          setWalletAddress(address);
          setWalletAddressS(addressS);
          setONEbalance(ONEbalance);
        } catch (error) {
          console.error("Error loading balance:", error);
        }
      } else {
        console.log("Please install MetaMask to use this application.");
        setIsMetaMaskInstalled(false);
      }
    };

    loadBalance();
  }, [LoadBalanceD]);

  useEffect(() => {
    const handleContractFunction = async () => {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Create an instance of the smart contract
        const contract = new ethers.Contract(
          StakingAAddress,
          StakingA.abi,
          signer
        );

        const TokenContract = new ethers.Contract(
          TokenAddress,
          Token.abi,
          signer
        );

        let tokenMiktari = await TokenContract.balanceOf(walletAddress);
        tokenMiktari = parseInt(tokenMiktari);
        let tokenMiktariK = tokenMiktari / ( 10 ** 6);

        tokenMiktariK = tokenMiktariK.toLocaleString('en-US', {
          style: 'decimal',
          maximumFractionDigits: 2,
        });
        settokenMiktari(tokenMiktariK);

        // Call a function on the smart contract

        // const mappingData = await contract.stakes('<address>', '<uint256>');

        let KisiStakeAdedi = await contract.stakeNos(walletAddress);
        KisiStakeAdedi = parseInt(KisiStakeAdedi);

        const kendiStakelerim = [];
        let toplamstakeim = 0;

        for (var i = 1; i <= KisiStakeAdedi; i++) {
          let kendiStakelerimTekil = await contract.stakes(walletAddress, i);

          const stakinDurumu = kendiStakelerimTekil.Active.toString();

          let shortenedAddressA = kendiStakelerimTekil.Staker.toString();
          shortenedAddressA =
            ethers.utils.getAddress(shortenedAddressA).slice(0, 6) +
            "..." +
            ethers.utils.getAddress(shortenedAddressA).slice(-4);

          let StartDateX = parseInt(kendiStakelerimTekil.StartDate);
          StartDateX = StartDateX * 1000;
          let StartDateXZ = new Intl.DateTimeFormat(["ban", "id"], {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }).format(StartDateX);

          let FinishDateX = parseInt(kendiStakelerimTekil.FinishDate);
          FinishDateX = FinishDateX * 1000;
          let FinishDateXZ = new Intl.DateTimeFormat(["ban", "id"], {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }).format(FinishDateX);

          const amountK = parseInt(kendiStakelerimTekil.Amount);
          let amount = amountK / (10 ** 6);
          amount = amount.toLocaleString('en-US', {
            style: 'decimal',
            maximumFractionDigits: 2,
          });

          const prizeK = parseInt(kendiStakelerimTekil.Prize);
          let prize = prizeK / (10 ** 6);
          prize = prize.toLocaleString('en-US', {
            style: 'decimal',
            maximumFractionDigits: 2,
          });

          if (stakinDurumu === "1") {
            kendiStakelerim.push({
              id: kendiStakelerimTekil.id.toString(),
              adres: shortenedAddressA,
              amount: amount,
              amountK: amountK,
              datestart: StartDateXZ,
              prize: prize,
              prizeK: prizeK,
              finishdate: FinishDateXZ,
              amountUnstake: 0,
            });
          }

          toplamstakeim = toplamstakeim + parseInt(kendiStakelerimTekil.Amount) / (10**6);
        }

        setKendiStakelerimG(kendiStakelerim);
        toplamstakeim = toplamstakeim.toLocaleString('en-US', {
          style: 'decimal',
          maximumFractionDigits: 2,
        }); 
        setTotalStaked(toplamstakeim);

        // Handle the result
        console.log("Smart contract function result:");
      } catch (error) {
        console.error("Error calling contract function:", error);
      }
    };

    handleContractFunction();
  }, [walletAddress, TXH]);


    const checkMetaMaskLogin = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          setIsMetaMaskLoggedIn(accounts.length > 0);

          window.ethereum.on("accountsChanged", (Newaccounts) => {
            // Handle wallet change
            setIsMetaMaskLoggedIn(Newaccounts.length > 0);
            setLoadBalanceD(LoadBalanceD + 1);
            console.log("cüzdan değişti");
          });
		  
		  
		  
		  
        } catch (error) {
          console.error("Error checking MetaMask login status:", error);
		
		  
		  
		  
        }
      }
    };

    checkMetaMaskLogin();


  const updateStakeAmount = async (evt) => {
    setstakeAmount(evt.target.value);
  };

  const updateStakeOption = async (evt) => {
    


    if (evt.target.value === '0') {
    setStakeOption(0);
    setAPY(0);
    } else if (evt.target.value === '1') {
      setStakeOption(1);
      setAPY(1.6);
      } else if (evt.target.value === '2') {
        setStakeOption(2);
        setAPY(2);
        } else if (evt.target.value === '3') {
          setStakeOption(3);
        setAPY(2.5);
      }



  };

  const loadingOn = async () => {
    setLoading(1);
  };

  const loadingOff = async () => {
    setLoading(0);
  };


  const updateUNStakeAmount = (evt, id) => {
    const newValue = evt.target.value;

    setKendiStakelerimG((prevArray) => {
      const newArray = [...prevArray]; // Mevcut diziyi kopyala

      // amountUnstake değeri 40 olan satırın indeksini bul
      const rowIndex = newArray.findIndex((item) => item.id === id);

      if (rowIndex !== -1) {
        newArray[rowIndex].amountUnstake = newValue; // Belirli satıra yeni değeri ata
      }

      return newArray; // Yeni diziyi döndür
    });
  };

  const stakeX = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create an instance of the smart contract
      const contract = new ethers.Contract(
        StakingAAddress,
        StakingA.abi,
        signer
      );


      const TokenContract = new ethers.Contract(
        TokenAddress,
        Token.abi,
        signer
      );

      const stakeAmountK = stakeAmount * 10 ** 6 ;

      let tokenMiktariK = await TokenContract.balanceOf(walletAddress);
      tokenMiktariK = parseInt(tokenMiktariK);
	  
	  let status = await contract.status();
      status = parseInt(status);
	  
	  let kullanimS = await contract.KullanimS(walletAddress);
       kullanimS = parseInt(kullanimS);

      let simdi = await contract.simdi();
      simdi = parseInt(simdi);
      kullanimS = kullanimS + 3600; // 3600 bir saatlik saniye


      if (simdi < kullanimS) {
        let fark = kullanimS - simdi;
        fark = fark / 60;
        fark = parseInt(fark, 10);
        Swal.fire({
          text: 'You need to wait for ' + fark + ' minutes for your next transaction',
          width: 300,
         
      });
      } else if (status === 0) {
        Swal.fire({
          text: 'New staking entrance is not active at this time',
          width: 300,
         
      });
      } else if (tokenMiktariK < stakeAmountK) {
        Swal.fire({
          text: 'You do not have enough LOP tokens in your wallet',
          width: 300,
         
      });
      } else if (stakeAmount < 1) {
        Swal.fire({
          text: 'Stake amount can not be less than 1',
          width: 300,
         
      });
      } else if (ONEbalance < 0.1) {
        Swal.fire({
          text: 'You need to have at least 0.1 ONE in your wallet to continue this operation',
          width: 300,
         
      });
      } else if ( StakeOption === 0) {

        Swal.fire({
          text: 'Please choose an option to continue staking',
          width: 300,
         
      });

      } else {

      let Verilmisizin = await TokenContract.allowance(
        walletAddress,
        StakingAAddress
      );
      Verilmisizin = parseInt(Verilmisizin);



      if (Verilmisizin === 0) {
        const transactionizin = await TokenContract.increaseAllowance(
          StakingAAddress,
          stakeAmountK,
          {
            from: walletAddress,
            gasPrice: 101000000000,
          }
        );
        loadingOn();
        await transactionizin.wait(); // Wait for the transaction to be confirmed on the blockchain
        loadingOff();



        const transaction = await contract.stake(stakeAmountK, StakeOption, {
          from: walletAddress,
          gasPrice: 101000000000,
        });
        loadingOn();
        await transaction.wait(); // Wait for the transaction to be confirmed on the blockchain
        loadingOff();
        // Transaction confirmed, execute the success handling code
  
        setTXH(TXH + 1);


      } else if (Verilmisizin < stakeAmountK) {
        const fark = stakeAmountK - Verilmisizin;

        const transactionizin = await TokenContract.increaseAllowance(
          StakingAAddress,
          fark,
          {
            from: walletAddress,
            gasPrice: 101000000000,
          }
        );
        loadingOn();
        await transactionizin.wait(); // Wait for the transaction to be confirmed on the blockchain
        loadingOff();



        const transaction = await contract.stake(stakeAmountK, StakeOption, {
          from: walletAddress,
          gasPrice: 101000000000,
        });
        loadingOn();
        await transaction.wait(); // Wait for the transaction to be confirmed on the blockchain
        loadingOff();
        // Transaction confirmed, execute the success handling code
  
        setTXH(TXH + 1);



      } else {



        const transaction = await contract.stake(stakeAmountK, StakeOption, {
          from: walletAddress,
          gasPrice: 101000000000,
        });
        loadingOn();
        await transaction.wait(); // Wait for the transaction to be confirmed on the blockchain
        loadingOff();
        // Transaction confirmed, execute the success handling code
  
        setTXH(TXH + 1);




      }











      


    }








    } catch (err) {
      // Error handling code
      console.error(err);

      setTXH(TXH + 1);
    }
  };

  const UnstakeX = async (UNid, UNamount, PrizeK, finish, amountK) => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create an instance of the smart contract
      const contract = new ethers.Contract(
        StakingAAddress,
        StakingA.abi,
        signer
      );

      const TokenContract = new ethers.Contract(
        TokenAddress,
        Token.abi,
        signer
      );

      const UNamountK = UNamount * 10 ** 6;
		
		let kullanimS = await contract.KullanimS(walletAddress);
       kullanimS = parseInt(kullanimS);

      let simdi = await contract.simdi();
      simdi = parseInt(simdi);
      kullanimS = kullanimS + 3600; // 3600 bir saatlik saniye

      let tokenMiktariK = await TokenContract.balanceOf(StakingAAddress);
      tokenMiktariK = parseInt(tokenMiktariK);

      let UNamountKK = 0;

        if ( simdi < finish ) {

          UNamountKK = UNamountK; 

        } else {

          UNamountKK = PrizeK + amountK;

        }

      


      if (simdi < kullanimS) {
        let fark = kullanimS - simdi;
        fark = fark / 60;
        fark = parseInt(fark, 10);
        Swal.fire({
          text: 'You need to wait for ' + fark + ' minutes for your next transaction',
          width: 300,
         
      });
      } else if (UNamountKK > tokenMiktariK) {

        Swal.fire({
          text: 'Contract is out of balance. Code 422. Please tell this problem to the team via Telegram or Twitter',
          width: 300,
         
      });

      } else if (ONEbalance < 0.1) {
        Swal.fire({
          text: 'You need to have at least 0.1 ONE in your wallet to continue this operation',
          width: 300,
         
      });
      } else {

      const transaction = await contract.unstake(UNid, UNamountK, {
        from: walletAddress,
        gasPrice: 101000000000,
      });
      loadingOn();
      await transaction.wait(); // Wait for the transaction to be confirmed on the blockchain
      loadingOff();
      // Transaction confirmed, execute the success handling code

      setTXH(TXH + 1);
	  
	  
	  
		}
	  
	  
	  
    } catch (err) {
      // Error handling code
      setTXH(TXH + 1);
      console.error(err);
    }
  };

  return (
    <div className="ilkDiv">
<div className="topSide">
        <div className="topSidekutu">
          <div className="topSidebutton">
            <button
              className="button-64"
              onClick={(event) => {
                event.preventDefault();

                if (HowTo === 0) {
                  setHowTo(1);
                } else {
                  setHowTo(0);
                }
              }}
            >
              How to use
            </button>
          </div>

          {HowTo === 1 && (
            <div className="top">
              <p>
                You need to have LOP tokens on Harmony Chain(Metamask) to use
                this Staking System
              </p>
              <p>
                If you do not have any LOP tokens and do not know how to use
                Metamask
              </p>
              <p>
              <a href="https://youtu.be/YetARTZl8yo?si=0QM3_u89bbQ78yD0" target="_blank" rel="noreferrer noopener">Click Here</a> to learn how to buy LOP tokens and use Metamask
              </p>
            </div>
          )}
        </div>
        <div className="topSidekutu">
          <div className="topSidebutton">
            <button
              className="button-64"
              onClick={(event) => {
                event.preventDefault();

                if (Rules === 0) {
                  setRules(1);
                } else {
                  setRules(0);
                }
              }}
            >
              Rules
            </button>
          </div>
          {Rules === 1 && (
            <div className="top">
              <p>There are 3 Staking Options in this Staking system. All options have locking mechanism.</p>
              <p>
                If you unstake your tokens before the locking period ends, the system will charge you a 0,1% penalty and
              </p>
              <p>you will lose the portion of your prizes corresponding to the unstake amount</p>
              <p>
                If you unstake your tokens after the locking period ends, You will receive your tokens and rewards together without any penalty.
              </p>
              <p>
                Option 1: (Locking for 3 months, APY is 1,6%)
              </p>
              <p>
                Option 2: (Locking for 6 months, APY is 2%)
              </p>
              <p>
                Option 3: (Locking for 12 months, APY is 2,5%)
              </p>
              <p>
                APY = Annual Percentage Yield ( The rate for 1 year )
              </p>
            </div>
          )}
        </div>
      </div>

      {Loading === 1 && (
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}

      <div className="motherDiv">
        <h1>Kilopi Locked Staking (Harmony)</h1>
      
      {isMetaMaskInstalled ? (
        <>
          {isMetaMaskLoggedIn ? (
            <>
              <div className="top">
                <p>Your Address: {walletAddressS} </p>
                <p>Your LOP tokens: {tokenMiktari} </p>
                <p>Your Total Staked: {TotalStaked} </p>
                </div>
                <div className="putStake">
                  {" "}
                  <h4 className="h4">APY {APY}%</h4>
                  <select
                    className="input"
                    name="options"
                    id="options"
                    onChange={updateStakeOption}
                  >
                    <option value="0">Option</option>
                    <option value="1">3 Months</option>
                    <option value="2">6 Months</option>
                    <option value="3">12 Months</option>
                  </select>
                  <input
                    id="stakeInput"
                    type="number"
                    value={stakeAmount}
                    onChange={updateStakeAmount}
                  />
                  <button
                    className="button-64"
                    onClick={(event) => {
                      event.preventDefault();
                      stakeX();
                    }}
                  >
                    Stake
                  </button>
                </div>
                <table className="table">
                  <thead className="tableTop">
                    <tr>
                      <th className="td" id="amount">
                        Amount
                      </th>
                      <th className="td" id="unstake">
                        Unstake
                      </th>
                      <th className="td" id="startDate">
                        Start
                      </th>
                      <th className="td" id="cPrize">
                        Prize
                      </th>

                      <th className="td" id="LPR">
                        Finish
                      </th>
                    </tr>
                  </thead>
                  <tbody className="stacksDiv">
                    {KendiStakelerimG.map((A) => {
                      return (
                        <tr key={A.id} className="stacks">

                          <td className="td">{A.amount}</td>
                          <td className="td">
                            <input
                              className="input"
                              type="number"
                              id={A.id}
                              value={A.amountUnstake}
                              onChange={(event) =>
                                updateUNStakeAmount(event, A.id)
                              }
                            />

                            <button
                              className="button-64"
                              onClick={(event) => {
                                event.preventDefault();
                                UnstakeX(A.id, A.amountUnstake, A.prizeK, A.finishdate, A.amountK);
                              }}
                            >
                              Unstake
                            </button>
                          </td>
                          <td className="td" id="startDateB">{A.datestart}</td>
                          <td className="td" id="cPrizeB">{A.prize}</td>
                          <td className="td" id="LPRB">{A.finishdate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              
            </>
          ) : (
            <p>Please log in to your MetaMask wallet.</p>
          )}
        </>
      ) : (
        <p>Please install MetaMask to use this application.</p>
      )}
      </div>
    </div>
  );
};

export default App;
