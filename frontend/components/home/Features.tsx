import icon1 from "../../public/guest/icon_learning.png";
import icon2 from "../../public/guest/icon_analytics.png";
import icon3 from "../../public/guest/icons_content-new.png";
import Image from "next/image";

const Features = () => {
    return (
        <section className="w-full flex flex-col items-center">
            <h1 className="font-bold text-color2 lg:text-4xl md:text-3xl text-3xl text-center">Our Comprehensive Features</h1>
            <p className="font-medium text-color2 md:text-lg text-center lg:w-1/2 md:w-[65%] mt-3 px-3 md:px-0">Our platform is designed to empower your learning with a comprehensive suite of features that helps your gaining knowledge</p>

            <main className="w-full relative z-10 grid md:grid-cols-3 gap-12 my-16 lg:px-20 px-4 before:absolute before:top-8 before:left-1/2 md:before:w-[70%] before:-z-10 before:-translate-x-[50%] md:before:h-8 before:border-t-2 before:border-dashed before:border-color1 ">
                <div className="bg-transparent flex flex-col items-center">
                    <div className="bg-color1 outline-dashed outline-color1 outline-offset-[14px] px-9 py-3 rounded-md flex items-center justify-center">
                        <Image src={icon1} alt="Icon" priority width={50} height={50} />
                    </div>
                    <h1 className="text-color2 text-center text-lg mt-8 font-semibold">Interactive Learning</h1>
                    <p className="text-color3 mt-3 text-center">Interactive modules for engaging learning experiences</p>
                </div>


                <div className="bg-transparent flex flex-col items-center">
                    <div className="bg-color1 outline-dashed outline-color1 outline-offset-[14px] px-9 py-3 rounded-md flex items-center justify-center">
                        <Image src={icon2} alt="Icon" priority width={50} height={50} />
                    </div>
                    <h1 className="text-color2 text-center text-lg mt-8 font-semibold">Analytic Dashboard</h1>
                    <p className="text-color3 mt-3 text-center">Analytics dashboard for comprehensive insights
                    </p>
                </div>


                <div className="bg-transparent flex flex-col items-center">
                    <div className="bg-color1 outline-dashed outline-color1 outline-offset-[14px] px-9 py-3 rounded-md flex items-center justify-center">
                        <Image src={icon3} alt="Icon" priority width={50} height={50} />
                    </div>
                    <h1 className="text-color2 text-center text-lg mt-8 font-semibold">Tailored Content</h1>
                    <p className="text-color3 mt-3 text-center">Tailored content to create and add programmes you want
                    </p>
                </div>
            </main>
        </section>
    )
}

export default Features