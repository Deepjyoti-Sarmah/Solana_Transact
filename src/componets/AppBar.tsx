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
                            <WalletMultiButton />
                        </div>
                    </div>
                </div>
            </nav>
    </div>
  )
}

export default AppBar;