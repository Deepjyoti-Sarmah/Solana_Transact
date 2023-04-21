import { useState } from "react";

interface Props {
    receiverAddress: string;
    handleCreateAssociatedTokenAcc: () => void;
    handleClose: () => void;
}

export default function TokenAccCreateModal(props: Props) {
    const [close, setClose] = useState(false);
    return (
        <>
        <div className="h-full w-full absolute left-1/2 top-1/2 translate-x-50prev translate-y-50prev bg-black opacity-50"></div>
        <div className={`w-130 absolute left-1/2 top-0 opacity-0 ml-45rev rounded-lg bg-neutral-200 border border-zinc-900 shadow-xl ${close ? "top-1/3 opacity-100 animate-slideout" : "top-0 opacity-0 animate-slidein"}`}>
            <p className="m-0 p-3 text-xl border-b border-zinc-900">Create Associated Token Account</p>
            <div className="p-3">
            The reciever {props.receiverAddress} doesn't have an associated token account.
            <br />
            <br />
            Do you want to create an Associated Token Account for the receiver address?
            </div>
            <div className="py-2 px-3 border-t border-zinc-900">
            <button
                className="w-12 mr-3 p-1 mt-2 rounded border transition-all hover:bg-highlighthoverlight hover:border-highlightlighter border-transparent bg-highlightlighter"
                onClick={(e) => {
                e.preventDefault();
                setClose(true);
                props.handleClose();
                }}
            >
                No
            </button>
            <button
                className="p-1 px-2 mt-2 rounded border transition-all hover:bg-highlighthover hover:border-highlightdarker border-transparent text-navtext bg-highlight"
                onClick={(e) => {
                e.preventDefault();
                setClose(true);
                props.handleCreateAssociatedTokenAcc();
                }}
            >
                Continue
            </button>
            </div>
        </div>
        </>
    );
}
