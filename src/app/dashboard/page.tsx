'use client'

export default function Dashboard() {
    return (
        <div className="flex flex-col justify-center items-start bg-purple-500 h-screen w-96 rounded-r-[6rem] overflow-hidden"> 
        <div className="w-full h-full">
        <div className="flex justify-center items-center gap-4 h-1/4 w-full border-b-2 border-black shadow-[0_20px_30px_rgba(0,0,0,0.3)] rounded-tr-[6rem]">
            <div className="text-white text-5xl p-4 w-1/4 text-center" style={{ fontFamily: 'Slackey, Inter' }}>Logo</div>
        </div>
        <div className="flex justify-end mt-[8rem] text-left">
            <button className="absolute bg-[#fddeb8] rounded-l-full w-[20rem] h-[5rem] text-black pl-9 text-left after:content-[''] after:absolute after:w-[9rem] after:h-[9rem] after:bg-[#fddeb8] after:rounded-full after:right-[-40px] after:top-1/2 after:-translate-y-1/2">haiisdsds</button>
        </div>
        </div>
          
        </div>

        
    );
}

