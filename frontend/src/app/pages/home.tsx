import { FaArrowDown } from "react-icons/fa";

const HomeM = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-[#181616] text-white min-h-[calc(100vh-80px)] ">
      <div className="text-4xl mb-[150px]">Swap anytime, <br/> <span className="m-[36px]">anywhere.</span></div>
      <div className="w-full max-w-xl bg-[#131313] rounded-2xl border border-gray-700 shadow-lg p-[10px] relative -mt-[120px]">
        {/* Sell Section */}
        <div className="p-[20px] rounded-xl border border-gray-600 bg-transparent">
          <p className="text-gray-400 text-xl">Sell</p>
          <div className="flex justify-between items-center mt-2">
            <input
              type="number"
              placeholder="0"
              className="bg-transparent text-[40px] mt-[-10px] w-full focus:outline-none"
            />
            <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-lg cursor-pointer">
              {/* <img src="/eth-icon.png" alt="ETH" className="w-5 h-5" /> */}
              <p className="text-white text-lg w-[50px] flex itens-center justify-center">
                $KWAG
              </p>
            </div>
          </div>
          <p className="text-gray-500 text-lg">$0</p>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center p-[4px] rounded-2xl mx-auto absolute bg-[#131313] bottom-[205px] left-[250px] cursor-pointer">
          <div className="bg-[#1b1b1b] p-[15px] rounded-2xl">
            <FaArrowDown className="text-[22px] " />
          </div>
        </div>

        {/* Buy Section */}
        <div className="p-[20px] rounded-xl border border-gray-600 bg-[#242424] mt-[5px]">
          <p className="text-gray-400 text-xl">Buy</p>
          <div className="flex justify-between items-center mt-2">
            <input
              type="number"
              placeholder="0"
              className="bg-transparent text-[40px] mt-[-10px] w-full focus:outline-none"
            />
            <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-lg cursor-pointer">
              {/* <img src="/eth-icon.png" alt="ETH" className="w-5 h-5" /> */}
              <p className="text-white text-lg w-[50px] flex itens-center justify-center">
                $BLT
              </p>
            </div>
          </div>
          <p className="text-gray-500 text-lg">$0</p>
        </div>

        {/* Submit Button */}
        <button className="w-full mt-4 font-bold bg-[#0e76fd] text-white py-3 rounded-xl text-xl">
          SWAP{" "}
        </button>
      </div>
    </div>
  );
};

export default HomeM;
