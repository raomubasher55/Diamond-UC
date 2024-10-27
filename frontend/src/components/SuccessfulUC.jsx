import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { Oval } from 'react-loader-spinner'; // Import the TailSpin loader
import { Link } from 'react-router-dom';
import axios from 'axios';

import Garena from "../assets/pubg-images/gareena-removebg-preview.png"
import BG_Diamond1 from "../assets/pubg-images/1000312206-removebg-preview.png"
import ImageFire from "../assets/pubg-images/1000312233-removebg-preview.png"
import VisaCard from "../assets/pubg-images/visa-logo-png-transparent-removebg-preview.png"
import VisaGolden from "../assets/pubg-images/visa-gold-removebg-preview.png"
import MasterCard from "../assets/pubg-images/Mastercard-Logo.wine.png"
import UCImage1 from "../assets/pubg-images/uc-small.bc30c95b.png"
import Globe from "../assets/pubg-images/globe-image.png"
import Diamond from "../assets/pubg-images/single-diamond.png";
import TickImage from "../assets/pubg-images/tick-mark-icon.webp"
import USA_Logo from '../assets/pubg-images/Flag_of_the_United_States.png'
import { toast, ToastContainer } from 'react-toastify';


const initialPackages = [
  { id: 1, package_name: "60 + 30 UC", playerIdd: 1236249952, card_type: "Master", price_usd: 0.99, uc_amount: 10, bonus_uc: 30, total_uc: 60, picURL: BG_Diamond1 },
  { id: 2, package_name: "300 + 25 UC", playerIdd: 2136249842, card_type: "Visa", price_usd: 4.99, uc_amount: 15, bonus_uc: 25, total_uc: 325, picURL: BG_Diamond1 },
  { id: 3, package_name: "600 + 60 UC", playerIdd: 3216249732, card_type: "Visa Golden", price_usd: 9.99, uc_amount: 20, bonus_uc: 60, total_uc: 660, picURL: BG_Diamond1 },
  { id: 4, package_name: "1500 + 300 UC", playerIdd: 1326249622, card_type: "Visa Golden", price_usd: 24.99, uc_amount: 30, bonus_uc: 300, total_uc: 1800, picURL: BG_Diamond1 },
  { id: 5, package_name: "3000 + 850 UC", playerIdd: 2316249512, card_type: "Visa", price_usd: 49.99, uc_amount: 40, bonus_uc: 850, total_uc: 3850, picURL: BG_Diamond1 },
  { id: 6, package_name: "6000 + 2100 UC", playerIdd: 1336249402, card_type: "Master", price_usd: 99.99, uc_amount: 60, bonus_uc: 2100, total_uc: 8100, picURL: BG_Diamond1 },
  { id: 7, package_name: "7000 + 2500 UC", playerIdd: 1216249362, card_type: "Visa Golden", price_usd: 130.99, uc_amount: 100, bonus_uc: 2500, total_uc: 9500, picURL: BG_Diamond1 },
  { id: 8, package_name: "8000 + 3100 UC", playerIdd: 2126249272, card_type: "Master", price_usd: 150.99, uc_amount: 160, bonus_uc: 3100, total_uc: 11100, picURL: BG_Diamond1 },
  { id: 9, package_name: "9000 + 3600 UC", playerIdd: 3136249182, card_type: "Visa", price_usd: 175.99, uc_amount: 200, bonus_uc: 3600, total_uc: 12600, picURL: BG_Diamond1 },
  { id: 10, package_name: "10000 + 4200 UC", playerIdd: 3316249092, card_type: "Visa Golden", price_usd: 200.99, uc_amount: 300, bonus_uc: 4200, total_uc: 14200, picURL: BG_Diamond1 },
  { id: 11, package_name: "11000 + 4500 UC", playerIdd: 1136241355, card_type: "Master", price_usd: 220.99, uc_amount: 400, bonus_uc: 4500, total_uc: 15500, picURL: BG_Diamond1 },
  { id: 12, package_name: "12000 + 4800 UC", playerIdd: 2116249142, card_type: "Visa", price_usd: 250.99, uc_amount: 500, bonus_uc: 4800, total_uc: 16800, picURL: BG_Diamond1 }
];


function SuccessfulUC() {
  const [packages, setPackages] = useState(initialPackages);
  const [searchVal, setSearchVal] = useState("")
  const [searchId, setSearchId] = useState('');
  const [filteredPackages, setFilteredPackages] = useState(initialPackages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false);

  // Loadings handling
  const [showLoader, setShowLoader] = useState(true);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [modalContentVisible, setModalContentVisible] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setShowLoader(true);
      setShowContinueButton(false);
      setModalContentVisible(false);
      const timer = setTimeout(() => {
        setModalContentVisible(true);
        setShowLoader(false);
        setShowContinueButton(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  const handleContinue = () => {
    setShowContinueButton(false);
    setModalContentVisible(true);
    setShowLoader(false);
    setIsLoading(false)
    setPaymentStatus(false)
  };

  useEffect(() => {
    setFilteredPackages(
      packages.filter(pkg => pkg.playerIdd.toString().includes(searchId))
    );
  }, [searchId, packages]);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        const exchangeRate = await response.data.rates.PKR;
        updatePackagesWithPKR(exchangeRate);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    };

    fetchExchangeRate();
  }, []);

  const updatePackagesWithPKR = (exchangeRate) => {
    const updatedPackages = packages.map(pkg => {
      const pricePkr = (pkg.price_usd * exchangeRate).toFixed(2);
      return { ...pkg, price_pkr: pricePkr };
    });

    setPackages(updatedPackages);
  };



  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
  };

  const handleSearchChangeBtn = () => {

    if (searchVal == "") {
      toast.error("Enter Valid the ID!")
    } else {
      setSearchId(searchVal);
    }

  }

  const handlePackageClick = (pkg) => {
    if (searchVal == "") {
      toast.error("Enter Valid the ID!")
    }
    else {
      setSelectedPackage(pkg);
      setIsModalOpen(true);
      setPaymentStatus(false)

    }
  };




  const handlePaymentSubmit = () => {

    setIsLoading(true);
    setPaymentStatus(false)
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus(true)
    }, 5000);
  };

  const handleback = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
    setIsLoading(false);
    setPaymentStatus(false)
    setSearchVal("")

  }

  const closeAll = () => {
    setIsModalOpen(false)
    setPaymentStatus(false)
    setIsLoading(false)
    setSearchVal("")
  }



  return (
    <div className="h-auto bg-[rgb(20,27,61)] min-h-screen p-2 flex justify-around items-center">

      <div className="h-[auto] w-[1000px] setting-main flex items-center flex-col justify-center bg-[#171F45] mx-auto my-5">
        <div className="h-[auto] w-[1000px] setting-main mx-auto p-4">
          <h1 class="text-xl font-medium mt-2 text-white flex bg-[#141B3D] py-2 px-3 w-[50%]"> <img className='h-[30px] w-[50px]' src={USA_Logo} alt="Image Verify" />  <span className='ml-3'>(USA:5317) Connected: Balance $725821.21</span>
          </h1>

        </div>
        <h1 class="text-3xl font-bold text-center text-red-500 mb-1 text-shadow">Dark Server Carding Diamonds</h1>
        <div className='w-[70%] h-[60px] flex justify-center items-center gap-x-2 mb-2'>
        <img className='h-11 w-11' src={Garena} alt="Garena Topup" />
        <h1 className="text-2xl font-semibold text-center mb-2 text-white">  Garena Topup Center Connected Successfully</h1>

        </div>

        <div className='w-full m-auto flex items-center justify-center mb-2 gap-5'>

          <input
            type="text"
            placeholder="Search by ID"
            onChange={handleSearchChange}
            value={searchVal}
            className="w-[50%] bg-white border-none outline-none border-gray-300 rounded p-2 "
          />
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            onClick={handleSearchChangeBtn}
          >
            Search
          </button>
        </div>

        <div className="card-parent h-auto w-[100%] flex items-center flex-wrap justify-center gap-5">

          {filteredPackages.map(pkg => (
            <div onClick={() => handlePackageClick(pkg)} key={pkg.id} className="card bg-[#1B234D] shadow-lg  rounded-lg overflow-hidden w-[23%] cursor-pointer">
              <div className="BGImage h-[108px] overflow-hidden bg-cover relative bg-center flex justify-center items-center cursor-pointer">
                <img src={pkg.picURL} alt="UCImage" className='mt-2' />
                <img src={ImageFire} alt="Free Fire" className='images absolute top-[35%] left-[16%]' />

              </div>
              <div className="card-content p-0">
                <div className="uc-package w-[90%] flex items-center justify-center mb-0">
                  <div className="uc-logo w-16 h-16 flex items-center justify-center rounded-full">
                    <img src={Diamond} alt="Logo" className="w-20 h-12" />
                  </div>
                  <div className="uc-package-value text-center">
                    <h1 className="package-text text-3xl font-bold text-white"> {pkg.uc_amount}k <span className="text-highlight"> De </span> </h1>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* //////////////////////////////////////////////////////////////////////////////////////////////////// */}

        <ReactModal
          isOpen={isModalOpen}
          onRequestClose={closeAll}
          className="modal flex justify-center items-center"
          overlayClassName="modal-overlay"
        >
          {showLoader ? (
            <div className="loader-container flex items-center flex-col justify-center">
              <Oval
                height={80}
                width={80}
                color="#4fa94d"
                ariaLabel="loading"
              />
              <h1 className="text-3xl font-bold text-center mt-2 text-white p-5 text-shadow uppercase">Connecting Main Dark Server</h1>
              <h1 className="text-2xl font-semibold text-center mt-2 text-red-700 p-2 text-shadow">For Carding UC</h1>


            </div>
          ) : (
            showContinueButton ? (
              <div className="loader-container flex items-center flex-col justify-center">
                <h1 className="text-3xl font-bold text-center mt-2 p-5 text-green-400 text-shadow uppercase">Connected with Main Dark Server</h1>

                <button
                  className="continue-button bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                  onClick={handleContinue}
                >
                  Continue
                </button>
              </div>
            ) : (
              modalContentVisible && selectedPackage && (
                <div className="card-model bg-[#1B234D] shadow-lg rounded-lg p-3 w-full">
                  <div className="card-title text-center mb-4">
                    <h1 className="text-3xl font-bold text-white">Carding Cards Payment Method</h1>
                  </div>
                  <div className="card-body grid grid-cols-1 bg-[#1B234D] rounded-lg p-5 lg:grid-cols-2 gap-6">
                    <div className="card-info w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="current-price text-white text-xl font-semibold">Player ID:</h2>
                        {/* <h2 className="price-value text-white">{selectedPackage.playerIdd}</h2> */}
                        <h2 className="price-value text-white">{searchVal}</h2>
                      </div>
                      <h2 className="text-lg text-white mb-5">Select Carding Payment Channels</h2>
                      <div className="space-y-4">
                        {/* start */}
                        <div className="cards flex items-center justify-between bg-[#141B3D] rounded-md pe-5">
                          <div className='flex items-center'>

                            <div className="card-image w-16 h-10 mr-4">
                              <img src={VisaCard} alt="visa" className="w-full h-full object-contain" />
                            </div>
                            <div className="card-data">
                              <h2 className="text-white">(Visa:9628) Connected: Balance $9061.21
                              </h2>
                            </div>
                          </div>
                          <input type="checkbox" name='a' className='h-5 w-5 cursor-pointer' />
                        </div>

                        <div className="cards flex items-center justify-between bg-[#141B3D] rounded-md pe-5">
                          <div className='flex items-center'>

                            <div className="card-image w-16 h-10 mr-4">
                              <img src={MasterCard} alt="masterCard" className="w-full h-full object-contain rounded-md" />
                            </div>
                            <div className="card-data">
                              <h2 className="text-white">(Master:1262) Connected: Balance $28000.89</h2>
                            </div>
                          </div>
                          <input type="checkbox" name='a' className='h-5 w-5 cursor-pointer' />
                        </div>
                        <div className="cards flex items-center justify-between bg-[#141B3D] rounded-md pe-5">
                          <div className='flex items-center '>
                            <div className="card-image w-16 h-10 mr-4">
                              <img src={VisaGolden} alt="visaGolden" className="w-full h-full object-contain" />
                            </div>
                            <div className="card-data">
                              <h2 className="text-white">(Golden:0089) Connected: Balance $85000.12</h2>
                            </div>
                          </div>
                          <input type="checkbox" name='a' className='h-5 w-5 cursor-pointer' />
                        </div>
                        <div className="cards flex items-center justify-between bg-[#141B3D] rounded-md pe-5">
                          <div className='flex items-center '>
                            <div className="card-image w-16 h-10 mr-4 pl-2">
                              <img src={USA_Logo} alt="visaGolden" className="w-full h-full object-contain" />
                            </div>
                            <div className="card-data">
                              <h2 className="text-white"> (USA:5317) Connected: Balance $725821.21
                              </h2>
                            </div>
                          </div>
                          <input type="checkbox" name='a' className='h-5 w-5 cursor-pointer' />
                        </div>
                        {/* end */}
                      </div>
                    </div>
                    <div className="payment-submit-part bg-[#141B3D] p-6 rounded-lg shadow-md">
                      <h1 className="text-xl font-semibold text-white mb-4">Purchase Item:</h1>
                      <div className="item-info flex items-center mb-4">
                        <img src={UCImage1} alt="" className="w-16 h-16 mr-4" />
                        <h2 className="uc-amount text-lg text-white">{selectedPackage.uc_amount}k UC</h2>
                      </div>
                      <div className="item-info mb-4">
                        <h2 className="price-details text-lg font-semibold text-white mb-2">Price Details:</h2>
                        <div className="prices w-full flex justify-between items-center">
                          <h2 className="current-price text-white">Current Price:</h2>
                          <h2 className="price-value text-white">Card Connected</h2>
                        </div>
                      </div>
                      <h1 className="text-lg font-semibold text-white mb-4">Total: Carding Card Connected</h1>
                      <button className="submit-button w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300" onClick={handlePaymentSubmit} disabled={isLoading}>
                        UC Send New
                      </button>
                      {
                        <div>
                          {isLoading ? (
                            <div className="box-loader w-full flex justify-center items-center bg-white">
                              <div className="bg-[#141B3D] w-full shadow-lg rounded-lg p-6 md:w-2/3 lg:w-1/2 xl:w-1/2">
                                <div className="flex flex-col items-center">
                                  <div className="text-center mt-4">
                                    {
                                      paymentStatus ? (
                                        <>
                                          <div className="parent-loader">
                                            <div className="loader1">

                                              <img className='tickImage' src={TickImage} alt="globeImage" />
                                            </div>

                                          </div>
                                          <h2 className="text-2xl font-bold text-white ">{selectedPackage.uc_amount}k UC</h2>
                                          <h3 className="text-lg text-white">SENDING SUCCESSFULLY <br /> VIA PUBG ID: {searchVal} </h3>
                                          <Link className='border border-red-600 inline-block mt-4 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition duration-300' onClick={handleback} to="/">Home</Link>
                                        </>
                                      ) : (
                                        <>
                                          <div className="parent-loader">
                                            <div className="loader">
                                              <img className='globe' src={Globe} alt="globeImage" />
                                              <img className='glob1' src={Globe} alt="globeImage" />
                                            </div>

                                          </div>
                                          <h2 className="text-2xl relative font-bold text-white ">UC Sending...</h2>
                                          <h3 className="text-lg text-white">Please Wait For Sending UC
                                          </h3>

                                        </>
                                      )
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      }
                    </div>
                  </div>
                </div>

              )
            )
          )
          }
        </ReactModal>
      </div>
          <ToastContainer/>
    </div>
  );
}

export default SuccessfulUC;
