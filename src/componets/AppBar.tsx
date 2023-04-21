// import React from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const AppBar = () => {
  return (
    <div>
        <nav className=' bg-slate-900 fixed w-full text-white p-2 top-0 z-10'>
                <div className='flex flex-row justify-between items-center mx-auto p-4'>
                    <a href="/" className='text-2xl font-extrabold'>DevNet</a>
                    <div>
                        <div>
                            {/* <button className='bg-amber-500  text-black active:bg-blue-800 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'>Select Wallet</button> */}
                            <WalletMultiButton />
                        </div>
                    </div>
                </div>
            </nav>
    </div>
  )
}

export default AppBar;