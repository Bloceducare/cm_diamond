import { MdOutlineSecurity } from "react-icons/md"
import { TbLockAccess } from "react-icons/tb"
import { VscBook } from "react-icons/vsc"


const Approach = () => {
    return (
        <section className="flex flex-col md:gap-12 gap-8 lg:my-36 md:my-20 my-20">
            <h1 className="font-bold text-color2 lg:text-4xl md:text-3xl text-3xl text-center">Our Approach</h1>
            <main className="w-full grid md:grid-cols-3 lg:gap-8 md:gap-6 gap-8 lg:px-20 px-4">
                {/* one */}
                <div className="flex flex-col cursor-pointer group items-start bg-color2 px-8 py-12 rounded-md">
                    <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center text-color2 group-hover:bg-color1">
                        <MdOutlineSecurity className="text-xl text-color2 group-hover:text-white" />
                    </div>
                    <h1 className="text-white mt-8 font-semibold">Transparent Data Security</h1>
                    <p className="text-gray-200 mt-3 text-sm">Using blockchain, classmate securely stores student data and attendance with encrypted, tamper-proof entries.</p>
                </div>

                {/* two */}
                <div className="flex flex-col cursor-pointer group items-start bg-color2 px-8 py-12 rounded-md">
                    <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center text-color2 group-hover:bg-color1">
                        <TbLockAccess className="text-xl text-color2 group-hover:text-white" />
                    </div>
                    <h1 className="text-white mt-8 font-semibold">Decentralized Access Control</h1>
                    <p className="text-gray-200 mt-3 text-sm">Classmate’s decentralized framework ensures only authorized individuals can access or modify student records.</p>
                </div>

                {/* three */}
                <div className="flex flex-col cursor-pointer group items-start bg-color2 px-8 py-12 rounded-md">
                    <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center text-color2 group-hover:bg-color1">
                        <VscBook className="text-xl text-color2 group-hover:text-white" />
                    </div>
                    <h1 className="text-white mt-8 font-semibold">Immutable Record Keeping</h1>
                    <p className="text-gray-200 mt-3 text-sm">Blockchain integration allows classmate to log attendance and student records permanently for easy auditing.</p>
                </div>
            </main>
        </section>
    )
}

export default Approach